import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { RetrievalService } from './retrieval.service';

@ApiTags('retrieval')
@Controller('conversations/:conversationId/search')
export class RetrievalController {
  constructor(private readonly retrievalService: RetrievalService) {}

  @Post()
  @ApiOperation({
    summary: '(Test only) Retrieve top-K relevant chunks for a query',
  })
  @ApiParam({ name: 'conversationId', description: 'ID of the conversation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          example: 'What role does the rainforest play in climate regulation?',
        },
      },
      required: ['query'],
    },
  })
  async search(
    @Param('conversationId') conversationId: string,
    @Body('query') query: string,
  ) {
    return this.retrievalService.retrieve(conversationId, query);
  }
}
