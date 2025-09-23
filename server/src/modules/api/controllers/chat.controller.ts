import { Controller, Post, Get, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ChatService } from '../../business/services/chat.service';
import { ChatRequestDto, ChatResponseDto, ChatHistoryRequestDto, ChatHistoryResponseDto } from '../dtos/chat.dto';

@ApiTags('Chat')
@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'Send chat message',
    description: 'Process a chat message and return AI response with chat history tracking',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chat response generated successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async sendMessage(@Body() chatRequest: ChatRequestDto): Promise<ChatResponseDto> {
    const startTime = Date.now();
    
    try {
      const result = await this.chatService.processChat(chatRequest);
      const processingTime = Date.now() - startTime;
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Chat response generated successfully',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process chat message',
        data: {
          answer: 'Sorry, I encountered an error processing your request. Please try again.',
          citations: [],
          metadata: {
            error: true,
            processing_time: Date.now() - startTime,
          }
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('history/:userId/:tokenSlug')
  @ApiOperation({
    summary: 'Get chat history',
    description: 'Retrieve chat history for a specific user and token',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique user identifier',
    example: 'user_1234567890abcdef',
  })
  @ApiParam({
    name: 'tokenSlug',
    description: 'Token symbol/slug',
    example: 'xpl',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of messages to retrieve',
    required: false,
    type: Number,
    example: 50,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chat history retrieved successfully',
    type: ChatHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid parameters',
  })
  async getChatHistory(
    @Param('userId') userId: string,
    @Param('tokenSlug') tokenSlug: string,
    @Query('limit') limit?: number,
  ): Promise<ChatHistoryResponseDto> {
    try {
      const history = await this.chatService.getChatHistory(userId, tokenSlug, limit || 50);
      
      return {
        statusCode: HttpStatus.OK,
        message: 'Chat history retrieved successfully',
        data: history,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve chat history',
        data: [],
        timestamp: new Date().toISOString(),
      };
    }
  }
}
