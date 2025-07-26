# Prism Setup Guide

This guide will help you set up Prism, a data analysis chat application powered by Moonshot AI.

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

### Option 2: Separate Servers
Run frontend and backend separately:

```bash
# Terminal 1: Backend server
npm run server:dev

# Terminal 2: Frontend (in a new terminal)
npm run dev
```

## Architecture

This application uses a **client-server architecture** to avoid CORS issues:

- **Frontend**: React app that makes API calls to the backend
- **Backend**: Express server that communicates with Moonshot API
- **API Flow**: Frontend → Backend Server → Moonshot API

### Why Backend Server?

The Moonshot API doesn't allow direct browser requests due to CORS restrictions. The backend server:
- ✅ **Handles CORS**: Server-to-server communication bypasses CORS
- ✅ **Secure**: API key stays on the server, not exposed to browser
- ✅ **Streaming**: Properly handles streaming responses
- ✅ **Error Handling**: Better error management and logging

## API Endpoints

The backend server provides:
- `GET /health` - Health check and configuration status
- `POST /api/chat` - Chat completion with streaming support

## Features

- **Chat Interface**: Interactive chat with Moonshot AI
- **File Analysis**: Upload and analyze various file types (frontend feature)
- **Real-time Streaming**: See AI responses as they're generated
- **Resizable Panels**: Adjust the layout to your preference
- **Export Conversations**: Save your chat history

## Usage

1. **Start the application**: Use `npm run dev:full`
2. **Upload Files**: Use the left panel to upload documents, spreadsheets, or other data files
3. **Ask Questions**: Type your questions in the chat interface on the right
4. **Get Insights**: Moonshot AI will analyze your data and provide detailed responses
4. **Export Results**: Save conversations for future reference

## Troubleshooting

### API Key Issues
- Make sure `server/.env` file exists with your Moonshot API key
- Verify your Moonshot API key is correct and has sufficient credits
- Check the server logs for API key configuration status

### Connection Issues
- Ensure both servers are running (`npm run dev:full`)
- Check `http://localhost:3001/health` to verify backend is working
- Verify the Moonshot API is accessible from your server
- Check browser network tab for any API errors

### Server Issues
- Make sure port 3001 is available
- Check server logs in the terminal for error messages
- Verify all backend dependencies are installed (`npm run server:install`)

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
├── server/             # Backend Express server
│   ├── server.js      # Main server file
│   ├── package.json   # Server dependencies
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
- Fast response times
- Competitive pricing

For more information about Moonshot AI and their models, visit [platform.moonshot.cn](https://platform.moonshot.cn/). 