import { Injectable } from '@nestjs/common';
import { ChunkingService } from './chunking.service';
import { ExtractionService } from './extraction.service';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly extractionService: ExtractionService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async processFiles(conversationId: string, files: Express.Multer.File[]) {
    const results = await Promise.all(
      files.map(async (file) => {
        const text = await this.extractionService.extractText(file);
        const chunks = this.chunkingService.chunkText(text);
        const embeddings = await this.embeddingService.embedChunks(chunks);
        return {
          fileName: file.originalname,
          chunkCount: chunks.length,
          chunks,
          embeddings,
        };
      }),
    );
    return results;
  }
}
