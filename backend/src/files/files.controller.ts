import {
  Controller,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('files')
@Controller('conversations/:conversationId/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload one or more files to a conversation' })
  @ApiParam({ name: 'conversationId', description: 'ID of the conversation' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @Param('conversationId') conversationId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.processFiles(conversationId, files);
  }
}
