import { Injectable } from '@nestjs/common';
import { EmbeddingService } from '../embedding/embedding.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async retrieve(conversationId: string, query: string, topK = 5) {
    const queryEmbedding = await this.embeddingService.embedQuery(query);
    return this.elasticsearchService.search(
      conversationId,
      queryEmbedding,
      topK,
    );
  }
}
