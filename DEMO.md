# Prism Demo - Intelligent Data Analysis Platform

This demonstrates Prism's AI-powered data analysis capabilities with the intuitive dual-panel interface.

## Interface Overview

**Left Panel**: Data Processing & Analysis
- Drag & drop file upload area  
- Real-time file analysis results
- Analysis history with detailed breakdowns
- Support for all major file types

**Right Panel**: AI Assistant Chat
- Interactive conversation with Prism AI
- Context-aware responses about your data
- Advanced tool integration via MCP
- Export and conversation management

**Resizable Divider**: Drag to customize your workspace layout

## What Happens When You Upload Files

### 1. Smart Upload Process
1. **Drag & drop** any file into the left panel upload area
2. **Prism analyzes** using advanced AI processing in real-time
3. **Detailed results** appear in both the left panel and browser console
4. **AI assistant** becomes aware of your data for contextual conversations

### 2. Console Output Example

Open browser dev tools (F12 → Console) to see comprehensive analysis logs:

```
=== PRISM FILE ANALYSIS COMPLETE ===
File: market-research-data.xlsx
Type: Spreadsheet
Size: 2.1 MB
Analysis:
This Excel spreadsheet contains market research data with the following insights:

- **Data Structure**: 5 worksheets with customer survey responses
- **Key Metrics**: Demographics, satisfaction scores, purchase intent
- **Sample Size**: 1,247 respondents across Q3-Q4 2024
- **Notable Patterns**: High satisfaction (4.2/5) in urban segments
- **Data Quality**: Complete responses with minimal missing values
- **Recommendations**: Focus marketing on 25-34 age demographic

The data appears well-structured for statistical analysis and trend identification.
Data trends suggest strong market opportunity in metropolitan areas.
===========================================
```

### 3. Left Panel Analysis Display

Results appear with:
- **File metadata**: Name, type, size with intuitive icons
- **Smart summaries**: Key insights and patterns identified
- **Analysis history**: Scrollable list of all processed files
- **Quick actions**: View details, link to conversations

## File Type Analysis Examples

### Spreadsheets & Data Files (.xlsx, .csv, .json)
- **Analysis focus**: Data patterns, statistical insights, quality assessment
- **Key features**: Column analysis, trend identification, data validation
- **AI capabilities**: Can answer questions about your data in chat

### Documents (.pdf, .docx, .pptx)
- **Analysis focus**: Content themes, structure, key information extraction
- **Key features**: Summary generation, topic identification, entity extraction
- **AI capabilities**: Document Q&A, content comparison, insight generation

### Images (.jpg, .png, .webp, .svg)
- **Analysis focus**: Visual content, text recognition, composition analysis
- **Key features**: Object detection, scene understanding, text extraction
- **AI capabilities**: Image description, content analysis, visual Q&A

### Audio & Video (.mp3, .mp4, .wav, .mov)
- **Analysis focus**: Content transcription, audio characteristics, duration
- **Key features**: Speech-to-text, content categorization, quality assessment
- **AI capabilities**: Content summarization, topic extraction, media Q&A

### Code Files (.js, .py, .ts, .java, .cpp)
- **Analysis focus**: Code structure, complexity, patterns, dependencies
- **Key features**: Language detection, function analysis, quality metrics
- **AI capabilities**: Code explanation, optimization suggestions, debugging help

## AI Assistant Capabilities

### Context-Aware Conversations
Once you upload files, the AI assistant can:
- **Answer specific questions** about your data
- **Generate insights** and recommendations
- **Perform calculations** on your datasets
- **Compare information** across multiple files
- **Create summaries** and reports

### Advanced Tool Integration
Prism's AI assistant has access to powerful tools via MCP:
- **Calculator**: Complex mathematical operations and data calculations
- **Time Tools**: Date/time analysis for temporal data
- **UUID Generator**: Create unique identifiers for data tracking  
- **System Tools**: Environment information and system status

## Interactive Demo Scenarios

### Scenario 1: Business Data Analysis
1. **Upload**: Drop a sales report (Excel/CSV)
2. **Analysis**: Prism identifies trends, top performers, seasonal patterns
3. **Chat**: Ask "What were our best-selling products last quarter?"
4. **Tools**: "Calculate the year-over-year growth rate"

### Scenario 2: Document Intelligence
1. **Upload**: Drop a research paper or report (PDF)
2. **Analysis**: Extract key findings, methodology, conclusions
3. **Chat**: Ask "Summarize the main research findings"
4. **Tools**: "What time was this document created?"

### Scenario 3: Media Content Analysis
1. **Upload**: Drop an image or video file
2. **Analysis**: Identify objects, scenes, text, or transcribe audio
3. **Chat**: Ask "What's happening in this image?"
4. **Tools**: "Generate a UUID for this media file"

### Scenario 4: Code Review
1. **Upload**: Drop source code files
2. **Analysis**: Structure analysis, complexity metrics, pattern detection
3. **Chat**: Ask "Explain what this code does"
4. **Tools**: "Calculate the cyclomatic complexity"

## Advanced Features

### Multi-File Workflows
- **Upload multiple files** to build a comprehensive knowledge base
- **Cross-reference data** between different file types
- **Generate comparative insights** across your entire dataset
- **Maintain context** across all uploaded files

### Real-Time Tool Execution
Watch as Prism:
- **Executes calculations** in real-time during conversations
- **Fetches system information** when relevant to your analysis
- **Generates unique identifiers** for data tracking
- **Provides time-based insights** for temporal analysis

### Smart Source Linking
- **Automatic references**: AI responses link back to source files
- **Context preservation**: Know which data informed each insight
- **Detailed analysis access**: Click to view full file analysis
- **Conversation continuity**: Maintain context across sessions

## Getting Started

1. **Launch Prism**: Start the application with `npm run dev:full`
2. **Check Tools**: Click the MCP status panel to see available tools
3. **Upload Data**: Drag any file to the left panel to begin analysis
4. **Start Chatting**: Ask questions about your data in the right panel
5. **Explore Tools**: Try calculations, time queries, or system information
6. **Export Results**: Save your analysis and conversations

## Pro Tips

### Maximizing Analysis Quality
- **Upload related files together** for comprehensive context
- **Use descriptive filenames** to help Prism understand content
- **Ask specific questions** to get targeted insights
- **Combine file analysis with tool usage** for deeper insights

### Effective Conversations
- **Reference specific data points** mentioned in the analysis
- **Ask follow-up questions** to drill down into interesting patterns
- **Request calculations** on your data using the built-in tools
- **Export important conversations** for future reference

### Workspace Optimization
- **Adjust panel sizes** by dragging the divider to fit your workflow
- **Keep analysis history visible** for reference during conversations
- **Use the console output** for detailed technical information
- **Monitor tool execution** in real-time for transparency

## Sample Prompts to Try

### Data Analysis
- "What are the key trends in my uploaded sales data?"
- "Calculate the average revenue per customer from my dataset"
- "Compare the performance metrics across different regions"

### File Intelligence
- "Summarize the main points from my uploaded report"
- "What code patterns do you see in my uploaded files?"
- "Extract the key information from this image"

### Tool Integration
- "Calculate compound interest: $10,000 at 4.5% for 7 years"
- "What time is it in Tokyo right now?"
- "Generate a UUID for tracking this analysis session"
- "Show me current system performance metrics"

---

**Prism** transforms how you work with data by combining intelligent file analysis with conversational AI and powerful tool integration. Experience the future of data analysis through an interface designed for modern workflows.