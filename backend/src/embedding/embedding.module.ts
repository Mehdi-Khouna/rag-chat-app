import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { GeminiModule } from '../gemini/gemini.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [GeminiModule, RedisModule],
  providers: [EmbeddingService],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
