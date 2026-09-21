import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller('conversations/:conversationId/messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: '(Test only) Add a message to conversation history',
  })
  @ApiParam({ name: 'conversationId', description: 'ID of the conversation' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['user', 'assistant'] },
        content: { type: 'string' },
      },
      required: ['role', 'content'],
    },
  })
  async addMessage(
    @Param('conversationId') conversationId: string,
    @Body('role') role: 'user' | 'assistant',
    @Body('content') content: string,
  ) {
    await this.chatService.addMessage(conversationId, role, content);
    return { status: 'ok' };
  }

  @Get()
  @ApiOperation({ summary: 'Get message history for a conversation' })
  @ApiParam({ name: 'conversationId', description: 'ID of the conversation' })
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }
}
