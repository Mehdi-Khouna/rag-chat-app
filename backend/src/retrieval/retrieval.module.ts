import { Module } from '@nestjs/common';
import { RetrievalController } from './retrieval.controller';
import { RetrievalService } from './retrieval.service';
import { EmbeddingModule } from '../embedding/embedding.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [EmbeddingModule, ElasticsearchModule, ConversationsModule],
  controllers: [RetrievalController],
  providers: [RetrievalService],
  exports: [RetrievalService],
})
export class RetrievalModule {}
