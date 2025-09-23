import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('chat_history')
export class ChatHistoryEntity extends BaseEntity {
  @Column()
  @Index()
  user_id: string;

  @Column()
  @Index()
  token_slug: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: any;

  @Column({ type: 'simple-json', nullable: true })
  citations?: any[];

  @Column({ type: 'int', default: 0 })
  @Index()
  message_order: number;
}
