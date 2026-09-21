import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChunkingService } from './chunking.service';
import { ExtractionService } from './extraction.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly extractionService: ExtractionService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async processFiles(conversationId: string, files: Express.Multer.File[]) {
    await this.conversationsService.assertExists(conversationId);
    const results = await Promise.all(
      files.map(async (file) => {
        const fileId = randomUUID();
        const text = await this.extractionService.extractText(file);
        const chunks = this.chunkingService.chunkText(text);
        const embeddings = await this.embeddingService.embedChunks(chunks);
        await this.elasticsearchService.indexChunks(
          conversationId,
          fileId,
          file.originalname,
          chunks,
          embeddings,
        );
        return {
          fileId,
          fileName: file.originalname,
          chunkCount: chunks.length,
        };
      }),
    );
    await this.conversationsService.touch(conversationId);
    return results;
  }
}
