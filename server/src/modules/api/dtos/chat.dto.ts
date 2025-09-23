import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'Token symbol/slug (e.g., xpl, btc, eth)',
    example: 'xpl',
  })
  @IsString()
  @IsNotEmpty()
  token_slug: string;

  @ApiProperty({
    description: 'User question about the token',
    example: 'What is Plasma token and how does it work?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Unique user identifier (hashed)',
    example: 'user_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Chat response generated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Chat response data',
    example: {
      answer: 'Plasma (XPL) is a Layer1 blockchain built on Bitcoin...',
      citations: [
        {
          source: 'https://docs.plasma.to/docs',
          title: 'Plasma Documentation',
          relevance_score: 0.95
        }
      ],
      metadata: {
        token_slug: 'xpl',
        processing_time: 1.2,
        model_used: 'gpt-4'
      }
    }
  })
  data: {
    answer: string;
    citations?: any[];
    metadata?: any;
  };

  @ApiProperty({
    description: 'Response timestamp',
    example: '2023-06-15T10:30:00Z',
  })
  timestamp: string;
}

export class ChatHistoryRequestDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 'user_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Token symbol/slug',
    example: 'xpl',
  })
  @IsString()
  @IsNotEmpty()
  token_slug: string;

  @ApiPropertyOptional({
    description: 'Number of messages to retrieve',
    example: 50,
    default: 50,
  })
  @IsOptional()
  limit?: number;
}

export class ChatHistoryResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Chat history retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Chat history data',
    example: [
      {
        id: 'uuid-here',
        question: 'What is Plasma token?',
        answer: 'Plasma (XPL) is a Layer1 blockchain...',
        created_at: '2023-06-15T10:30:00Z',
        message_order: 1
      }
    ]
  })
  data: any[];

  @ApiProperty({
    description: 'Response timestamp',
    example: '2023-06-15T10:30:00Z',
  })
  timestamp: string;
}
