#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

// Create MCP server
const server = new Server(
  {
    name: "dummy-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Tool definitions
const tools = [
  {
    name: "calculator",
    description: "Perform basic mathematical calculations",
    inputSchema: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "The mathematical operation to perform"
        },
        a: {
          type: "number",
          description: "First number"
        },
        b: {
          type: "number", 
          description: "Second number"
        }
      },
      required: ["operation", "a", "b"]
    }
  },
  {
    name: "get_time",
    description: "Get the current date and time",
    inputSchema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "Timezone (optional, defaults to local)"
        }
      }
    }
  },
  {
    name: "generate_uuid",
    description: "Generate a random UUID",
    inputSchema: {
      type: "object",
      properties: {
        version: {
          type: "number",
          enum: [1, 4],
          description: "UUID version (default: 4)"
        }
      }
    }
  },
  {
    name: "system_info",
    description: "Get basic system information",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

// List tools handler
server.setRequestHandler('tools/list', async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "calculator":
        const { operation, a, b } = args;
        let result;
        
        switch (operation) {
          case "add":
            result = a + b;
            break;
          case "subtract":
            result = a - b;
            break;
          case "multiply":
            result = a * b;
            break;
          case "divide":
            if (b === 0) {
              throw new Error("Division by zero");
            }
            result = a / b;
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
        
        return {
          content: [
            {
              type: "text",
              text: `${a} ${operation} ${b} = ${result}`
            }
          ]
        };

      case "get_time":
        const timezone = args?.timezone || 'local';
        const now = new Date();
        const timeString = timezone === 'local' 
          ? now.toLocaleString()
          : now.toLocaleString('en-US', { timeZone: timezone });
        
        return {
          content: [
            {
              type: "text",
              text: `Current time: ${timeString}`
            }
          ]
        };

      case "generate_uuid":
        const version = args?.version || 4;
        let uuid;
        
        if (version === 4) {
          uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        } else {
          // Simple UUID v1 mock
          uuid = `${Date.now()}-xxxx-1xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `Generated UUID v${version}: ${uuid}`
            }
          ]
        };

      case "system_info":
        const os = require('os');
        const info = {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
          freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
          uptime: `${Math.round(os.uptime() / 60)} minutes`,
          hostname: os.hostname()
        };
        
        return {
          content: [
            {
              type: "text",
              text: `System Information:\n${JSON.stringify(info, null, 2)}`
            }
          ]
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🤖 Dummy MCP Server started');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { server }; 