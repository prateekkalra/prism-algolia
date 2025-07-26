# Prism Setup Guide

This guide will help you set up Prism, an intelligent data analysis platform with AI-powered chat capabilities and Model Context Protocol (MCP) integration.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn package manager
- AI API access (configured in environment variables)

## Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```

## Environment Configuration

### Backend Configuration

1. Set up the server environment:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Configure your AI API settings:
   - Set up your preferred AI provider API key
   - Update the `server/.env` file with your configuration
   - Ensure the AI service supports function calling for MCP tool integration

3. Update the `server/.env` file:
   ```
   AI_API_KEY=your_api_key_here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

### Frontend Configuration

The frontend communicates with the backend server, so no API keys are needed in the frontend environment.

## Running the Application

### Option 1: Full Stack Mode (Recommended)
Run both frontend and backend simultaneously:
```bash
npm run dev:full
```

This starts:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:5173`
- MCP servers automatically connected

### Option 2: Separate Servers
Run frontend and backend separately:

```bash
# Terminal 1: Backend server
npm run server:dev

# Terminal 2: Frontend (in a new terminal)
npm run dev
```

## MCP (Model Context Protocol) Integration

Prism integrates with MCP servers to provide AI tools and enhanced capabilities. 

### Built-in MCP Tools

The application comes with a **demonstration MCP server** that provides several useful tools:

- **calculator** - Perform mathematical operations (add, subtract, multiply, divide)
- **get_time** - Get current date and time with timezone support
- **generate_uuid** - Generate random UUIDs (v1 or v4)
- **system_info** - Get system information (OS, memory, uptime, etc.)

### How MCP Works in Prism

1. **Backend connects** to local MCP servers on startup
2. **Tools are discovered** and made available to the AI assistant
3. **AI can execute tools** during conversations using function calling
4. **Results are streamed** back to the user in real-time

### MCP Status Panel

The chat interface includes an **MCP Status Panel** (top-right corner) that shows:
- Connected MCP servers
- Available tools and their descriptions
- Connection status and tool counts

## Architecture

Prism uses a **client-server-MCP architecture**:

- **Frontend**: React app for user interface and file analysis
- **Backend**: Express server handling AI requests and MCP communication
- **MCP Servers**: Local processes providing tools and capabilities
- **AI Flow**: Frontend → Backend → AI Assistant (with MCP tools) → MCP Servers

### Why This Architecture?

1. **CORS Handling**: Backend bypasses browser CORS restrictions
2. **MCP Integration**: Server-side MCP clients for secure tool execution  
3. **Security**: API keys and MCP connections stay on server-side
4. **Streaming**: Real-time AI responses with tool execution
5. **Scalability**: Can connect to multiple MCP servers and AI providers

## API Endpoints

The backend server provides:
- `GET /health` - Health check with MCP server status
- `GET /api/mcp/info` - MCP servers and tools information
- `POST /api/chat` - Chat completion with MCP tools
- `POST /api/mcp/connect` - Connect to additional MCP servers

## Features

### Core Capabilities
- **Dual-Panel Interface**: File analysis and AI chat in one interface
- **Universal File Processing**: Handle documents, media, code, and data files
- **MCP Tool Integration**: AI can use calculator, time, UUID, and system tools
- **Real-time Streaming**: See AI responses and tool executions as they happen
- **Smart Source Linking**: AI responses automatically reference uploaded files

### Advanced Features
- **Resizable Layout**: Adjust panel sizes to your workflow
- **Export Conversations**: Save chat history and analysis results
- **Context Awareness**: AI maintains context across file uploads and conversations
- **Tool Transparency**: See which tools are being used and their results

## Usage

1. **Start Prism**: Use `npm run dev:full`
2. **Check MCP Status**: Click the MCP button in the top-right to see connected servers
3. **Upload Files**: Drag files to the left panel for analysis
4. **Chat with AI**: Ask questions about your data or request calculations
5. **Use Tools**: Try "Calculate 25 * 16 + 10" or "What time is it?"
6. **Export Results**: Save conversations and analyses for future reference

