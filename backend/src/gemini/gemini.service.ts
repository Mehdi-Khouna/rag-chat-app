import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async embedTexts(
    texts: string[],
    taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY',
  ): Promise<number[][]> {
    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: texts,
      config: { taskType },
    });

    if (!response.embeddings) {
      throw new Error('Gemini embedding response contained no embeddings');
    }

    return response.embeddings.map((e) => {
      if (!e.values) {
        throw new Error('Gemini returned an embedding with no values');
      }
      return e.values;
    });
  }
}
