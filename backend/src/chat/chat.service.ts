import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { RedisService } from '../redis/redis.service';
import { ConversationsService } from '../conversations/conversations.service';
import { RetrievalService } from '../retrieval/retrieval.service';
import { GeminiService } from '../gemini/gemini.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface RetrievedChunk {
  text: string;
  fileName: string;
  chunkIndex: number;
}

const ANSWER_CACHE_TTL_SECONDS = 60 * 60; // 1 hour
const HISTORY_WINDOW = 6; // last 6 messages included in the prompt

@Injectable()
export class ChatService {
  constructor(
    private readonly redisService: RedisService,
    private readonly conversationsService: ConversationsService,
    private readonly retrievalService: RetrievalService,
    private readonly geminiService: GeminiService,
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

  async ask(conversationId: string, query: string): Promise<string> {
    await this.conversationsService.assertExists(conversationId);

    const cacheKey = `answer:${conversationId}:${this.hash(query)}`;
    const cached = await this.redisService.client.get(cacheKey);
    if (cached) {
      await this.addMessage(conversationId, 'user', query);
      await this.addMessage(conversationId, 'assistant', cached);
      return cached;
    }

    const chunks = await this.retrievalService.retrieve(conversationId, query);
    const history = (await this.getMessages(conversationId)).slice(
      -HISTORY_WINDOW,
    );

    const prompt = this.buildPrompt(chunks, history, query);
    const answer = await this.geminiService.generateAnswer(prompt);

    await this.addMessage(conversationId, 'user', query);
    await this.addMessage(conversationId, 'assistant', answer);
    await this.redisService.client.set(
      cacheKey,
      answer,
      'EX',
      ANSWER_CACHE_TTL_SECONDS,
    );

    return answer;
  }

  private buildPrompt(
    chunks: RetrievedChunk[],
    history: ChatMessage[],
    query: string,
  ): string {
    const context = chunks
      .map((c, i) => `[${i + 1}] (from ${c.fileName}): ${c.text}`)
      .join('\n\n');

    const historyText = history
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    return `You are a helpful assistant answering questions based on the document excerpts below. If the answer isn't contained in the excerpts, say you don't know rather than guessing.

    Document excerpts:
    ${context}

    ${historyText ? `Conversation so far:\n${historyText}\n` : ''}
    Question: ${query}`;
  }

  private hash(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }
}
