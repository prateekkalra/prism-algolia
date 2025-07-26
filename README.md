# Prism

An intelligent data analysis platform that combines AI-powered chat capabilities with advanced file processing and analysis tools. Prism features a dual-panel interface where users can upload and analyze various file types while interacting with an AI assistant powered by Model Context Protocol (MCP) integration.

## Features

### 🤖 AI-Powered Chat Assistant
- Interactive conversation interface with intelligent AI responses
- Real-time streaming for immediate feedback
- Context-aware responses based on your uploaded data
- Advanced tool integration via MCP (Model Context Protocol)

### 📁 Universal File Analysis
- **Documents**: PDF, Word, Excel, PowerPoint analysis
- **Media Files**: Image, video, and audio content analysis
- **Code Files**: Programming language detection and structure analysis
- **Data Files**: CSV, JSON, XML parsing and insights
- **Text Files**: Content summarization and key concept extraction

### 🔧 MCP Tool Integration
- **Calculator**: Perform complex mathematical operations
- **Time Tools**: Get current time with timezone support
- **UUID Generator**: Create unique identifiers
- **System Information**: Access system stats and information
- **Extensible Architecture**: Easy integration with additional MCP servers

### 💡 Smart Interface Features
- **Dual-Panel Layout**: File analysis on the left, chat on the right
- **Resizable Panels**: Adjust layout to your workflow needs
- **Source Linking**: AI responses automatically link to relevant uploaded files
- **Export Capabilities**: Save conversations and analysis results
- **Real-time Processing**: Watch file analysis happen in real-time

## Architecture

Prism uses a modern three-tier architecture:

1. **Frontend**: React-based interface with TypeScript
2. **Backend**: Express.js server with MCP integration
3. **AI Layer**: Advanced AI models with tool-calling capabilities

The MCP (Model Context Protocol) integration allows Prism to:
- Execute tools and functions during conversations
- Provide real-time calculator and utility functions
- Access system information and external services
- Maintain context across complex multi-step operations

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn package manager

### Quick Start

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd prism-algolia
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the Application**:
   ```bash
   npm run dev:full
   ```

4. **Access Prism**:
   - Open `http://localhost:5173` in your browser
   - Upload files in the left panel for analysis
   - Chat with the AI assistant in the right panel

## Usage Examples

### File Analysis
1. Drag and drop any file into the left panel
2. Watch real-time analysis appear in both the UI and browser console
3. Ask the AI assistant questions about your uploaded files

### AI Assistant Interactions
- "What tools do you have available?"
- "Calculate the compound interest on $1000 at 5% for 3 years"
- "What time is it in Tokyo right now?"
- "Generate a UUID for my project"
- "Analyze the data patterns in my uploaded CSV file"

### Advanced Workflows
1. **Data Exploration**: Upload datasets and ask analytical questions
2. **Document Review**: Upload reports and get AI-powered summaries
3. **Code Analysis**: Upload source code for structure and quality insights
4. **Multi-format Processing**: Handle diverse file types in a single session

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **AI Integration**: Model Context Protocol (MCP)
- **File Processing**: Multi-format analysis engine
- **Real-time Communication**: Streaming responses and live updates

## Project Structure

```
prism/
├── src/                    # Frontend React application
│   ├── components/         # UI components
│   ├── services/          # API and utility services
│   └── types/             # TypeScript definitions
├── server/                # Backend Express server
│   ├── server.js          # Main server with MCP integration
│   ├── mcpClient.js       # MCP client manager
│   └── dummy-mcp-server.js # Example MCP server
├── public/                # Static assets
└── docs/                  # Documentation
```

## Contributing

We welcome contributions to Prism! Please feel free to:
- Report bugs and suggest features via GitHub issues
- Submit pull requests for improvements
- Share your use cases and workflows
- Help improve documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, questions, or feature requests:
- Check the documentation in the `/docs` folder
- Open an issue on GitHub
- Review the setup guide in `SETUP.md`

---

**Prism** - Intelligent data analysis meets conversational AI. Transform how you work with data through an intuitive, powerful interface designed for modern workflows.