## Example Prompts

Try these prompts to explore Prism's capabilities:

### Tool Usage
- "What tools do you have available?"
- "Calculate the compound interest on $5000 at 3.5% for 5 years"
- "What time is it in London right now?"
- "Generate a UUID for my new project"
- "Show me current system information"

### File Analysis
- "Summarize the key points in my uploaded document"
- "What patterns do you see in this CSV data?"
- "Analyze the code structure in my uploaded files"
- "Extract insights from this image"

### Combined Workflows
- "Calculate the average from column B in my spreadsheet, then multiply by 1.5"
- "Based on the data trends, what time would be optimal for scheduling?"

## Troubleshooting

### API Key Issues
- Ensure `server/.env` file exists with your AI API key
- Verify your API key is correct and has sufficient credits/access
- Check the server logs for API configuration status

### MCP Connection Issues
- Check MCP Status Panel to see server connection status
- Look at server logs for MCP connection errors
- Ensure Node.js version is compatible (v18+)
- Verify MCP SDK dependencies are installed correctly

### Connection Issues
- Ensure both servers are running (`npm run dev:full`)
- Check `http://localhost:3001/health` to verify backend is working
- Check `http://localhost:3001/api/mcp/info` for MCP status
- Verify the AI API is accessible from your server
- Check browser network tab for any API errors

### File Analysis Issues
- Ensure uploaded files are not corrupted
- Check browser console for any file processing errors
- Try different file types to isolate issues
- Clear browser cache if experiencing persistent problems

### Server Issues
- Make sure port 3001 is available
- Check server logs in the terminal for error messages
- Verify all backend dependencies are installed (`npm run server:install`)

## Adding Custom MCP Servers

To connect additional MCP servers, edit `server/server.js`:

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
    args: ['-y', '@modelcontextprotocol/server-search', '--api-key', 'your-key']
  },
  {
    id: 'your-custom-server',
    command: 'your-command',
    args: ['your', 'args']
  }
];
```

Or use the API endpoint:
```bash
curl -X POST http://localhost:3001/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"serverId": "new-server", "command": "node", "args": ["server.js"]}'
```

## Deployment

### Development
```bash
npm run dev:full
```

### Production Build
```bash
# Build frontend
npm run build

# Start production server (serves both static files and API)
cd server
NODE_ENV=production AI_API_KEY=your_key npm start
```

## Project Structure

```
prism/
├── src/                 # Frontend React app
│   ├── components/      # UI components including MCP panels
│   ├── services/        # File analysis and API services
│   └── types/          # TypeScript definitions
├── server/             # Backend Express server
│   ├── server.js       # Main server with MCP integration
│   ├── mcpClient.js    # MCP client manager
│   ├── dummy-mcp-server.js  # Demo MCP server with tools
│   ├── package.json    # Server dependencies
│   └── .env           # Server environment variables
├── package.json       # Frontend dependencies & scripts
└── vite.config.ts     # Vite config with proxy
```

## Environment Variables

### Server (`server/.env`)
```env
AI_API_KEY=your_ai_api_key_here       # Required for AI functionality
PORT=3001                             # Optional, defaults to 3001
FRONTEND_URL=http://localhost:5173     # Optional, for CORS
NODE_ENV=development                   # Optional, defaults to development
```

### Frontend (`.env`)
No API keys needed - all AI communication goes through the backend server.

## AI Model Requirements

Prism is designed to work with AI models that support:
- Function/tool calling capabilities (required for MCP integration)
- Streaming responses for real-time interaction
- Context preservation across conversations
- High-quality text generation and analysis

Popular compatible AI services include providers that offer function-calling models.

---

**Prism** combines the power of advanced AI with intuitive file analysis and tool integration. This setup guide gets you started quickly while providing the flexibility to customize and extend the platform for your specific needs.