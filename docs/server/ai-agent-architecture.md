# AI Agent Architecture

Tài liệu chi tiết về kiến trúc AI Agent trong Startkit Platform Agent.

## 🏗️ Tổng quan kiến trúc

```
AI Agent Architecture
├── Input Layer
│   ├── Chat Input (sessionId, message)
│   ├── WebSocket Events
│   └── API Endpoints
├── Processing Layer
│   ├── AI Agent Service
│   ├── Model Factory
│   ├── Tool Registry
│   └── Memory Service
├── AI Layer
│   ├── LangChain Integration
│   ├── Model Management
│   └── Chain Orchestration
└── Output Layer
    ├── Response Generation
    ├── Memory Persistence
    └── Real-time Updates
```

## 🔧 Core Components

### 1. AI Agent Service

Trung tâm xử lý chính của AI Agent:

```typescript
@Injectable()
export class AIAgentService {
  constructor(
    private readonly modelFactory: ModelFactory,
    private readonly toolRegistry: ToolRegistry,
    private readonly memoryService: MemoryService,
    private readonly logger: Logger
  ) {}

  async processMessage(sessionId: string, message: string): Promise<string> {
    try {
      this.logger.log(`[✅] [AIAgentService] [processMessage] [input]:`, { sessionId, message });

      // 1. Get model configuration
      const modelConfig = await this.getModelConfig(sessionId);
      
      // 2. Create model instance
      const model = this.modelFactory.createModel(modelConfig);
      
      // 3. Get available tools
      const tools = this.toolRegistry.getAllTools();
      
      // 4. Load conversation memory
      const memory = await this.memoryService.getMemory(sessionId);
      
      // 5. Create conversation chain
      const chain = new ConversationChain({
        llm: model,
        memory: memory,
        tools: tools,
      });

      // 6. Process message
      const response = await chain.call({ input: message });
      
      // 7. Save updated memory
      await this.memoryService.saveMemory(sessionId, memory);
      
      this.logger.log(`[✅] [AIAgentService] [processMessage] [response]:`, response);
      
      return response.response;
    } catch (error) {
      this.logger.error(`[🔴] [AIAgentService] [processMessage] [error]:`, error);
      throw error;
    }
  }
}
```

### 2. Model Factory

Quản lý và tạo các AI models khác nhau:

```typescript
@Injectable()
export class ModelFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  createModel(config: ModelConfig): BaseLanguageModel {
    try {
      switch (config.type) {
        case 'openai':
          return new ChatOpenAI({
            modelName: config.modelName || 'gpt-3.5-turbo',
            temperature: config.temperature || 0.7,
            apiKey: this.configService.get('OPENAI_API_KEY'),
            maxTokens: config.maxTokens || 1000,
          });
          
        case 'anthropic':
          return new ChatAnthropic({
            modelName: config.modelName || 'claude-3-sonnet-20240229',
            temperature: config.temperature || 0.7,
            apiKey: this.configService.get('ANTHROPIC_API_KEY'),
            maxTokens: config.maxTokens || 1000,
          });
          
        case 'deepseek':
          return new ChatDeepSeek({
            modelName: config.modelName || 'deepseek-chat',
            temperature: config.temperature || 0.7,
            apiKey: this.configService.get('DEEPSEEK_API_KEY'),
            maxTokens: config.maxTokens || 1000,
          });
          
        default:
          throw new Error(`Unsupported model type: ${config.type}`);
      }
    } catch (error) {
      this.logger.error(`[🔴] [ModelFactory] [createModel] [error]:`, error);
      throw error;
    }
  }
}
```

### 3. Tool Registry

Quản lý và đăng ký các tools/MCP:

```typescript
@Injectable()
export class ToolRegistry {
  private tools = new Map<string, ITool>();

  constructor(private readonly logger: Logger) {}

  registerTool(tool: ITool): void {
    try {
      this.tools.set(tool.name, tool);
      this.logger.log(`[✅] [ToolRegistry] [registerTool] [tool]:`, tool.name);
    } catch (error) {
      this.logger.error(`[🔴] [ToolRegistry] [registerTool] [error]:`, error);
      throw error;
    }
  }

  getTool(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }

  removeTool(name: string): boolean {
    return this.tools.delete(name);
  }

  getToolCount(): number {
    return this.tools.size;
  }
}
```

### 4. Memory Service

Quản lý bộ nhớ conversation với PostgreSQL:

