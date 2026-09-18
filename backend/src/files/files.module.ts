import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ChunkingService } from './chunking.service';
import { ExtractionService } from './extraction.service';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { ElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';

@Module({
  imports: [EmbeddingModule, ElasticsearchModule],
  controllers: [FilesController],
  providers: [FilesService, ChunkingService, ExtractionService],
})
export class FilesModule {}
