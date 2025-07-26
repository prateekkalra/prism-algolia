export interface MoonshotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToMoonshot(
  messages: MoonshotMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
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

    return fullResponse;
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