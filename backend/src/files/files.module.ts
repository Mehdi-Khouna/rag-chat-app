import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ChunkingService } from './chunking.service';
import { ExtractionService } from './extraction.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ChunkingService, ExtractionService],
})
export class FilesModule {}
