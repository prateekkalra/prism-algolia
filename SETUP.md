# AI File Analyzer Setup

This application uses Google's Gemini API to analyze uploaded files of any type (video, audio, text, PDF, images, etc.).

## Prerequisites

1. Node.js installed on your system
2. A Google AI Studio API key

## Setup Instructions

### 1. Get your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

Add your API key to the `.env` file:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies and Run

```bash
# Install dependencies (already done if you're seeing this)
npm install

# Start the development server
npm run dev
```

## Usage

1. Open the application in your browser
2. Drag and drop any file onto the upload area, or click to select files
3. The AI will analyze the file and display results both in the UI and in the browser console
4. Supported file types:
   - **Videos**: MP4, AVI, MOV, etc.
   - **Audio**: MP3, WAV, AAC, etc.
   - **Documents**: PDF, TXT, MD, etc.
   - **Images**: JPG, PNG, GIF, etc.
   - **Code files**: JS, TS, HTML, CSS, etc.
   - **Any other file type**

## Features

- **Multi-format support**: Handles video, audio, text, PDF, images, and more
- **AI-powered analysis**: Uses Google's Gemini AI for intelligent content analysis
- **Console output**: Detailed results printed to browser console
- **Drag & drop interface**: Easy file upload with visual feedback
- **Real-time processing**: See analysis results as they complete

## Troubleshooting

- **API Key Issues**: Make sure your `.env` file is in the project root and the key is correctly formatted
- **File Upload Issues**: Check browser console for error messages
- **Large Files**: Very large files may take longer to process or hit API limits

## API Limits

- Gemini API has rate limits and file size limits
- Check [Google's documentation](https://ai.google.dev/) for current limits
- The app handles errors gracefully and will show fallback descriptions if API calls fail 