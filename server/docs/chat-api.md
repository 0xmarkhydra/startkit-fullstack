# Chat API Documentation

## Overview

Chat API cung cấp các endpoint để xử lý tin nhắn chat và quản lý lịch sử chat cho hệ thống AI chatbot.

## Base URL

```
http://localhost:3000/api/chat
```

## Authentication

Hiện tại API không yêu cầu authentication. Trong tương lai sẽ thêm JWT authentication.

## Endpoints

### 1. Send Chat Message

**POST** `/api/chat`

Gửi tin nhắn chat và nhận phản hồi từ AI.

#### Request Body

```json
{
  "user_id": "string",      // Unique user identifier (hashed)
  "token_slug": "string",   // Token symbol (e.g., "xpl", "btc", "eth")
  "question": "string"      // User question
}
```

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_1234567890abcdef",
    "token_slug": "xpl",
    "question": "What is Plasma token and how does it work?"
  }'
```

#### Response

```json
{
  "statusCode": 200,
  "message": "Chat response generated successfully",
  "data": {
    "answer": "Plasma (XPL) is a revolutionary blockchain project...",
    "citations": [
      {
        "source": "https://docs.xpl.to/docs",
        "title": "XPL Documentation",
        "relevance_score": 0.95
      }
    ],
    "metadata": {
      "token_slug": "xpl",
      "processing_time": 0.5,
      "model_used": "mock",
      "message_id": "uuid-here"
    }
  },
  "timestamp": "2023-06-15T10:30:00Z"
}
```

#### Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2023-06-15T10:30:00Z"
}
```

### 2. Get Chat History

**GET** `/api/chat/history/{userId}/{tokenSlug}`

Lấy lịch sử chat của user cho một token cụ thể.

#### Path Parameters

- `userId` (string): Unique user identifier
- `tokenSlug` (string): Token symbol

#### Query Parameters

- `limit` (number, optional): Số lượng tin nhắn tối đa (default: 50)

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/chat/history/user_1234567890abcdef/xpl?limit=10" \
  -H "Content-Type: application/json"
```

#### Response

```json
{
  "statusCode": 200,
  "message": "Chat history retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "user_id": "user_1234567890abcdef",
      "token_slug": "xpl",
      "question": "What is Plasma token?",
      "answer": "Plasma (XPL) is a revolutionary blockchain...",
      "metadata": {
        "processing_time": 0.5,
        "model_used": "mock"
      },
      "citations": [
        {
          "source": "https://docs.xpl.to/docs",
          "title": "XPL Documentation",
          "relevance_score": 0.95
        }
      ],
      "message_order": 1,
      "created_at": "2023-06-15T10:30:00Z",
      "updated_at": "2023-06-15T10:30:00Z"
    }
  ],
  "timestamp": "2023-06-15T10:30:00Z"
}
```

## Data Models

### ChatRequestDto

```typescript
{
  user_id: string;      // Required: Unique user identifier
  token_slug: string;   // Required: Token symbol
  question: string;     // Required: User question
}
```

### ChatResponseDto

```typescript
{
  statusCode: number;
  message: string;
  data: {
    answer: string;           // AI response
    citations?: Array<{       // Optional: Source references
      source: string;
      title: string;
      relevance_score: number;
    }>;
    metadata?: {             // Optional: Additional data
      token_slug: string;
      processing_time: number;
      model_used: string;
      message_id: string;
    };
  };
  timestamp: string;
}
```

### ChatHistoryEntity

```typescript
{
  id: string;              // UUID
  user_id: string;         // User identifier
  token_slug: string;      // Token symbol
  question: string;        // User question
  answer: string;          // AI response
  metadata?: any;          // Additional metadata
  citations?: any[];       // Source citations
  message_order: number;   // Message sequence
  created_at: Date;        // Creation timestamp
  updated_at: Date;        // Last update timestamp
  deleted_at?: Date;       // Soft delete timestamp
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 500 | Internal Server Error |

## Rate Limiting

- **Chat Messages**: 60 requests per minute per user
- **History Requests**: 100 requests per minute per user

## Testing

### Using cURL

```bash
# Make script executable
chmod +x scripts/test-chat-api-curl.sh

# Run tests
./scripts/test-chat-api-curl.sh
```

### Using TypeScript

```bash
# Install dependencies
npm install axios

# Run test script
ts-node scripts/test-chat-api.ts
```

## Database Schema

### chat_history Table

```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  token_slug VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  metadata JSONB,
  citations JSONB,
  message_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_chat_history_user_token ON chat_history(user_id, token_slug);
CREATE INDEX idx_chat_history_message_order ON chat_history(message_order);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
```

## Future Enhancements

1. **Streaming Responses**: Server-Sent Events cho real-time responses
2. **Authentication**: JWT-based authentication
3. **Rate Limiting**: Advanced rate limiting per user/IP
4. **Caching**: Redis caching cho frequent queries
5. **Analytics**: Chat analytics và usage tracking
6. **Multi-language**: Support cho multiple languages
7. **Voice Input**: Speech-to-text integration
8. **File Uploads**: Support cho document uploads

## Support

Nếu bạn gặp vấn đề với API, vui lòng:

1. Kiểm tra logs của server
2. Verify database connection
3. Check environment variables
4. Contact development team
