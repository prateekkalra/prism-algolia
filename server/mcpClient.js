const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { spawn } = require('child_process');

class MCPManager {
  constructor() {
    this.clients = new Map(); // serverId -> client
    this.tools = new Map();   // toolName -> { serverId, tool }
  }

  /**
   * Connect to an MCP server via STDIO
   */
  async connectStdioServer(serverId, command, args = []) {
    try {
      console.log(`🔌 Connecting to STDIO MCP server: ${serverId}`);
      console.log(`🔍 Command: ${command}`);
      console.log(`🔍 Args: ${JSON.stringify(args)}`);
      
      // Create client first
      const client = new Client({
        name: "prism-mcp-client",
        version: "1.0.0"
      }, {
        capabilities: {
          tools: {}
        }
      });

      // Create transport that will spawn the process
      const transport = new StdioClientTransport({
        command: command,
        args: args
      });

      // Connect to the server
      await client.connect(transport);
      
      // Store the client
      this.clients.set(serverId, {
        client,
        transport,
        type: 'stdio'
      });

      // Get available tools
      await this.refreshTools(serverId);
      
      console.log(`✅ Connected to STDIO MCP server: ${serverId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to connect to STDIO MCP server ${serverId}:`, error);
      return false;
    }
  }

  /**
   * Connect to an MCP server via HTTP
   */
  async connectHttpServer(serverId, url, token = null, serverConfig = {}) {
    try {
      console.log(`🔌 Connecting to HTTP MCP server: ${serverId} at ${url}`);
      
      const client = new Client({
        name: "prism-mcp-client",
        version: "1.0.0"
      }, {
        capabilities: {
          tools: {}
        }
      });

      // Get session endpoint first
      let sessionEndpoint = null;
      
      try {
        const headers = {};
        if (token) {
          headers['X-MCP-Proxy-Auth'] = `Bearer ${token}`;
        }

        // Build URL with query parameters for STDIO transport
        const urlObj = new URL(url);
        urlObj.searchParams.set('command', 'npm');
        urlObj.searchParams.set('args', (serverConfig.args || ['start']).join(','));  
        urlObj.searchParams.set('transportType', serverConfig.transportType || 'stdio');
        
        // Add environment variables
        if (serverConfig.env) {
          urlObj.searchParams.set('env', JSON.stringify(serverConfig.env));
        }

        const sessionUrl = urlObj.toString();
        console.log(`🔍 Getting session endpoint from ${sessionUrl}`);
        
        const sessionResponse = await fetch(sessionUrl, {
          method: 'GET',
          headers
        });

        if (!sessionResponse.ok) {
          throw new Error(`Failed to get session: ${sessionResponse.status} ${sessionResponse.statusText}`);
        }

        // Parse SSE stream to get endpoint
        const reader = sessionResponse.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: /message?sessionId=')) {
              const baseUrl = url.replace('/stdio', '');
              sessionEndpoint = baseUrl + line.substring(6);
              console.log(`✅ Got session endpoint: ${sessionEndpoint}`);
              break;
            }
          }
          
          if (sessionEndpoint) break;
        }
        
