export interface MoonshotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MoonshotResponse {
  content: string;
  sourceInfo?: {
    fileName: string;
    fileType: string;
    fileSize: string;
    description: string;
    objectId: string;
    uploadDate: string;
  };
}

export async function sendMessageToMoonshot(
  messages: MoonshotMessage[],
  onStream?: (chunk: string) => void
): Promise<MoonshotResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Check for source information in headers
    let sourceInfo = undefined;
    const hasSource = response.headers.get('X-Source-Available');
    if (hasSource === 'true') {
      const sourceData = response.headers.get('X-Source-Data');
      if (sourceData) {
        try {
          sourceInfo = JSON.parse(sourceData);
          console.log('📎 Received source info from server:', sourceInfo.fileName);
        } catch (error) {
          console.error('Failed to parse source data:', error);
        }
      }
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        fullResponse += chunk;
        onStream?.(chunk);
      }
    }

    return {
      content: fullResponse,
      sourceInfo
    };
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw new Error('Failed to get response from Moonshot API');
  }
}

export function convertChatMessagesToMoonshotFormat(
  messages: { type: 'user' | 'ai'; content: string }[]
): MoonshotMessage[] {
  return messages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
} 