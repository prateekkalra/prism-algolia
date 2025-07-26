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
    // Temporarily disabled to focus on user's MCP server
    // {
    //   id: 'dummy-tools',
    //   command: 'node',
    //   args: [path.join(__dirname, 'dummy-mcp-server.js')]
    // },
    // Add more MCP servers here as needed
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
      messages,
      stream: true,
      temperature: 0.3,
    };

    // Add tools if available
    if (mcpTools.length > 0) {
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
            ...messages,
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