```typescript
@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(ChatMemory)
    private readonly memoryRepository: Repository<ChatMemory>,
    private readonly logger: Logger
  ) {}

  async getMemory(sessionId: string): Promise<BufferMemory> {
    try {
      const memoryData = await this.memoryRepository.findOne({
        where: { sessionId }
      });

      if (!memoryData) {
        return new BufferMemory({
          returnMessages: true,
        });
      }

      return new BufferMemory({
        chatHistory: JSON.parse(memoryData.history),
        returnMessages: true,
      });
    } catch (error) {
      this.logger.error(`[🔴] [MemoryService] [getMemory] [error]:`, error);
      throw error;
    }
  }

  async saveMemory(sessionId: string, memory: BufferMemory): Promise<void> {
    try {
      const history = await memory.chatHistory.getMessages();
      
      await this.memoryRepository.save({
        sessionId,
        history: JSON.stringify(history),
        updatedAt: new Date(),
      });
      
      this.logger.log(`[✅] [MemoryService] [saveMemory] [sessionId]:`, sessionId);
    } catch (error) {
      this.logger.error(`[🔴] [MemoryService] [saveMemory] [error]:`, error);
      throw error;
    }
  }

  async clearMemory(sessionId: string): Promise<void> {
    try {
      await this.memoryRepository.delete({ sessionId });
      this.logger.log(`[✅] [MemoryService] [clearMemory] [sessionId]:`, sessionId);
    } catch (error) {
      this.logger.error(`[🔴] [MemoryService] [clearMemory] [error]:`, error);
      throw error;
    }
  }
}
```

## 🔄 Data Flow

### 1. Message Processing Flow

```
User Input → WebSocket/API → AI Agent Service → Model Factory → LangChain → Response
     ↓
Memory Service ← Tool Registry ← Model Instance ← Chain Execution
```

### 2. Tool Execution Flow

```
AI Request → Tool Registry → Tool Selection → Tool Execution → Result → AI Response
```

### 3. Memory Management Flow

```
Session Start → Load Memory → Process Message → Update Memory → Save Memory
```

## 📊 Performance Optimization

### 1. Model Caching

```typescript
@Injectable()
export class ModelCacheService {
  private modelCache = new Map<string, BaseLanguageModel>();

  getCachedModel(config: ModelConfig): BaseLanguageModel | null {
    const cacheKey = this.generateCacheKey(config);
    return this.modelCache.get(cacheKey) || null;
  }

  cacheModel(config: ModelConfig, model: BaseLanguageModel): void {
    const cacheKey = this.generateCacheKey(config);
    this.modelCache.set(cacheKey, model);
  }

  private generateCacheKey(config: ModelConfig): string {
    return `${config.type}-${config.modelName}-${config.temperature}`;
  }
}
```

### 2. Tool Performance Monitoring

```typescript
@Injectable()
export class ToolPerformanceService {
  private performanceMetrics = new Map<string, ToolMetrics>();

  recordToolExecution(toolName: string, executionTime: number, success: boolean): void {
    const metrics = this.performanceMetrics.get(toolName) || {
      totalExecutions: 0,
      successfulExecutions: 0,
      totalExecutionTime: 0,
      averageExecutionTime: 0,
    };

    metrics.totalExecutions++;
    metrics.totalExecutionTime += executionTime;
    metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.totalExecutions;

    if (success) {
      metrics.successfulExecutions++;
    }

    this.performanceMetrics.set(toolName, metrics);
  }

  getToolMetrics(toolName: string): ToolMetrics | null {
    return this.performanceMetrics.get(toolName) || null;
  }
}
```

## 🔒 Security Considerations

### 1. Input Sanitization

```typescript
@Injectable()
export class InputSanitizationService {
  sanitizeInput(input: string): string {
    // Remove potentially harmful content
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  validateModelAccess(modelType: string, userRole: string): boolean {
    const allowedModels = this.getAllowedModels(userRole);
    return allowedModels.includes(modelType);
  }
}
```

### 2. Rate Limiting

```typescript
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
@Post('chat')
async chat(@Body() chatMessageDto: ChatMessageDto): Promise<ChatResponseDto> {
  return this.aiAgentService.processMessage(
    chatMessageDto.sessionId,
    chatMessageDto.message
  );
}
```

## 🧪 Testing Strategy

### 1. Unit Testing

