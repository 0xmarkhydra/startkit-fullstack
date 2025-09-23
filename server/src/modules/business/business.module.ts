import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OpenAIService } from './services/openai.service';
import { ChatService } from './services/chat.service';
import { PretgeApiService } from './services/pretge-api.service';
import { ConfigModule } from '@nestjs/config';

const services = [OpenAIService, ChatService, PretgeApiService];

@Module({
  imports: [DatabaseModule, ConfigModule],
  exports: [...services],
  providers: [...services],
})
export class BusinessModule {}
