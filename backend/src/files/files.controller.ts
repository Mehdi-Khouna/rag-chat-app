import {
  Controller,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('conversations/:conversationId/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @Param('conversationId') conversationId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.processFiles(conversationId, files);
  }
}
