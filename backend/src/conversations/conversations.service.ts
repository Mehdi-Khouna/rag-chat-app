import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '../redis/redis.service';

const CONVERSATION_TTL_SECONDS = 60 * 60 * 24; // 24 hours of inactivity

@Injectable()
export class ConversationsService {
  constructor(private readonly redisService: RedisService) {}

  async createConversation(): Promise<string> {
    const conversationId = randomUUID();
    const metaKey = `conv:${conversationId}:meta`;
    await this.redisService.client.hset(metaKey, {
      createdAt: new Date().toISOString(),
    });
    await this.redisService.client.expire(metaKey, CONVERSATION_TTL_SECONDS);
    return conversationId;
  }

  async exists(conversationId: string): Promise<boolean> {
    const result = await this.redisService.client.exists(
      `conv:${conversationId}:meta`,
    );
    return result === 1;
  }

  async assertExists(conversationId: string): Promise<void> {
    if (!(await this.exists(conversationId))) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }
  }

  async touch(conversationId: string): Promise<void> {
    await this.redisService.client.expire(
      `conv:${conversationId}:meta`,
      CONVERSATION_TTL_SECONDS,
    );
    await this.redisService.client.expire(
      `conv:${conversationId}:messages`,
      CONVERSATION_TTL_SECONDS,
    );
  }
}
