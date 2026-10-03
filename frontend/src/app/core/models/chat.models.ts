export interface FileUploadResult {
  fileId: string;
  fileName: string;
  chunkCount: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AskResponse {
  answer: string;
}

export interface CreateConversationResponse {
  conversationId: string;
}
