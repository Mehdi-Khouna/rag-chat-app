import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

const INDEX_NAME = 'chunks';
const EMBEDDING_DIMS = 3072;

interface ChunkSource {
  text: string;
  fileName: string;
  chunkIndex: number;
}

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get<string>('ELASTICSEARCH_URL'),
    });
  }

  async onModuleInit() {
    const exists = await this.client.indices.exists({ index: INDEX_NAME });
    if (!exists) {
      await this.client.indices.create({
        index: INDEX_NAME,
        mappings: {
          properties: {
            conversationId: { type: 'keyword' },
            fileId: { type: 'keyword' },
            fileName: { type: 'keyword' },
            chunkIndex: { type: 'integer' },
            text: { type: 'text' },
            embedding: {
              type: 'dense_vector',
              dims: EMBEDDING_DIMS,
              index: true,
              similarity: 'cosine',
            },
          },
        },
      });
    }
  }

  async indexChunks(
    conversationId: string,
    fileId: string,
    fileName: string,
    chunks: string[],
    embeddings: number[][],
  ) {
    const operations = chunks.flatMap((text, i) => [
      { index: { _index: INDEX_NAME } },
      {
        conversationId,
        fileId,
        fileName,
        chunkIndex: i,
        text,
        embedding: embeddings[i],
      },
    ]);

    const result = await this.client.bulk({ refresh: true, operations });
    if (result.errors) {
      throw new Error('Elasticsearch bulk indexing encountered errors');
    }
  }

  async search(conversationId: string, queryEmbedding: number[], topK: number) {
    const response = await this.client.search<ChunkSource>({
      index: INDEX_NAME,
      knn: {
        field: 'embedding',
        query_vector: queryEmbedding,
        k: topK,
        num_candidates: 50,
        filter: { term: { conversationId } },
      },
      _source: ['text', 'fileName', 'chunkIndex'],
    });

    return response.hits.hits.map((hit) => ({
      text: hit._source!.text,
      fileName: hit._source!.fileName,
      chunkIndex: hit._source!.chunkIndex,
      score: hit._score,
    }));
  }
}
