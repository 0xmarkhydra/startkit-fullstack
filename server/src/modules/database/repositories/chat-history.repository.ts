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
  ): Promise<ChatHistoryEntity> {
    const messageOrder = await this.getLastMessageOrder(userId, tokenSlug) + 1;
    
    const chatMessage = this.create({
      user_id: userId,
      token_slug: tokenSlug,
      question,
      answer,
      metadata,
      citations,
      message_order: messageOrder,
    });

    return this.save(chatMessage);
  }
}
