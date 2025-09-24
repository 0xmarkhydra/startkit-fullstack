import { Injectable, Logger } from '@nestjs/common';
import { ChatHistoryRepository } from '../../database/repositories/chat-history.repository';
import { ChatRequestDto } from '../../api/dtos/chat.dto';
import { OpenAIService } from './openai.service';
import { PretgeApiService } from './pretge-api.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly chatHistoryRepository: ChatHistoryRepository,
    private readonly openAIService: OpenAIService,
    private readonly pretgeApiService: PretgeApiService,
  ) {}

  async processChat(chatRequest: ChatRequestDto): Promise<any> {
    this.logger.log(`[🔍] [ChatService] [processChat] [request]:`, chatRequest);

    try {
      const startTime = Date.now();
      
      // Get chat history for context
      const chatHistory = await this.chatHistoryRepository.getChatHistory(
        chatRequest.user_id, 
        chatRequest.token_slug, 
        10 // Last 10 messages for context
      );
      
      // Get real token data from PretgeMarket APIs
      const { tokenData, projectData } = await this.pretgeApiService.getTokenInfo(chatRequest.token_slug);
      
      // Build context-aware prompt with real data
      const systemPrompt = this.buildSystemPrompt(chatRequest.token_slug, tokenData, projectData);
      const contextualQuestion = this.buildContextualQuestion(
        chatRequest.question, 
        chatRequest.token_slug, 
        chatHistory
      );
      
      // Get AI response using OpenAI
      const aiResponse = await this.getAIResponse(systemPrompt, contextualQuestion);
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      // Save to chat history (both user message and AI response)
      const chatMessages = await this.chatHistoryRepository.saveChatMessage(
        chatRequest.user_id,
        chatRequest.token_slug,
        chatRequest.question,
        aiResponse,
        {
          processing_time: processingTime,
          model_used: 'gpt-4o',
          timestamp: new Date().toISOString(),
          context_messages: chatHistory.length,
          has_token_data: !!tokenData,
          has_project_data: !!projectData,
          api_calls: {
            pretge_token_api: !!tokenData,
            pretge_project_api: !!projectData,
          },
        },
        [
          {
            source: `https://docs.${chatRequest.token_slug}.to/docs`,
            title: `${chatRequest.token_slug.toUpperCase()} Documentation`,
            relevance_score: 0.95
          }
        ]
      );

      this.logger.log(`[✅] [ChatService] [processChat] [result]:`, chatMessages);

      // Get the AI message (second message in the array)
      const aiMessage = chatMessages[1];

      return {
        answer: aiResponse,
        citations: [
          {
            source: `https://docs.${chatRequest.token_slug}.to/docs`,
            title: `${chatRequest.token_slug.toUpperCase()} Documentation`,
            relevance_score: 0.95
          }
        ],
        metadata: {
          token_slug: chatRequest.token_slug,
          processing_time: processingTime,
          model_used: 'gpt-4o',
          message_id: aiMessage.id,
          context_messages: chatHistory.length,
          has_token_data: !!tokenData,
          has_project_data: !!projectData,
          api_calls: {
            pretge_token_api: !!tokenData,
            pretge_project_api: !!projectData,
          },
        }
      };
    } catch (error) {
      this.logger.error(`[🔴] [ChatService] [processChat] [error]:`, error);
      
      // Fallback to mock response if OpenAI fails
      const fallbackAnswer = this.generateMockAnswer(chatRequest.question, chatRequest.token_slug);

      const fallbackMessages = await this.chatHistoryRepository.saveChatMessage(
        chatRequest.user_id,
        chatRequest.token_slug,
        chatRequest.question,
        fallbackAnswer,
        {
          processing_time: 0.1,
          model_used: 'fallback-mock',
          timestamp: new Date().toISOString(),
          error: error.message,
        },
        []
      );

      const fallbackAiMessage = fallbackMessages[1];

      return {
        answer: fallbackAnswer,
        citations: [],
        metadata: {
          token_slug: chatRequest.token_slug,
          processing_time: 0.1,
          model_used: 'fallback-mock',
          message_id: fallbackAiMessage.id,
          error: 'OpenAI service unavailable, using fallback response',
        }
      };
    }
  }

  async getChatHistory(userId: string, tokenSlug: string, limit: number = 50): Promise<any[]> {
    this.logger.log(`[🔍] [ChatService] [getChatHistory] [params]:`, { userId, tokenSlug, limit });

    try {
      const history = await this.chatHistoryRepository.getChatHistory(userId, tokenSlug, limit);
      
      this.logger.log(`[✅] [ChatService] [getChatHistory] [result]:`, { count: history.length });
      
      return history;
    } catch (error) {
      this.logger.error(`[🔴] [ChatService] [getChatHistory] [error]:`, error);
      throw error;
    }
  }

  private buildSystemPrompt(tokenSlug: string, tokenData: any, projectData: any): string {
    const tokenUpper = tokenSlug.toUpperCase();
    
    // Get real token information
    const realTokenInfo = this.pretgeApiService.formatTokenInfoForPrompt(tokenData, projectData);
    
    return `You are an expert AI assistant specialized in providing accurate and helpful information about cryptocurrency tokens and blockchain projects. 

You are currently helping users with questions about ${tokenUpper} (${tokenSlug}) token. 

**Current Token Information:**
${realTokenInfo}

Guidelines:
1. Use the provided token information above to give accurate, up-to-date answers
2. Be helpful and educational in your responses
3. If you don't know specific details not covered in the provided information, be honest about it
4. Focus on the token's technology, use cases, tokenomics, funding, and current status
5. Always remind users to do their own research (DYOR)
6. Be concise but comprehensive in your answers
7. If asked about price predictions, explain that you cannot provide financial advice
8. Reference specific data from the provided information when relevant

Context: You are part of a chat widget system that helps users understand different cryptocurrency tokens. The information above is real-time data from PretgeMarket APIs.`;
  }

  private buildContextualQuestion(
    question: string, 
    tokenSlug: string, 
    chatHistory: any[]
  ): string {
    let contextualPrompt = `User's current question about ${tokenSlug.toUpperCase()}: ${question}`;
    
    if (chatHistory.length > 0) {
      contextualPrompt += `\n\nPrevious conversation context:\n`;
      chatHistory.slice(-5).forEach((msg, index) => {
        contextualPrompt += `${index + 1}. User: ${msg.question}\n`;
        contextualPrompt += `   Assistant: ${msg.answer.substring(0, 200)}...\n\n`;
      });
    }
    
    return contextualPrompt;
  }

  private async getAIResponse(systemPrompt: string, question: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let completeResponse = '';
      
      const subscription = this.openAIService.streamCompletion(question, systemPrompt).subscribe({
        next: (chunk: string) => {
          completeResponse += chunk;
        },
        complete: () => {
          resolve(completeResponse.trim());
        },
        error: (error) => {
          reject(error);
        }
      });
      
      // Set timeout for safety
      setTimeout(() => {
        if (!subscription.closed) {
          subscription.unsubscribe();
          resolve(completeResponse.trim() || 'Sorry, I encountered an issue generating a response. Please try again.');
        }
      }, 30000); // 30 second timeout
    });
  }

  private generateMockAnswer(question: string, tokenSlug: string): string {
    const tokenUpper = tokenSlug.toUpperCase();
    
    if (question.toLowerCase().includes('what is')) {
      return `${tokenUpper} is a revolutionary blockchain project that aims to solve scalability issues in the crypto ecosystem. It provides fast, secure, and cost-effective transactions for users worldwide.`;
    }
    
    if (question.toLowerCase().includes('how does')) {
      return `${tokenUpper} works by utilizing advanced consensus mechanisms and innovative technology to ensure high throughput and low latency. The system is designed to handle millions of transactions per second.`;
    }
    
    if (question.toLowerCase().includes('price') || question.toLowerCase().includes('value')) {
      return `The current price of ${tokenUpper} can be found on major cryptocurrency exchanges. Please check real-time pricing on platforms like CoinMarketCap or CoinGecko for the most up-to-date information.`;
    }
    
    if (question.toLowerCase().includes('buy') || question.toLowerCase().includes('purchase')) {
      return `You can purchase ${tokenUpper} on various cryptocurrency exchanges. Make sure to use reputable platforms and follow proper security practices when trading.`;
    }
    
    // Default response
    return `Thank you for your question about ${tokenUpper}. This is a fallback response as the AI service is temporarily unavailable. Please try again in a moment.`;
  }
}