        reader.releaseLock();
      } catch (error) {
        console.error('Failed to get session endpoint:', error);
        throw error;
      }

      if (!sessionEndpoint) {
        throw new Error('Could not extract session endpoint from STDIO response');
      }

      // Create transport using session endpoint
      const transport = {
        async send(request) {
          try {
            const headers = {
              'Content-Type': 'application/json',
              'mcp-protocol-version': '2025-06-18',
            };
            
            if (token) {
              headers['x-mcp-proxy-auth'] = `Bearer ${token}`;
            }

            console.log(`🔍 Sending request to session endpoint: ${sessionEndpoint}`);
            console.log(`📤 Request body:`, JSON.stringify(request, null, 2));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(sessionEndpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(request),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const errorText = await response.text().catch(() => '');
              throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            // Handle SSE response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let jsonResponse = null;
            let readCount = 0;

            while (true) {
              const readResult = await Promise.race([
                reader.read(),
                new Promise((resolve) => setTimeout(() => resolve({ done: true, value: null }), 5000))
              ]);
              
              const { done, value } = readResult;
              readCount++;
              
              if (done) {
                console.log(`📊 Stream ended after ${readCount} reads`);
                break;
              }
              
              if (value === null) {
                console.log(`⏰ Read timeout, continuing...`);
                continue;
              }
              
              const chunk = decoder.decode(value, { stream: true });
              console.log(`📥 Chunk ${readCount} received:`, chunk);
              
              const lines = chunk.split('\n');
              for (const line of lines) {
                const trimmedLine = line.trim();
                
                // Look for JSON data in various formats
                if (trimmedLine.startsWith('data: {') || trimmedLine.startsWith('{')) {
                  const jsonStr = trimmedLine.startsWith('data: ') ? trimmedLine.substring(6) : trimmedLine;
                  try {
                    jsonResponse = JSON.parse(jsonStr);
                    console.log(`✅ Parsed JSON response:`, jsonResponse);
                    reader.releaseLock();
                    return jsonResponse;
                  } catch (parseError) {
                    console.log(`⚠️ Failed to parse JSON from line: ${trimmedLine}`);
                  }
                }
                
                // Check for other SSE event formats
                if (trimmedLine.startsWith('event:') || trimmedLine.startsWith('data:')) {
                  console.log(`📡 SSE event line: ${trimmedLine}`);
                }
              }
              
              fullResponse += chunk;
              
              // If we get "Accepted", wait longer for actual response
              if (chunk.includes('Accepted')) {
                console.log(`📨 Server accepted request, continuing to wait for response...`);
              }
              
              // Continue reading for a reasonable amount of time
              if (readCount >= 100) {
                console.log(`⚠️ Max reads reached, stopping`);
                break;
              }
            }

            reader.releaseLock();
            
            if (jsonResponse) {
              return jsonResponse;
            }
            
            console.log(`❌ Full response received:`, fullResponse);
            throw new Error(`No valid JSON response found in stream after ${readCount} reads`);
          } catch (error) {
            console.error('Session transport error:', error);
            throw error;
          }
        },
        
        async close() {
          // HTTP transport doesn't need explicit closing
        }
      };

      // Store the client info
      this.clients.set(serverId, {
        client: {
          async listTools() {
            return await transport.send({
              jsonrpc: "2.0",
              id: Math.random().toString(36),
              method: "tools/list",
              params: {}
            });
          },
          
          async callTool(params) {
            return await transport.send({
              jsonrpc: "2.0", 
              id: Math.random().toString(36),
              method: "tools/call",
              params
            });
          }
        },
        transport,
        type: 'http',
        url
      });

      // Get available tools
      await this.refreshTools(serverId);
      
      console.log(`✅ Connected to HTTP MCP server: ${serverId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to connect to HTTP MCP server ${serverId}:`, error);
      return false;
    }
  }

  /**
   * Generic connect method that handles both types
   */
  async connectServer(serverId, commandOrUrl, args = [], token = null, serverConfig = {}) {
    // If commandOrUrl starts with http, treat as HTTP server
    if (typeof commandOrUrl === 'string' && commandOrUrl.startsWith('http')) {
      const config = { args, ...serverConfig };
      return await this.connectHttpServer(serverId, commandOrUrl, token, config);
    } else {
      return await this.connectStdioServer(serverId, commandOrUrl, args);
    }
  }

  /**
   * Refresh tools from a specific server
   */
  async refreshTools(serverId) {
    const serverInfo = this.clients.get(serverId);
    if (!serverInfo) return;

    try {
      const response = await serverInfo.client.listTools();
      console.log(`🔍 Raw MCP listTools response from ${serverId}:`, JSON.stringify(response, null, 2));
      
      // Handle different response formats
      const tools = response.tools || response.result?.tools || [];
      console.log(`🔍 Extracted tools array:`, JSON.stringify(tools, null, 2));
      
      // Store tools with server reference
      tools.forEach(tool => {
        console.log(`🔍 Processing tool:`, JSON.stringify(tool, null, 2));
        this.tools.set(tool.name, {
          serverId,
          tool
        });
      });

      console.log(`🔧 Loaded ${tools.length} tools from ${serverId}`);
    } catch (error) {
      console.error(`Failed to refresh tools from ${serverId}:`, error);
    }
  }

  /**
   * Get all available tools in OpenAI function format
   */
  getOpenAITools() {
    const openaiTools = [];
    
    // Parameter-less tools (safe to include)
    const noParamTools = ['getUserInfo', 'getApplications', 'searchSingleIndex', 'saveObject'];
    
    for (const [toolName, { tool }] of this.tools) {
      let openaiTool = null;
      
      // Handle parameter-less tools
      if (noParamTools.includes(toolName)) {
        openaiTool = {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description || "No description available",
            parameters: {
              type: "object",
              properties: {},
              required: []
            }
          }
        };
      }
      // Handle searchSingleIndex specifically
      else if (toolName === 'searchSingleIndex') {
        openaiTool = {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description || "Search Algolia index for relevant data",
            parameters: {
              type: "object",
              properties: {
                applicationId: {
                  type: "string",
                  description: "Algolia application ID"
                },
                indexName: {
                  type: "string", 
                  description: "Name of the Algolia index to search"
                },
                requestBody: {
                  type: "object",
                  description: "Search request body with query parameters"
                }
              },
              required: ["applicationId", "indexName", "requestBody"]
            }
          }
        };
      }
      // Handle saveObject specifically
      else if (toolName === 'saveObject') {
        openaiTool = {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description || "Save an object to Algolia index",
            parameters: {
              type: "object",
              properties: {
                applicationId: {
                  type: "string",
                  description: "Algolia application ID"
                },
                indexName: {
                  type: "string", 
                  description: "Name of the Algolia index to save to"
                },
                requestBody: {
                  type: "object",
                  description: "Object data to save to the index"
                }
              },
              required: ["applicationId", "indexName", "requestBody"]
            }
          }
        };
      }
      
      if (openaiTool) {
        openaiTools.push(openaiTool);
        console.log(`✅ Added tool: ${tool.name}`);
      }
    }

    console.log(`🔧 Created ${openaiTools.length} tools for OpenAI`);
    return openaiTools;
  }

  /**
   * Execute a tool call via MCP
   */
  async callTool(toolName, args = {}) {
    const toolInfo = this.tools.get(toolName);
    if (!toolInfo) {
      throw new Error(`Tool ${toolName} not found`);
    }

    const serverInfo = this.clients.get(toolInfo.serverId);
    if (!serverInfo) {
      throw new Error(`Server ${toolInfo.serverId} not connected`);
    }

    try {
      console.log(`🛠️ Calling tool: ${toolName} with args:`, args);
      
      const response = await serverInfo.client.callTool({
        name: toolName,
        arguments: args
      });

      console.log(`✅ Tool ${toolName} executed successfully`);
      
      // Handle different response formats
      return response.content ? response : { content: response.result || response };
    } catch (error) {
      console.error(`❌ Tool ${toolName} failed:`, error);
      throw error;
    }
  }

  /**
   * Get connected servers info
   */
  getServersInfo() {
    const servers = {};
    for (const [serverId, serverInfo] of this.clients) {
      const serverTools = [];
      for (const [toolName, { serverId: toolServerId }] of this.tools) {
        if (toolServerId === serverId) {
          serverTools.push(toolName);
        }
      }
      servers[serverId] = {
        connected: true,
        tools: serverTools,
        type: serverInfo.type || 'unknown',
        url: serverInfo.url || 'N/A'
      };
    }
    return servers;
  }

  /**
   * Disconnect from all servers
   */
  async disconnect() {
    for (const [serverId, serverInfo] of this.clients) {
      try {
        if (serverInfo.client && serverInfo.client.close) {
          await serverInfo.client.close();
        }
        if (serverInfo.transport && serverInfo.transport.close) {
          await serverInfo.transport.close();
        }
        if (serverInfo.process) {
          serverInfo.process.kill();
        }
        console.log(`🔌 Disconnected from ${serverId}`);
      } catch (error) {
        console.error(`Failed to disconnect from ${serverId}:`, error);
      }
    }
    this.clients.clear();
    this.tools.clear();
  }
}

// Create singleton instance
const mcpManager = new MCPManager();

module.exports = { mcpManager }; 