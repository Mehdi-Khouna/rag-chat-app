import { Injectable } from '@nestjs/common';
import { ChunkingService } from './chunking.service';
import { ExtractionService } from './extraction.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly extractionService: ExtractionService,
    private readonly chunkingService: ChunkingService,
  ) {}

  async processFiles(conversationId: string, files: Express.Multer.File[]) {
    const results = await Promise.all(
      files.map(async (file) => {
        const text = await this.extractionService.extractText(file);
        const chunks = this.chunkingService.chunkText(text);
        return {
          fileName: file.originalname,
          chunkCount: chunks.length,
          chunks,
        };
      }),
    );
    return results;
  }
}