```typescript
describe('AIAgentService', () => {
  let service: AIAgentService;
  let modelFactory: ModelFactory;
  let toolRegistry: ToolRegistry;
  let memoryService: MemoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AIAgentService,
        {
          provide: ModelFactory,
          useValue: {
            createModel: jest.fn(),
          },
        },
        {
          provide: ToolRegistry,
          useValue: {
            getAllTools: jest.fn(),
          },
        },
        {
          provide: MemoryService,
          useValue: {
            getMemory: jest.fn(),
            saveMemory: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AIAgentService>(AIAgentService);
    modelFactory = module.get<ModelFactory>(ModelFactory);
    toolRegistry = module.get<ToolRegistry>(ToolRegistry);
    memoryService = module.get<MemoryService>(MemoryService);
  });

  it('should process message successfully', async () => {
    const sessionId = 'test-session';
    const message = 'Hello AI';
    const mockResponse = 'Hello! How can I help you?';

    jest.spyOn(modelFactory, 'createModel').mockReturnValue({
      call: jest.fn().mockResolvedValue({ response: mockResponse }),
    } as any);

    jest.spyOn(toolRegistry, 'getAllTools').mockReturnValue([]);
    jest.spyOn(memoryService, 'getMemory').mockResolvedValue({} as any);

    const result = await service.processMessage(sessionId, message);

    expect(result).toBe(mockResponse);
  });
});
```

### 2. Integration Testing

```typescript
describe('AIAgentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ai-agent/chat (POST)', () => {
    return request(app.getHttpServer())
      .post('/ai-agent/chat')
      .send({ 
        sessionId: 'test-session',
        message: 'Hello AI' 
      })
      .expect(200);
  });
});
```

## 📈 Monitoring & Metrics

### 1. Performance Metrics

```typescript
@Injectable()
export class AIMetricsService {
  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    modelUsage: new Map<string, number>(),
    toolUsage: new Map<string, number>(),
  };

  recordRequest(success: boolean, responseTime: number, modelType?: string, toolsUsed?: string[]): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Update average response time
    const currentTotal = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1);
    this.metrics.averageResponseTime = (currentTotal + responseTime) / this.metrics.totalRequests;

    // Record model usage
    if (modelType) {
      const currentCount = this.metrics.modelUsage.get(modelType) || 0;
      this.metrics.modelUsage.set(modelType, currentCount + 1);
    }

    // Record tool usage
    if (toolsUsed) {
      toolsUsed.forEach(tool => {
        const currentCount = this.metrics.toolUsage.get(tool) || 0;
        this.metrics.toolUsage.set(tool, currentCount + 1);
      });
    }
  }

  getMetrics(): AIMetrics {
    return { ...this.metrics };
  }
}
```

### 2. Health Checks

```typescript
@Injectable()
export class AIHealthService {
  constructor(
    private readonly modelFactory: ModelFactory,
    private readonly toolRegistry: ToolRegistry,
    private readonly memoryService: MemoryService,
  ) {}

  async checkHealth(): Promise<HealthCheckResult> {
    const checks = {
      modelFactory: await this.checkModelFactory(),
      toolRegistry: await this.checkToolRegistry(),
      memoryService: await this.checkMemoryService(),
    };

    const isHealthy = Object.values(checks).every(check => check.status === 'up');

    return {
      status: isHealthy ? 'up' : 'down',
      checks,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkModelFactory(): Promise<HealthCheck> {
    try {
      // Test model creation
      const testConfig = { type: 'openai', modelName: 'gpt-3.5-turbo' };
      const model = this.modelFactory.createModel(testConfig);
      return { status: 'up', message: 'Model factory is working' };
    } catch (error) {
      return { status: 'down', message: `Model factory error: ${error.message}` };
    }
  }

  private async checkToolRegistry(): Promise<HealthCheck> {
    try {
      const toolCount = this.toolRegistry.getToolCount();
      return { status: 'up', message: `Tool registry has ${toolCount} tools` };
    } catch (error) {
      return { status: 'down', message: `Tool registry error: ${error.message}` };
    }
  }

  private async checkMemoryService(): Promise<HealthCheck> {
    try {
      // Test memory operations
      const testSessionId = 'health-check-session';
      const memory = await this.memoryService.getMemory(testSessionId);
      return { status: 'up', message: 'Memory service is working' };
    } catch (error) {
      return { status: 'down', message: `Memory service error: ${error.message}` };
    }
  }
}
```

## 🚀 Deployment Considerations

### 1. Environment Configuration

```env
# AI Models
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key

# Model Configuration
DEFAULT_MODEL_TYPE=openai
DEFAULT_MODEL_NAME=gpt-3.5-turbo
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=1000

# Performance
MODEL_CACHE_ENABLED=true
TOOL_CACHE_ENABLED=true
MEMORY_CACHE_TTL=3600

# Security
MAX_INPUT_LENGTH=1000
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60000
```

### 2. Docker Configuration

```dockerfile
# AI Agent Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "run", "start:prod"]
```

---

**AI Agent Architecture Team** - Startkit Platform Agent

*Last updated: [Current Date]* 