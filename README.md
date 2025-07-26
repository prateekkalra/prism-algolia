# Prism

**AI-Powered Knowledge Companion with Algolia Integration**

Prism is an intelligent data analysis platform that transforms how you interact with your files and data. Upload any type of file (documents, images, videos, audio, spreadsheets) and let our AI assistant analyze them using Google's Gemini 2.5 Pro model. The analyzed data is automatically saved to Algolia using the **Algolia MCP (Model Context Protocol)** integration, creating a searchable knowledge base that powers contextual conversations.

![Prism Demo](https://img.shields.io/badge/status-active-brightgreen) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Key Features

### 📄 Universal File Analysis
- **Multi-format Support**: Text, PDF, images, videos, audio, spreadsheets, and more
- **AI-Powered Insights**: Comprehensive analysis using Google Gemini 2.5 Pro
- **Automatic Processing**: Drag-and-drop or click to upload with instant AI analysis

### 🔍 Algolia-Powered Search & Knowledge Base
- **Automatic Indexing**: All file analyses are saved to Algolia using MCP integration
- **Contextual Search**: AI queries automatically search your knowledge base
- **Smart Retrieval**: Relevant data is retrieved and used to enhance AI responses

### 💬 Intelligent Chat Interface
- **Moonshot v1 AI**: Advanced conversational AI with tool-calling capabilities
- **Streaming Responses**: Real-time response generation with live tool execution
- **Source Linking**: AI responses automatically reference uploaded files

### 🔧 MCP Tool Integration
- **Algolia MCP Server**: Primary integration for search and data storage
- **Tool Transparency**: See which tools are being used and their results
- **Extensible Architecture**: Connect to multiple MCP servers for additional capabilities

### 🎨 Modern User Experience
- **Dual-Panel Interface**: File analysis and chat in one seamless experience
- **Resizable Layout**: Customize panel sizes to fit your workflow
- **Dark Theme**: Easy on the eyes with modern design
- **Real-time Updates**: Live streaming of AI responses and tool executions

## 🏗️ Architecture

Prism uses a sophisticated architecture that puts **Algolia MCP as the hero tool**:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend │────│  Express Backend │────│  Moonshot v1 AI │
│   (File Upload)  │    │   (API Server)   │    │ (Chat & Tools)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Algolia MCP    │
                       │   (Hero Tool)    │
                       │ • searchSingleIndex │
                       │ • saveObject     │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Algolia Search   │
                       │ (Knowledge Base) │
                       └──────────────────┘
```

### How It Works

1. **File Upload**: Users drag-and-drop files into the interface
2. **AI Analysis**: Google Gemini 2.5 Pro analyzes the file content
3. **Algolia Storage**: Analysis results are automatically saved using Algolia MCP's `saveObject` tool
4. **User Queries**: When users ask questions, the system:
   - Extracts key terms from the query
   - Uses Algolia MCP's `searchSingleIndex` tool to find relevant data
   - Provides context to Moonshot AI for enhanced responses
5. **Contextual Responses**: AI generates responses based on both the query and retrieved data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key
- Moonshot API key
- Algolia Application ID and Index Name
- Algolia MCP Server setup

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd prism-algolia
   npm install
   ```

2. **Environment Configuration**
   
   **Frontend** (optional - uses backend proxy):
   ```bash
   cp env.example .env
   # Edit .env if needed for custom API base URL
   ```

   **Backend** (required):
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env`:
   ```env
   # AI Configuration
   MOONSHOT_API_KEY=your_moonshot_api_key_here
   MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
   MOONSHOT_MODEL=moonshot-v1-8k
   
   # Algolia Configuration (Required for MCP)
   ALGOLIA_APPLICATION_ID=your_algolia_app_id
   ALGOLIA_INDEX_NAME=prism-data
   
   # Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   
   # MCP Server Configuration
   MCP_NODE_PATH=/path/to/node
   MCP_SERVER_PATH=/path/to/algolia-mcp-server
   ```

3. **Start the Application**
   ```bash
   npm run dev:full
   ```
   
   This starts both:
   - Backend server on `http://localhost:3001`
   - Frontend on `http://localhost:5173`
   - Algolia MCP server automatically connected

### Algolia MCP Server Setup

Prism requires the Algolia MCP server to be running. Configure the path in your `server/.env`:

```env
MCP_NODE_PATH=/home/ubuntu/.nvm/versions/node/v22.17.1/bin/node
MCP_SERVER_PATH=/home/ubuntu/projects/algolia-mcp-ui-app/mcp-node/src/app.ts
```

## 🔧 Core Components

### Frontend Architecture

**Main Components**:
- `App.tsx` - Main application layout with resizable panels
- `FileAnalysisPane.tsx` - File upload and knowledge base display
- `ChatPane.tsx` - AI chat interface with MCP status
- `MCPStatusPanel.tsx` - Real-time MCP server and tool status

**Services**:
- `fileAnalyzer.ts` - Google Gemini integration for file analysis
- `moonshot.ts` - Moonshot AI API integration with streaming
- `localStorage.ts` - Local storage management for file analyses

### Backend Architecture

**Key Files**:
- `server.js` - Main Express server with Algolia MCP integration
- `mcpClient.js` - MCP connection manager supporting HTTP and STDIO

**API Endpoints**:
- `POST /api/chat` - Chat completion with MCP tool integration
- `POST /api/save-analysis` - Save file analysis to Algolia
- `GET /api/mcp/info` - MCP server and tool status
- `GET /health` - Health check with MCP status

### MCP Integration

**Algolia MCP Tools**:
- `searchSingleIndex`: Search Algolia index for relevant data
- `saveObject`: Save analysis results to Algolia index

**Tool Flow**:
1. File analysis results automatically saved using `saveObject`
2. User queries trigger `searchSingleIndex` to find relevant context
3. Retrieved data enhances AI responses with specific file information

## 📝 Usage Guide

### File Analysis Workflow

1. **Upload Files**: Drag files to the left panel or click to browse
2. **AI Processing**: Gemini analyzes content and structure
3. **Auto-Save**: Results automatically saved to Algolia
4. **Knowledge Base**: View all uploaded files in the left panel

### Chat Interaction

1. **Ask Questions**: Type queries about your uploaded data
2. **Contextual Search**: AI automatically searches your knowledge base
3. **Enhanced Responses**: Get answers based on your specific files
4. **Source Linking**: Responses reference relevant uploaded files

### Example Queries

**File-Specific Questions**:
```
"What are the key points in my uploaded presentation?"
"Summarize the data trends in my CSV file"
"What does the contract document say about payment terms?"
```

**Cross-File Analysis**:
```
"Compare the sales data across all my uploaded reports"
"Find mentions of 'risk' in any of my documents"
"What insights can you draw from all my uploaded files?"
```

## 🔍 Algolia MCP Integration Details

### Why Algolia MCP is the Hero Tool

Prism is designed around Algolia's powerful search capabilities:

1. **Universal Data Storage**: All file analyses are stored in a structured Algolia index
2. **Fast Search**: Sub-second search across all your uploaded content
3. **Contextual Retrieval**: AI queries automatically pull relevant data
4. **Scalable**: Handle thousands of files with consistent performance

### Data Structure

Files are stored in Algolia with this structure:
```json
{
  "resource_details": "AI analysis of file content",
  "resource_type": "document|image|video|audio|text",
  "fileName": "original-filename.ext",
  "fileSize": "formatted size",
  "uploadDate": "ISO timestamp"
}
```

### Search Integration

The system automatically:
1. Extracts search terms from user queries
2. Calls `searchSingleIndex` with relevant parameters
3. Provides top results as context to the AI
4. Generates responses that reference specific files

## 🔧 Development

### Project Structure

```
prism-algolia/
├── src/                     # React frontend
│   ├── components/          # UI components
│   │   ├── ChatPane.tsx     # Main chat interface
│   │   ├── FileAnalysisPane.tsx # File upload/management
│   │   ├── MCPStatusPanel.tsx   # MCP server status
│   │   └── ...
│   ├── services/            # Core services
│   │   ├── fileAnalyzer.ts  # Gemini integration
│   │   ├── moonshot.ts      # AI chat service
│   │   └── localStorage.ts  # Data persistence
│   └── types/               # TypeScript definitions
├── server/                  # Express backend
│   ├── server.js           # Main server with MCP
│   ├── mcpClient.js        # MCP connection manager
│   └── package.json        # Server dependencies
└── package.json            # Frontend dependencies
```

### Key Technologies

**Frontend**:
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

**Backend**:
- Express.js server
- Model Context Protocol (MCP) SDK
- OpenAI SDK for Moonshot integration
- CORS and environment configuration

**AI & Search**:
- Google Gemini 2.5 Pro (file analysis)
- Moonshot v1 (conversational AI)
- Algolia (search and storage via MCP)

### Environment Variables

**Server Configuration** (`server/.env`):
```env
# Required
MOONSHOT_API_KEY=your_moonshot_key
ALGOLIA_APPLICATION_ID=your_algolia_app_id
ALGOLIA_INDEX_NAME=your_index_name

# Optional
MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
MOONSHOT_MODEL=moonshot-v1-8k
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# MCP Server Paths
MCP_NODE_PATH=/path/to/node
MCP_SERVER_PATH=/path/to/algolia-mcp-server
```

### Build and Deployment

**Development**:
```bash
npm run dev:full          # Start both frontend and backend
npm run dev               # Frontend only
npm run server:dev        # Backend only
```

**Production**:
```bash
npm run build             # Build frontend
cd server && npm start    # Start production server
```

## 🔍 MCP Status and Monitoring

### Real-Time MCP Status

The application includes a comprehensive MCP status panel:

- **Server Status**: Connection status of all MCP servers
- **Tool Availability**: List of available tools with descriptions
- **Real-Time Updates**: Refresh capability for live status
- **Tool Execution Logs**: See tool calls and results in chat

### Troubleshooting MCP Connections

1. **Check MCP Status Panel**: Click the MCP button in the top-right
2. **Verify Paths**: Ensure `MCP_NODE_PATH` and `MCP_SERVER_PATH` are correct
3. **Check Logs**: Monitor server console for MCP connection messages
4. **Test Tools**: Use the health endpoint `/api/mcp/info`

## 🚀 Advanced Features

### Custom File Analysis

The file analyzer supports multiple formats:
- **Text Files**: Content analysis, themes, structure
- **Images**: Visual description, text extraction, scene analysis
- **Videos**: Content summary, scene detection, duration analysis
- **Audio**: Content type detection, speech recognition
- **PDFs**: Document structure, content extraction
- **Generic Files**: Type-based analysis and metadata

### Streaming Chat Interface

- **Real-Time Responses**: See AI responses as they're generated
- **Tool Execution Visibility**: Watch MCP tools being called
- **Source References**: Automatic linking to relevant uploaded files
- **Export Conversations**: Save chat history and analysis results

### Resizable Interface

- **Adaptive Layout**: Drag the divider to resize panels
- **Workflow Optimization**: Adjust for file-heavy or chat-heavy tasks
- **State Persistence**: Layout preferences maintained across sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Algolia MCP integration
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Maintain Algolia MCP integration
- Test file upload and analysis workflows
- Ensure MCP server compatibility
- Update documentation for new features

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Check the MCP Status Panel for connection issues
- Review server logs for Algolia MCP errors
- Verify environment variables are correctly set
- Test with different file types to isolate issues

---

**Prism** - Where AI meets your data, powered by Algolia's search excellence.