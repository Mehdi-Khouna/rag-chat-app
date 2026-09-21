import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { GeminiService } from '../gemini/gemini.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class EmbeddingService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly redisService: RedisService,
  ) {}

  async embedChunks(chunks: string[]): Promise<number[][]> {
    return this.embedTexts(chunks, 'RETRIEVAL_DOCUMENT');
  }

  async embedQuery(query: string): Promise<number[]> {
    const [vector] = await this.embedTexts([query], 'RETRIEVAL_QUERY');
    return vector;
  }

  private async embedTexts(
    texts: string[],
    taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY',
  ): Promise<number[][]> {
    const results: number[][] = new Array<number[]>(texts.length);
    const toEmbed: { index: number; text: string; hash: string }[] = [];

    for (let i = 0; i < texts.length; i++) {
      const hash = this.hash(texts[i]);
      const cached = await this.redisService.client.get(`embed:${hash}`);
      if (cached) {
        results[i] = JSON.parse(cached) as number[];
      } else {
        toEmbed.push({ index: i, text: texts[i], hash });
      }
    }

    if (toEmbed.length > 0) {
      const vectors = await this.geminiService.embedTexts(
        toEmbed.map((c) => c.text),
        taskType,
      );
      await Promise.all(
        toEmbed.map(async (c, j) => {
          results[c.index] = vectors[j];
          await this.redisService.client.set(
            `embed:${c.hash}`,
            JSON.stringify(vectors[j]),
          );
        }),
      );
    }

    return results;
  }

  private hash(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }
}
