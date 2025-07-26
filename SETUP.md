# Prism Setup Guide

This guide will help you set up Prism, a data analysis chat application powered by Moonshot AI with Model Context Protocol (MCP) integration.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn package manager
- A Moonshot API key

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

2. Get your Moonshot API key:
   - Visit [Moonshot Platform](https://platform.moonshot.cn/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key

3. Update the `server/.env` file with your API key:
   ```
   MOONSHOT_API_KEY=your_moonshot_api_key_here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

### Frontend Configuration

The frontend doesn't need any API keys since it communicates with the backend server.

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

This application integrates with MCP servers to provide AI tools and capabilities. 

### Built-in MCP Tools

The application comes with a **dummy MCP server** that provides several useful tools:

- **calculator** - Perform basic math operations (add, subtract, multiply, divide)
- **get_time** - Get current date and time (with timezone support)
- **generate_uuid** - Generate random UUIDs (v1 or v4)
- **system_info** - Get system information (OS, memory, uptime, etc.)

### How MCP Works

1. **Backend connects** to local MCP servers on startup
2. **Tools are discovered** and made available to the AI
3. **AI can call tools** during conversation using OpenAI function calling
4. **Results are streamed** back to the user in real-time

### MCP Status Panel

The chat interface includes an **MCP Status Panel** (top-right corner) that shows:
- Connected MCP servers
- Available tools and their descriptions
- Connection status and tool counts

## Architecture

This application uses a **client-server-MCP architecture**:

- **Frontend**: React app that makes API calls to the backend
- **Backend**: Express server that handles AI requests and MCP communication
- **MCP Servers**: Local processes providing tools and capabilities
- **AI Flow**: Frontend → Backend → Moonshot AI (with MCP tools) → MCP Servers

### Why This Architecture?

1. **CORS Handling**: Backend bypasses browser CORS restrictions
2. **MCP Integration**: Server-side MCP clients for tool execution  
3. **Security**: API keys and MCP connections stay on server
4. **Streaming**: Real-time AI responses with tool execution
5. **Scalability**: Can connect to multiple MCP servers

## API Endpoints

The backend server provides:
- `GET /health` - Health check with MCP server status
- `GET /api/mcp/info` - MCP servers and tools information
- `POST /api/chat` - Chat completion with MCP tools
- `POST /api/mcp/connect` - Connect to additional MCP servers

## Features

- **Chat Interface**: Interactive chat with Moonshot AI
- **MCP Tools**: AI can use calculator, time, UUID, system info tools
- **Real-time Streaming**: See AI responses and tool executions as they happen
- **Tool Visibility**: See which tools are being used and their results
- **File Analysis**: Upload and analyze various file types (frontend feature)
- **Export Conversations**: Save your chat history

## Usage

1. **Start the application**: Use `npm run dev:full`
2. **Check MCP Status**: Click the MCP button in the top-right to see connected servers
3. **Ask Tool Questions**: Try "Calculate 25 * 16 + 10" or "What time is it?"
4. **Watch Tool Execution**: See AI call tools and display results
5. **Upload Files**: Use the left panel for file analysis
6. **Export Results**: Save conversations for future reference

## Example Prompts

Try these prompts to test MCP functionality:

- "What tools do you have available?"
- "Calculate 25 * 16 + 10"
- "What time is it in New York?"
- "Generate a UUID for me"
- "Show me system information"
- "What's 100 divided by 3?"

## Troubleshooting

### API Key Issues
- Make sure `server/.env` file exists with your Moonshot API key
- Verify your Moonshot API key is correct and has sufficient credits
- Check the server logs for API key configuration status

### MCP Connection Issues
- Check MCP Status Panel to see server connection status
- Look at server logs for MCP connection errors
- Ensure Node.js version is compatible (v18+)
- Verify MCP SDK dependencies are installed

### Connection Issues
- Ensure both servers are running (`npm run dev:full`)
- Check `http://localhost:3001/health` to verify backend is working
- Check `http://localhost:3001/api/mcp/info` for MCP status
- Verify the Moonshot API is accessible from your server
- Check browser network tab for any API errors

### Server Issues
- Make sure port 3001 is available
- Check server logs in the terminal for error messages
- Verify all backend dependencies are installed (`npm run server:install`)

## Adding Custom MCP Servers

To connect additional MCP servers, edit `server/server.js`:

```javascript
const mcpServers = [
  {
    id: 'dummy-tools',
    command: 'node',
    args: [path.join(__dirname, 'dummy-mcp-server.js')]
  },
  {
    id: 'your-server',
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
NODE_ENV=production MOONSHOT_API_KEY=your_key npm start
```

## Project Structure

```
prism/
├── src/                 # Frontend React app
│   └── components/      # React components including MCPStatusPanel
├── server/             # Backend Express server
│   ├── server.js       # Main server with MCP integration
│   ├── mcpClient.js    # MCP client manager
│   ├── dummy-mcp-server.js  # Test MCP server with tools
│   ├── package.json    # Server dependencies
│   └── .env           # Server environment variables
├── package.json       # Frontend dependencies & scripts
└── vite.config.ts     # Vite config with proxy
```

## Environment Variables

### Server (`server/.env`)
```env
MOONSHOT_API_KEY=your_moonshot_api_key_here  # Required
PORT=3001                                    # Optional
FRONTEND_URL=http://localhost:5173           # Optional
NODE_ENV=development                         # Optional
```

### Frontend (`.env`)
No API keys needed - communicates with backend server.

## Model Information

The application uses the `moonshot-v1-8k` model from Moonshot AI, which provides:
- 8K context window
- High-quality text generation
- **Function calling support** (required for MCP tools)
- Fast response times
- Competitive pricing

For more information about Moonshot AI and their models, visit [platform.moonshot.cn](https://platform.moonshot.cn/). 