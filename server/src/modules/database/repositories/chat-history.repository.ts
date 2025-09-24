import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ChatHistoryEntity } from '../entities/chat-history.entity';

export class ChatHistoryRepository extends Repository<ChatHistoryEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(ChatHistoryEntity, dataSource.createEntityManager());
  }

  async getChatHistory(userId: string, tokenSlug: string, limit: number = 50): Promise<ChatHistoryEntity[]> {
    return this.find({
      where: { user_id: userId, token_slug: tokenSlug },
      order: { message_order: 'ASC' },
      take: limit,
    });
  }

  async getLastMessageOrder(userId: string, tokenSlug: string): Promise<number> {
    const lastMessage = await this.findOne({
      where: { user_id: userId, token_slug: tokenSlug },
      order: { message_order: 'DESC' },
      select: ['message_order'],
    });
    
    return lastMessage?.message_order || 0;
  }

  async saveChatMessage(
    userId: string,
    tokenSlug: string,
    question: string,
    answer: string,
    metadata?: any,
    citations?: any[]
  ): Promise<ChatHistoryEntity[]> {
    const lastOrder = await this.getLastMessageOrder(userId, tokenSlug);
    
    // Save user message first
    const userMessage = this.create({
      user_id: userId,
      token_slug: tokenSlug,
      question,
      answer: '', // Empty answer for user message
      metadata: {
        ...metadata,
        message_type: 'user',
        timestamp: new Date().toISOString(),
      },
      citations: [],
      message_order: lastOrder + 1,
    });

    // Save AI response second
    const aiMessage = this.create({
      user_id: userId,
      token_slug: tokenSlug,
      question: '', // Empty question for AI message
      answer,
      metadata: {
        ...metadata,
        message_type: 'ai',
        timestamp: new Date().toISOString(),
      },
      citations,
      message_order: lastOrder + 2,
    });

    // Save both messages
    const savedUserMessage = await this.save(userMessage);
    const savedAiMessage = await this.save(aiMessage);

    return [savedUserMessage, savedAiMessage];
  }
}
