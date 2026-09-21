import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ConversationsService } from '../conversations/conversations.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly redisService: RedisService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async addMessage(
    conversationId: string,
    role: ChatMessage['role'],
    content: string,
  ): Promise<void> {
    await this.conversationsService.assertExists(conversationId);
    const message: ChatMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    await this.redisService.client.rpush(
      `conv:${conversationId}:messages`,
      JSON.stringify(message),
    );
    await this.conversationsService.touch(conversationId);
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await this.conversationsService.assertExists(conversationId);
    const raw = await this.redisService.client.lrange(
      `conv:${conversationId}:messages`,
      0,
      -1,
    );
    return raw.map((m) => JSON.parse(m) as ChatMessage);
  }
}
