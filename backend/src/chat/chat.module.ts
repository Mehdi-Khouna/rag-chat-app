import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RedisModule } from '../redis/redis.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { RetrievalModule } from 'src/retrieval/retrieval.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [RedisModule, ConversationsModule, RetrievalModule, GeminiModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
