import { Injectable } from '@nestjs/common';

@Injectable()
export class ChunkingService {
  private readonly chunkSize = 1000;
  private readonly overlap = 200;

  chunkText(text: string): string[] {
    const paragraphs = text
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const chunks: string[] = [];
    for (const paragraph of paragraphs) {
      if (paragraph.length <= this.chunkSize) {
        chunks.push(paragraph);
      } else {
        chunks.push(...this.slidingWindow(paragraph));
      }
    }
    return chunks;
  }

  private slidingWindow(text: string): string[] {
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
