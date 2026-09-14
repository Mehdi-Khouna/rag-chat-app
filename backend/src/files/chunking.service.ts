import { Injectable } from '@nestjs/common';
import 'multer';

@Injectable()
export class ChunkingService {
  private readonly chunkSize = 1000;
  private readonly overlap = 200;

  chunkText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = start + this.chunkSize;
      chunks.push(text.slice(start, end));
      start = end - this.overlap;
    }
    return chunks;
  }
}
