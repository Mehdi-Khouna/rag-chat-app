import { Injectable } from '@nestjs/common';
import { extractText, getDocumentProxy } from 'unpdf';

@Injectable()
export class ExtractionService {
  async extractText(file: Express.Multer.File): Promise<string> {
    if (file.mimetype === 'application/pdf') {
      const pdf = await getDocumentProxy(new Uint8Array(file.buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      return text;
    }
    return file.buffer.toString('utf-8');
  }
}
