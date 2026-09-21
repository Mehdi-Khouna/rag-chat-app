import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RedisModule } from '../redis/redis.module';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
  imports: [RedisModule, ConversationsModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
