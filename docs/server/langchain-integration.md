# LangChain Integration

Tài liệu chi tiết về tích hợp LangChain trong Startkit Platform Agent.

## 🎯 Tổng quan

LangChain là framework chính để xây dựng AI Agent trong Startkit Platform Agent. Nó cung cấp:

- **Model Management** - Quản lý nhiều AI models
- **Chain Orchestration** - Tổ chức các chuỗi xử lý
- **Tool Integration** - Tích hợp tools và MCP
- **Memory Management** - Quản lý bộ nhớ conversation
- **Prompt Engineering** - Kỹ thuật thiết kế prompt

## 📦 Installation

### 1. Install Dependencies

```bash
# Install LangChain
npm install langchain

# Install specific model packages
npm install @langchain/openai
npm install @langchain/anthropic
npm install @langchain/deepseek

# Install additional tools
npm install @langchain/community
npm install @langchain/core
```

### 2. Environment Setup

```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# DeepSeek
DEEPSEEK_API_KEY=your-deepseek-api-key

# LangChain Configuration
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=your-langchain-api-key
LANGCHAIN_PROJECT=your-project-name
```

## 🔧 Core Integration

### 1. Model Integration

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatDeepSeek } from '@langchain/deepseek';

@Injectable()
export class LangChainService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  createOpenAIModel(config: ModelConfig): ChatOpenAI {
    return new ChatOpenAI({
      modelName: config.modelName || 'gpt-3.5-turbo',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1000,
      apiKey: this.configService.get('OPENAI_API_KEY'),
      streaming: config.streaming || false,
    });
  }

  createAnthropicModel(config: ModelConfig): ChatAnthropic {
    return new ChatAnthropic({
      modelName: config.modelName || 'claude-3-sonnet-20240229',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1000,
      apiKey: this.configService.get('ANTHROPIC_API_KEY'),
      streaming: config.streaming || false,
    });
  }

  createDeepSeekModel(config: ModelConfig): ChatDeepSeek {
    return new ChatDeepSeek({
      modelName: config.modelName || 'deepseek-chat',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1000,
      apiKey: this.configService.get('DEEPSEEK_API_KEY'),
      streaming: config.streaming || false,
    });
  }
}
```

### 2. Chain Creation

```typescript
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class ChainService {
  createConversationChain(
    model: BaseLanguageModel,
    memory: BufferMemory,
    tools: Tool[] = []
  ): ConversationChain {
    const prompt = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant. You have access to the following tools: {tools}
      
      Current conversation:
      {history}
      
      Human: {input}
      AI Assistant:
    `);

    return new ConversationChain({
      llm: model,
      memory: memory,
      tools: tools,
      prompt: prompt,
    });
  }

  createToolChain(
    model: BaseLanguageModel,
    tools: Tool[]
  ): AgentExecutor {
    const prompt = PromptTemplate.fromTemplate(`
      You are a helpful AI assistant with access to tools.
      
      Available tools: {tools}
      
      Use the tools when needed to help answer the user's question.
      
      Human: {input}
      AI Assistant:
    `);

    return AgentExecutor.fromAgentAndTools({
      agent: new OpenAIFunctionsAgent({
        llm: model,
        tools: tools,
        prompt: prompt,
      }),
      tools: tools,
      verbose: true,
    });
  }
}
```

### 3. Memory Integration

```typescript
import { BufferMemory } from 'langchain/memory';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

@Injectable()
export class MemoryService {
  async createMemory(sessionId: string): Promise<BufferMemory> {
    try {
      // Load existing memory from database
      const memoryData = await this.memoryRepository.findOne({
        where: { sessionId }
      });

      if (memoryData) {
        const chatHistory = new ChatMessageHistory();
        const messages = JSON.parse(memoryData.history);
        
        // Restore messages to chat history
        for (const message of messages) {
          if (message.type === 'human') {
            await chatHistory.addUserMessage(message.content);
          } else if (message.type === 'ai') {
            await chatHistory.addAIChatMessage(message.content);
          }
        }

        return new BufferMemory({
          chatHistory: chatHistory,
          returnMessages: true,
          memoryKey: 'history',
        });
      }

      // Create new memory
      return new BufferMemory({
        returnMessages: true,
        memoryKey: 'history',
      });
    } catch (error) {
      this.logger.error(`[🔴] [MemoryService] [createMemory] [error]:`, error);
      throw error;
    }
  }

  async saveMemory(sessionId: string, memory: BufferMemory): Promise<void> {
    try {
      const messages = await memory.chatHistory.getMessages();
      const serializedMessages = messages.map(msg => ({
        type: msg._getType(),
        content: msg.content,
      }));

      await this.memoryRepository.save({
        sessionId,
        history: JSON.stringify(serializedMessages),
        updatedAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`[🔴] [MemoryService] [saveMemory] [error]:`, error);
      throw error;
    }
  }
}
```

## 🛠️ Tool Integration

### 1. Custom Tool Creation

```typescript
import { Tool } from '@langchain/core/tools';

@Injectable()
export class DatabaseQueryTool extends Tool {
  name = 'database_query';
  description = 'Query the database for information';

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: Logger
  ) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      this.logger.log(`[✅] [DatabaseQueryTool] [_call] [input]:`, input);
      
      // Parse input to extract query
      const query = this.parseQuery(input);
      
      // Execute database query
      const result = await this.databaseService.query(query);
      
      this.logger.log(`[✅] [DatabaseQueryTool] [_call] [result]:`, result);
      
      return JSON.stringify(result);
    } catch (error) {
      this.logger.error(`[🔴] [DatabaseQueryTool] [_call] [error]:`, error);
      throw error;
    }
  }

  private parseQuery(input: string): string {
    // Extract SQL query from input
    const sqlMatch = input.match(/SELECT.*FROM.*/i);
    return sqlMatch ? sqlMatch[0] : input;
  }
}
```

### 2. Web Search Tool

```typescript
@Injectable()
export class WebSearchTool extends Tool {
  name = 'web_search';
  description = 'Search the web for current information';

  constructor(
    private readonly searchService: SearchService,
    private readonly logger: Logger
  ) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      this.logger.log(`[✅] [WebSearchTool] [_call] [input]:`, input);
      
      const searchResults = await this.searchService.search(input);
      
      this.logger.log(`[✅] [WebSearchTool] [_call] [results]:`, searchResults);
      
      return JSON.stringify(searchResults);
    } catch (error) {
      this.logger.error(`[🔴] [WebSearchTool] [_call] [error]:`, error);
      throw error;
    }
  }
}
```

### 3. File Reader Tool

```typescript
@Injectable()
export class FileReaderTool extends Tool {
  name = 'file_reader';
  description = 'Read content from files';

  constructor(
    private readonly fileService: FileService,
    private readonly logger: Logger
  ) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      this.logger.log(`[✅] [FileReaderTool] [_call] [input]:`, input);
      
      const filePath = this.extractFilePath(input);
      const content = await this.fileService.readFile(filePath);
      
      this.logger.log(`[✅] [FileReaderTool] [_call] [content]:`, content);
      
      return content;
    } catch (error) {
      this.logger.error(`[🔴] [FileReaderTool] [_call] [error]:`, error);
      throw error;
    }
  }

  private extractFilePath(input: string): string {
    // Extract file path from input
    const pathMatch = input.match(/\/[\w\/\-\.]+/);
    return pathMatch ? pathMatch[0] : input;
  }
}
```

## 🔄 Chain Orchestration

### 1. Sequential Chain

```typescript
import { SequentialChain } from 'langchain/chains';

@Injectable()
export class ChainOrchestrator {
  createSequentialChain(
    model: BaseLanguageModel,
    tools: Tool[]
  ): SequentialChain {
    const chains = [
      // Analysis chain
      new LLMChain({
        llm: model,
        prompt: PromptTemplate.fromTemplate(`
          Analyze the following input and determine what tools are needed:
          {input}
          
          Required tools:
        `),
        outputKey: 'analysis',
      }),
      
      // Tool execution chain
      new LLMChain({
        llm: model,
        prompt: PromptTemplate.fromTemplate(`
          Based on the analysis: {analysis}
          Execute the required tools and provide a response.
          
          Available tools: {tools}
          Input: {input}
        `),
        outputKey: 'response',
      }),
    ];

    return new SequentialChain({
      chains: chains,
      inputVariables: ['input', 'tools'],
      outputVariables: ['analysis', 'response'],
    });
  }
}
```

### 2. Router Chain

```typescript
import { RouterChain } from 'langchain/chains';

@Injectable()
export class RouterService {
  createRouterChain(
    model: BaseLanguageModel,
    routes: Map<string, BaseChain>
  ): RouterChain {
    const prompt = PromptTemplate.fromTemplate(`
      Based on the input, determine which route to take:
      
      Available routes:
      - database: For database queries
      - web_search: For web searches
      - file_reader: For file operations
      - general: For general conversation
      
      Input: {input}
      
      Route:
    `);

    return new RouterChain({
      llm: model,
      prompt: prompt,
      routes: routes,
    });
  }
}
```

## 📊 Monitoring & Tracing

### 1. LangChain Tracing

```typescript
import { Client } from 'langsmith';

@Injectable()
export class TracingService {
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      apiKey: this.configService.get('LANGCHAIN_API_KEY'),
      apiUrl: this.configService.get('LANGCHAIN_ENDPOINT'),
    });
  }

  async traceChain(
    chainName: string,
    input: any,
    output: any,
    metadata?: any
  ): Promise<void> {
    try {
      await this.client.createRun({
        name: chainName,
        inputs: input,
        outputs: output,
        metadata: metadata,
      });
    } catch (error) {
      this.logger.error(`[🔴] [TracingService] [traceChain] [error]:`, error);
    }
  }
}
```

### 2. Performance Monitoring

```typescript
@Injectable()
export class PerformanceMonitor {
  private metrics = new Map<string, ChainMetrics>();

  recordChainExecution(
    chainName: string,
    executionTime: number,
    success: boolean,
    inputTokens?: number,
    outputTokens?: number
  ): void {
    const metrics = this.metrics.get(chainName) || {
      totalExecutions: 0,
      successfulExecutions: 0,
      totalExecutionTime: 0,
      averageExecutionTime: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
    };

    metrics.totalExecutions++;
    metrics.totalExecutionTime += executionTime;
    metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalExecutions;

    if (success) {
      metrics.successfulExecutions++;
    }

    if (inputTokens) {
      metrics.totalInputTokens += inputTokens;
    }

    if (outputTokens) {
      metrics.totalOutputTokens += outputTokens;
    }

    this.metrics.set(chainName, metrics);
  }

  getMetrics(chainName: string): ChainMetrics | null {
    return this.metrics.get(chainName) || null;
  }
}
```

## 🧪 Testing

### 1. Unit Testing

```typescript
describe('LangChainService', () => {
  let service: LangChainService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LangChainService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LangChainService>(LangChainService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should create OpenAI model', () => {
    const config = { modelName: 'gpt-3.5-turbo', temperature: 0.7 };
    jest.spyOn(configService, 'get').mockReturnValue('test-api-key');

    const model = service.createOpenAIModel(config);

    expect(model).toBeInstanceOf(ChatOpenAI);
    expect(model.modelName).toBe('gpt-3.5-turbo');
  });
});
```

### 2. Integration Testing

```typescript
describe('Chain Integration', () => {
  let chainService: ChainService;
  let memoryService: MemoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChainService,
        MemoryService,
        {
          provide: getRepositoryToken(ChatMemory),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    chainService = module.get<ChainService>(ChainService);
    memoryService = module.get<MemoryService>(MemoryService);
  });

  it('should create conversation chain', async () => {
    const model = new ChatOpenAI({ temperature: 0 });
    const memory = await memoryService.createMemory('test-session');
    const tools = [];

    const chain = chainService.createConversationChain(model, memory, tools);

    expect(chain).toBeInstanceOf(ConversationChain);
  });
});
```

## 🚀 Best Practices

### 1. Model Configuration

```typescript
// ✅ Good - Flexible model configuration
interface ModelConfig {
  type: 'openai' | 'anthropic' | 'deepseek';
  modelName: string;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
  systemPrompt?: string;
}

// ❌ Bad - Hard-coded configuration
const model = new ChatOpenAI({ temperature: 0.7 });
```

### 2. Error Handling

```typescript
// ✅ Good - Proper error handling
async processWithChain(chain: BaseChain, input: any): Promise<any> {
  try {
    const startTime = Date.now();
    const result = await chain.call(input);
    const executionTime = Date.now() - startTime;
    
    this.performanceMonitor.recordChainExecution(
      chain.constructor.name,
      executionTime,
      true
    );
    
    return result;
  } catch (error) {
    this.logger.error(`[🔴] [Chain processing error]:`, error);
    this.performanceMonitor.recordChainExecution(
      chain.constructor.name,
      0,
      false
    );
    throw error;
  }
}
```

### 3. Memory Management

```typescript
// ✅ Good - Proper memory cleanup
@Injectable()
export class MemoryManager {
  private memoryCache = new Map<string, BufferMemory>();

  async getMemory(sessionId: string): Promise<BufferMemory> {
    if (this.memoryCache.has(sessionId)) {
      return this.memoryCache.get(sessionId)!;
    }

    const memory = await this.memoryService.createMemory(sessionId);
    this.memoryCache.set(sessionId, memory);
    
    return memory;
  }

  async cleanupMemory(sessionId: string): Promise<void> {
    this.memoryCache.delete(sessionId);
    await this.memoryService.clearMemory(sessionId);
  }
}
```

## 📚 Resources

### Official Documentation
- [LangChain Documentation](https://python.langchain.com/)
- [LangChain JavaScript](https://js.langchain.com/)
- [LangSmith Platform](https://smith.langchain.com/)

### Community Resources
- [LangChain Discord](https://discord.gg/langchain)
- [LangChain GitHub](https://github.com/langchain-ai/langchain)
- [LangChain Blog](https://blog.langchain.dev/)

---

**LangChain Integration Team** - Startkit Platform Agent

*Last updated: [Current Date]* 