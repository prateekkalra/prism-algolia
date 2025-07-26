# Prism Backend Server

Express.js server that handles Moonshot API calls to avoid CORS issues.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Moonshot API key

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
MOONSHOT_API_KEY=your_moonshot_api_key_here  # Required
PORT=3001                                    # Optional, defaults to 3001
FRONTEND_URL=http://localhost:5173           # Optional, for CORS
NODE_ENV=development                         # Optional
```

## API Endpoints

- `GET /health` - Health check and configuration status
- `POST /api/chat` - Chat completion with streaming support

## Request/Response

### POST /api/chat

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"},
    {"role": "user", "content": "How are you?"}
  ]
}
```

**Response:**
Streaming text response from Moonshot AI.

### GET /health

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "apiKeyConfigured": true
}
```

## Features

- ✅ **CORS Handling**: Proper CORS headers for frontend communication
- ✅ **Streaming Support**: Real-time response streaming
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Environment Config**: Flexible configuration via environment variables
- ✅ **Health Check**: Status endpoint for monitoring
- ✅ **Production Ready**: Serves static files in production mode

## Development

Uses `nodemon` for auto-restart during development:

```bash
npm run dev
```

## Production

In production, the server also serves the built frontend:

```bash
NODE_ENV=production npm start
```

The server will serve static files from `../dist` directory.

## Troubleshooting

1. **Port in use**: Change `PORT` in `.env`
2. **CORS errors**: Check `FRONTEND_URL` matches your frontend URL
3. **API errors**: Verify `MOONSHOT_API_KEY` is correct
4. **Health check**: Visit `http://localhost:3001/health` 