import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChunkingService } from './chunking.service';
import { ExtractionService } from './extraction.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly extractionService: ExtractionService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async processFiles(conversationId: string, files: Express.Multer.File[]) {
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
    return results;
  }
}
