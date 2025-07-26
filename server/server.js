const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
const { mcpManager } = require('./mcpClient');
require('dotenv').config();

// Add fetch for Node.js versions < 18
if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI client for Moonshot
const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: 'https://api.moonshot.cn/v1',
});

// Utility function to extract and shorten user query for Algolia search
function extractSearchQuery(userMessage) {
  // Get the last user message content
  const content = typeof userMessage === 'string' ? userMessage : userMessage.content;
  
  // Remove common conversational words and limit length
  const cleanedQuery = content
    .replace(/\b(can you|could you|please|help me|i want to|i need to|tell me about)\b/gi, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100); // Limit to 100 characters
  
  return cleanedQuery || content.substring(0, 50);
}

// Function to fetch Algolia context using the MCP searchSingleIndex tool
async function fetchAlgoliaContext(query) {
  try {
    console.log(`🔍 Fetching Algolia context for query: "${query}"`);
    
    const searchResult = await mcpManager.callTool('searchSingleIndex', {
      applicationId: 'R3W7QPM5ML',
      indexName: 'prism-data',
      requestBody: {
        params: `hitsPerPage=1&query=${query}`
      }
    });

    if (searchResult && searchResult.content) {
      console.log(`✅ Algolia search successful, got context`);
      return searchResult.content;
    } else {
      console.log(`⚠️ Algolia search returned no results`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to fetch Algolia context:`, error);
    return null;
  }
}

// Function to save file analysis results to Algolia
async function saveFileAnalysisToAlgolia(analysisResult) {
  try {
    console.log(`💾 Saving file analysis to Algolia for: "${analysisResult.fileName}"`);
    
    // Map file type to resource_type
    const resourceTypeMap = {
      'Video': 'video',
      'Audio': 'audio', 
      'Image': 'image',
      'PDF': 'document',
      'Text': 'text',
      'Unknown': 'file'
    };
    
    const resourceType = resourceTypeMap[analysisResult.fileType] || 'file';
    
    const algoliaRecord = {
      resource_details: analysisResult.description,
      resource_type: resourceType,
      fileName: analysisResult.fileName,
      fileSize: analysisResult.fileSize,
      uploadDate: new Date().toISOString()
    };

    const saveResult = await mcpManager.callTool('saveObject', {
      applicationId: 'R3W7QPM5ML',
      indexName: 'prism-data',
      requestBody: algoliaRecord
    });

    if (saveResult) {
      console.log(`✅ File analysis saved to Algolia successfully`);
      return { success: true, result: saveResult };
    } else {
      console.log(`⚠️ Algolia save returned no result`);
      return { success: false, error: 'No result from Algolia' };
    }
  } catch (error) {
    console.error(`❌ Failed to save file analysis to Algolia:`, error);
    return { success: false, error: error.message };
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize MCP servers on startup
async function initializeMCPServers() {
  console.log('🚀 Initializing MCP servers...');
  
  // Example: Connect to a local MCP server
  // You can configure these in environment variables
  const mcpServers = [
    {
      id: 'algolia-mcp-server',
      command: '/home/ubuntu/.nvm/versions/node/v22.17.1/bin/node',
      args: [
        '--experimental-strip-types',
        '--no-warnings=ExperimentalWarning', 
        '/home/ubuntu/projects/algolia-mcp-ui-app/mcp-node/src/app.ts'
      ],
      env: {
        HOME: '/home/ubuntu',
        USER: 'ubuntu',
        SHELL: '/bin/bash',
        TERM: 'xterm-256color'
      }
    },
   
  ];

  for (const server of mcpServers) {
    try {
      const { id, command, args, token, ...serverConfig } = server;
      await mcpManager.connectServer(id, command, args, token, serverConfig);
    } catch (error) {
      console.warn(`⚠️ Could not connect to MCP server ${server.id}:`, error.message);
    }
  }

  console.log('✅ MCP initialization complete');
}

// Health check endpoint
app.get('/health', (req, res) => {
  const mcpServers = mcpManager.getServersInfo();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.MOONSHOT_API_KEY,
    mcpServers
  });
});

// Get MCP servers and tools info
app.get('/api/mcp/info', (req, res) => {
  const servers = mcpManager.getServersInfo();
  const tools = mcpManager.getOpenAITools();
  
  res.json({
    servers,
    tools: tools.map(t => ({
      name: t.function.name,
      description: t.function.description
    }))
  });
});

// Chat endpoint with MCP tools integration
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.MOONSHOT_API_KEY) {
      return res.status(500).json({ error: 'Moonshot API key not configured' });
    }

    // Get the last user message to extract search query
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    let contextualMessages = [...messages];
    
    // Fetch Algolia context if we have a user message
    if (lastUserMessage) {
      const searchQuery = extractSearchQuery(lastUserMessage);
      const algoliaContext = await fetchAlgoliaContext(searchQuery);
      
      if (algoliaContext) {
        // Add context as a system message before the conversation
        const contextMessage = {
          role: 'system',
          content: `Here is relevant context from the knowledge base for the user's query "${searchQuery}":\n\n${JSON.stringify(algoliaContext, null, 2)}\n\nPlease use this context to provide a more informed response to the user's question.`
        };
        
        // Insert context message before the last user message
        contextualMessages = [
          ...messages.slice(0, -1),
          contextMessage,
          lastUserMessage
        ];
        
        console.log(`📝 Added Algolia context for query: "${searchQuery}"`);
      }
    }

    // Get available MCP tools
    const mcpTools = mcpManager.getOpenAITools();

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log(`💬 Chat request with ${mcpTools.length} MCP tools available`);

    // Create completion with MCP tools
    const completionOptions = {
      model: 'moonshot-v1-8k',
      messages: contextualMessages,
      stream: true,
      temperature: 0.3,
    };

    // Add tools if available
    if (mcpTools.length > 0) {
      console.log(`🔧 Sending ${mcpTools.length} MCP tools to Moonshot AI`);
      completionOptions.tools = mcpTools;
      completionOptions.tool_choice = 'auto';
    }

    const stream = await client.chat.completions.create(completionOptions);

    let currentToolCalls = [];
    let currentContent = '';

    // Stream the response back to client
    for await (const chunk of stream) {
      const choice = chunk.choices[0];
      if (!choice) continue;

      const delta = choice.delta;

      // Handle content
      if (delta.content) {
        currentContent += delta.content;
        res.write(delta.content);
      }

      // Handle tool calls
      if (delta.tool_calls) {
        for (const toolCall of delta.tool_calls) {
          if (!currentToolCalls[toolCall.index]) {
            currentToolCalls[toolCall.index] = {
              id: toolCall.id,
              type: toolCall.type,
              function: { name: '', arguments: '' }
            };
          }

          if (toolCall.function) {
            if (toolCall.function.name) {
              currentToolCalls[toolCall.index].function.name += toolCall.function.name;
            }
            if (toolCall.function.arguments) {
              currentToolCalls[toolCall.index].function.arguments += toolCall.function.arguments;
            }
          }
        }
      }

      // Check if we're done and have tool calls to execute
      if (choice.finish_reason === 'tool_calls' && currentToolCalls.length > 0) {
        // Execute tool calls via MCP
        const toolMessages = [];

        for (const toolCall of currentToolCalls) {
          try {
            console.log(`🔧 Executing tool: ${toolCall.function.name}`);
            
            // Parse arguments
            const args = JSON.parse(toolCall.function.arguments);
            
            // Execute via MCP
            const result = await mcpManager.callTool(toolCall.function.name, args);
            
            // Add tool result to messages
            toolMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(result.content)
            });

            // Stream tool execution info to client
            res.write(`\n\n🔧 **Tool Executed**: ${toolCall.function.name}\n`);
            res.write(`📝 **Result**: ${JSON.stringify(result.content, null, 2)}\n\n`);

          } catch (error) {
            console.error(`Tool execution failed:`, error);
            toolMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: error.message })
            });
            res.write(`\n\n❌ **Tool Failed**: ${toolCall.function.name} - ${error.message}\n\n`);
          }
        }

        // If we have tool messages, make another completion call
        if (toolMessages.length > 0) {
          const followUpMessages = [
            ...contextualMessages,
            {
              role: 'assistant',
              content: currentContent,
              tool_calls: currentToolCalls
            },
            ...toolMessages
          ];

          // Make follow-up call without streaming to get final response
          try {
            const followUpResponse = await client.chat.completions.create({
              model: 'moonshot-v1-8k',
              messages: followUpMessages,
              temperature: 0.3,
            });

            const finalContent = followUpResponse.choices[0]?.message?.content || '';
            if (finalContent) {
              res.write(`\n\n${finalContent}`);
            }
          } catch (error) {
            console.error('Follow-up completion failed:', error);
            res.write('\n\n*Unable to generate follow-up response*');
          }
        }
      }
    }

    res.end();
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to get response from AI',
        details: error.message 
      });
    } else {
      res.end();
    }
  }
});

// Save file analysis to Algolia
app.post('/api/save-analysis', async (req, res) => {
  try {
    const { analysisResult } = req.body;

    if (!analysisResult) {
      return res.status(400).json({ error: 'analysisResult is required' });
    }

    // Validate required fields
    if (!analysisResult.fileName || !analysisResult.fileType || !analysisResult.description) {
      return res.status(400).json({ error: 'Missing required fields in analysisResult' });
    }

    console.log(`📤 Received save request for file: ${analysisResult.fileName}`);

    const saveResult = await saveFileAnalysisToAlgolia(analysisResult);

    if (saveResult.success) {
      res.json({ 
        success: true, 
        message: `File analysis saved to Algolia successfully`,
        algoliaResult: saveResult.result 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to save to Algolia', 
        details: saveResult.error 
      });
    }
  } catch (error) {
    console.error('Error in save-analysis endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to save file analysis',
      details: error.message 
    });
  }
});

// Connect to a new MCP server
app.post('/api/mcp/connect', async (req, res) => {
  const { serverId, command, args, token, ...serverConfig } = req.body;
  
  if (!serverId || !command) {
    return res.status(400).json({ error: 'serverId and command are required' });
  }

  try {
    const success = await mcpManager.connectServer(serverId, command, args || [], token, serverConfig);
    if (success) {
      res.json({ success: true, message: `Connected to ${serverId}` });
    } else {
      res.status(500).json({ error: `Failed to connect to ${serverId}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down...');
  await mcpManager.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  await mcpManager.disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔑 API Key configured: ${!!process.env.MOONSHOT_API_KEY}`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  
  // Initialize MCP servers
  await initializeMCPServers();
}); 