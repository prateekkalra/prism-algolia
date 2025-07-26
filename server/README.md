# Prism Backend Server

Express.js server that powers Prism's AI capabilities and handles MCP integration to provide advanced data analysis tools.

## Overview

This backend server provides:
- AI assistant chat capabilities with streaming responses
- Model Context Protocol (MCP) integration for tool execution
- RESTful API endpoints for frontend communication
- Real-time tool execution and result streaming
- Multi-server MCP architecture for extensible capabilities

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the server directory:

```env
AI_API_KEY=your_ai_api_key_here       # Required for AI functionality
PORT=3001                             # Optional, defaults to 3001
FRONTEND_URL=http://localhost:5173     # Optional, for CORS configuration
NODE_ENV=development                   # Optional, defaults to development
```

## API Endpoints

### Chat & AI
- `POST /api/chat` - Chat completion with MCP tool integration
  - Accepts: `{ messages: ChatMessage[] }`
  - Returns: Streaming AI response with tool execution

### MCP Management  
- `GET /api/mcp/info` - Get connected MCP servers and available tools
- `POST /api/mcp/connect` - Connect to additional MCP servers dynamically
  - Accepts: `{ serverId: string, command: string, args: string[] }`

### System
- `GET /health` - Health check with MCP server status
- `GET /` - Server status and configuration info

## MCP Integration

### Built-in Tools

The server includes a demonstration MCP server (`dummy-mcp-server.js`) with these tools:

- **calculator** - Mathematical operations (add, subtract, multiply, divide)
- **get_time** - Current date and time with timezone support  
- **generate_uuid** - UUID generation (v1 or v4)
- **system_info** - System information and performance metrics

### Adding MCP Servers

Edit the `mcpServers` array in `server.js`:

```javascript
const mcpServers = [
  {
    id: 'demo-tools',
    command: 'node',
    args: [path.join(__dirname, 'dummy-mcp-server.js')]
  },
  {
    id: 'algolia-search',
    command: 'npx', 
    args: ['-y', '@modelcontextprotocol/server-search',
           '--algolia-app-id', process.env.ALGOLIA_APP_ID,
           '--algolia-api-key', process.env.ALGOLIA_API_KEY]
  }
];
```

### Runtime Server Connection

Connect new MCP servers dynamically:

```bash
curl -X POST http://localhost:3001/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{
    "serverId": "filesystem",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data"]
  }'
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   MCP Servers   │
│   (React)       │◄──►│   (Express)      │◄──►│   (Tools)       │
│                 │    │                  │    │                 │
│ • File Upload   │    │ • AI Integration │    │ • Calculator    │
│ • Chat UI       │    │ • MCP Client     │    │ • Time Tools    │
│ • Tool Status   │    │ • Tool Execution │    │ • UUID Gen      │
│ • Export        │    │ • Response Stream│    │ • System Info   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Request Flow

1. **Frontend** sends user message via `/api/chat`
2. **Backend** processes message with AI model + available MCP tools  
3. **AI** determines if tools are needed and calls them
4. **MCP Client** executes tools via connected servers
5. **Backend** streams tool results and AI responses to frontend
6. **Frontend** displays real-time tool execution and responses

## Features

### Streaming Support
- Real-time AI response streaming
- Live tool execution feedback
- Immediate user feedback during processing

### Error Handling
- Graceful MCP server connection failures
- AI API error recovery with user-friendly messages
- Tool execution error handling with fallbacks

### Performance
- Connection pooling for MCP servers
- Efficient tool result caching
- Optimized streaming parser for large responses

### Security
- API key validation and error handling
- CORS configuration for frontend integration
- Environment-based configuration management

## Development

### Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run mcp:test     # Test MCP server connections
```

### Debugging

Enable debug logging:
```bash
DEBUG=prism:* npm run dev
```

Check MCP status:
```bash
curl http://localhost:3001/api/mcp/info | jq
```

Monitor tool execution:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Calculate 25 * 16"}]}'
```

## Deployment

### Production Setup
```bash
# Build and optimize
npm install --production

# Set production environment
export NODE_ENV=production
export AI_API_KEY=your_production_key
export PORT=3001

# Start server
npm start
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Health Monitoring
The `/health` endpoint provides:
- Server uptime and status
- MCP server connection status  
- Available tools count
- API configuration status

## Troubleshooting

### Common Issues

**MCP Connection Failures**
- Check that Node.js version is v18+
- Verify MCP server dependencies are installed
- Review server logs for specific connection errors

**AI API Issues**  
- Verify `AI_API_KEY` is set correctly
- Check API provider status and quotas
- Review AI model compatibility (function calling required)

**Performance Issues**
- Monitor memory usage during large file analysis
- Check MCP server response times
- Review tool execution logs for bottlenecks

### Debug Commands
```bash
# Check server status
curl http://localhost:3001/health

# List available tools
curl http://localhost:3001/api/mcp/info

# Test tool execution
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What tools are available?"}]}'
```

## Contributing

When adding new features:
1. Update the MCP server configuration as needed
2. Add appropriate error handling for new endpoints
3. Update this README with new capabilities
4. Test with both development and production configurations

---

This backend server provides the foundation for Prism's intelligent data analysis capabilities, combining AI assistance with powerful tool integration through the Model Context Protocol.