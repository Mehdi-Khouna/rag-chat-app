import { Injectable } from '@nestjs/common';
import { EmbeddingService } from '../embedding/embedding.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async retrieve(conversationId: string, query: string, topK = 5) {
    await this.conversationsService.assertExists(conversationId);
    const queryEmbedding = await this.embeddingService.embedQuery(query);
    return this.elasticsearchService.search(
      conversationId,
      queryEmbedding,
      topK,
    );
  }
}
