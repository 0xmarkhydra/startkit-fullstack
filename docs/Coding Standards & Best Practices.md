# Coding Standards & Best Practices

Tài liệu về coding standards, best practices và guidelines cho dự án **Startkit Platform Agent** - AI Agent platform với LangChain.

## 📁 Cấu trúc rules

```
rules/
├── README.md                    # Tài liệu chính (này)
├── index.mdc                    # Tổng quan coding standards
├── frontend.mdc                 # Frontend standards
├── ai-agent.mdc                 # AI Agent standards
├── langchain.mdc                # LangChain integration standards
└── backend/                     # Backend standards
    ├── common.mdc               # Common backend rules
    ├── nest.mdc                 # NestJS specific rules
    ├── startkit-patterns.mdc    # StartKit patterns
    ├── ai-agent-patterns.mdc    # AI Agent patterns
    ├── tool-development.mdc     # Tool development standards
    ├── model-factory.mdc        # Model factory standards
    ├── swagger-best-practices.mdc # Swagger guidelines
    ├── swagger-guide.mdc        # Swagger documentation
    └── swagger-implementation-checklist.mdc # Swagger checklist
```

## 🎯 Tổng quan

### Mục tiêu
- Đảm bảo code quality và consistency cho AI Agent platform
- Tăng productivity của development team
- Giảm bugs và technical debt
- Cải thiện maintainability cho AI components
- Tạo ra một platform dễ mở rộng cho cộng đồng

### Nguyên tắc chung
- **Readability** - Code dễ đọc và hiểu
- **Maintainability** - Code dễ bảo trì và mở rộng
- **Performance** - Code hiệu quả và tối ưu
- **Security** - Code an toàn và bảo mật
- **Testing** - Code có test coverage đầy đủ
- **Modularity** - AI components có thể plug-and-play
- **Extensibility** - Dễ dàng thêm models và tools

## 🤖 AI Agent Standards

### LangChain Integration

#### Model Factory Pattern
```typescript
// ✅ ĐÚNG - Model factory với LangChain
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
            modelName: config.modelName,
            temperature: config.temperature,
            apiKey: this.configService.get('OPENAI_API_KEY'),
          });
        case 'anthropic':
          return new ChatAnthropic({
            modelName: config.modelName,
            temperature: config.temperature,
            apiKey: this.configService.get('ANTHROPIC_API_KEY'),
          });
        case 'deepseek':
          return new ChatDeepSeek({
            modelName: config.modelName,
            temperature: config.temperature,
            apiKey: this.configService.get('DEEPSEEK_API_KEY'),
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

// ❌ SAI - Hard-coded model
const model = new ChatOpenAI();
```

#### Tool Registry Pattern
```typescript
// ✅ ĐÚNG - Tool registry với interface
export interface ITool {
  name: string;
  description: string;
  execute(input: any): Promise<any>;
}

@Injectable()
export class ToolRegistry {
  private tools = new Map<string, ITool>();

  registerTool(tool: ITool): void {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }
}

// ❌ SAI - Hard-coded tools
const tools = [tool1, tool2, tool3];
```

#### AI Agent Service
```typescript
// ✅ ĐÚNG - AI Agent service với LangChain
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

      // Get model
      const model = this.modelFactory.createModel(this.getModelConfig());
      
      // Get tools
      const tools = this.toolRegistry.getAllTools();
      
      // Get memory
      const memory = await this.memoryService.getMemory(sessionId);
      
      // Create chain
      const chain = new ConversationChain({
        llm: model,
        memory: memory,
        tools: tools,
      });

      // Process message
      const response = await chain.call({ input: message });
      
      this.logger.log(`[✅] [AIAgentService] [processMessage] [response]:`, response);
      
      return response.response;
    } catch (error) {
      this.logger.error(`[🔴] [AIAgentService] [processMessage] [error]:`, error);
      throw error;
    }
  }
}

// ❌ SAI - Simple function
async function processMessage(message: string) {
  return model.generate(message);
}
```

### Tool Development Standards

#### Tool Interface
```typescript
// ✅ ĐÚNG - Standard tool interface
export abstract class BaseTool implements ITool {
  abstract name: string;
  abstract description: string;
  abstract execute(input: any): Promise<any>;

  // Common validation
  protected validateInput(input: any): void {
    if (!input) {
      throw new Error('Input is required');
    }
  }

  // Common error handling
  protected handleError(error: any): never {
    this.logger.error(`[🔴] [${this.name}] [execute] [error]:`, error);
    throw error;
  }
}

// ❌ SAI - No interface
class CustomTool {
  execute(input: any) {
    // No validation, no error handling
  }
}
```

#### Tool Implementation
```typescript
// ✅ ĐÚNG - Proper tool implementation
@Injectable()
export class DatabaseQueryTool extends BaseTool {
  name = 'database-query';
  description = 'Query database for information';

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: Logger
  ) {
    super();
  }

  async execute(input: { query: string; table?: string }): Promise<any> {
    try {
      this.validateInput(input);
      
      this.logger.log(`[✅] [DatabaseQueryTool] [execute] [input]:`, input);
      
      const result = await this.databaseService.query(input.query, input.table);
      
      this.logger.log(`[✅] [DatabaseQueryTool] [execute] [result]:`, result);
      
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// ❌ SAI - Poor implementation
class DatabaseTool {
  async execute(input: any) {
    return this.db.query(input);
  }
}
```

### Memory Management

#### Memory Service
```typescript
// ✅ ĐÚNG - Memory service với PostgreSQL
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
        return new BufferMemory();
      }

      return new BufferMemory({
        chatHistory: memoryData.history,
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
    } catch (error) {
      this.logger.error(`[🔴] [MemoryService] [saveMemory] [error]:`, error);
      throw error;
    }
  }
}

// ❌ SAI - No memory management
const memory = new BufferMemory();
```

## 📋 Coding Standards

### Naming Conventions

#### AI Agent Components
```typescript
// ✅ Good
class OpenAIModel { }
class DatabaseQueryTool { }
class ChatMemoryService { }
interface ModelConfig { }
type ToolType = 'database' | 'web' | 'file'

// ❌ Bad
class openaiModel { }
class databaseQueryTool { }
class chatMemoryService { }
interface modelConfig { }
type toolType = 'database' | 'web' | 'file'
```

#### Variables & Functions
```typescript
// ✅ Good
const modelConfig = { type: 'openai', temperature: 0.7 }
const isModelReady = true
const createModelInstance = (config: ModelConfig) => { }

// ❌ Bad
const model_config = { type: 'openai', temperature: 0.7 }
const is_model_ready = true
const create_model_instance = (config: ModelConfig) => { }
```

#### Files & Folders
```
// ✅ Good
ai-agent.service.ts
model-factory.service.ts
tool-registry.service.ts
memory.service.ts

// ❌ Bad
aiAgentService.ts
modelFactoryService.ts
toolRegistryService.ts
memoryService.ts
```

### Code Formatting

#### Indentation
- Sử dụng 2 spaces cho indentation
- Không sử dụng tabs

#### Line Length
- Giới hạn 80-100 characters per line
- Wrap long lines appropriately

#### Spacing
```typescript
// ✅ Good
async function processMessage(sessionId: string, message: string): Promise<string> {
  const model = this.modelFactory.createModel(config)
  const response = await model.generate(message)
  return response
}

// ❌ Bad
async function processMessage(sessionId:string,message:string):Promise<string>{
  const model=this.modelFactory.createModel(config)
  const response=await model.generate(message)
  return response
}
```

### Comments & Documentation

#### JSDoc Comments cho AI Components
```typescript
/**
 * AI Agent service for processing chat messages
 * @param sessionId - Unique session identifier
 * @param message - User input message
 * @returns AI generated response
 */
async processMessage(sessionId: string, message: string): Promise<string> {
  // Implementation
}

/**
 * Tool for querying database
 * @implements {ITool}
 */
export class DatabaseQueryTool implements ITool {
  /**
   * Execute database query
   * @param input - Query parameters
   * @returns Query results
   */
  async execute(input: { query: string; table?: string }): Promise<any> {
    // Implementation
  }
}
```

#### Inline Comments
```typescript
// ✅ Good - Explain AI logic
const model = this.modelFactory.createModel(config) // Create model based on config
const tools = this.toolRegistry.getAllTools() // Get all registered tools
const memory = await this.memoryService.getMemory(sessionId) // Load conversation history

// ❌ Bad - Obvious comments
const model = this.modelFactory.createModel(config) // Create model
const tools = this.toolRegistry.getAllTools() // Get tools
const memory = await this.memoryService.getMemory(sessionId) // Get memory
```

## 🔧 Backend Standards

### NestJS Patterns

#### AI Module Structure
```typescript
// ✅ Good - AI module organization
@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMemory]),
    ConfigModule,
  ],
  controllers: [AIAgentController],
  providers: [
    AIAgentService,
    ModelFactory,
    ToolRegistry,
    MemoryService,
  ],
  exports: [AIAgentService],
})
export class AIModule {}
```

#### AI Service Patterns
```typescript
// ✅ Good - AI service with proper dependencies
@Injectable()
export class AIAgentService {
  constructor(
    private readonly modelFactory: ModelFactory,
    private readonly toolRegistry: ToolRegistry,
    private readonly memoryService: MemoryService,
    private readonly logger: Logger,
  ) {}

  async processMessage(sessionId: string, message: string): Promise<string> {
    // AI processing logic
  }
}
```

#### AI Controller Patterns
```typescript
// ✅ Good - Clean AI controller
@Controller('ai-agent')
@ApiTags('AI Agent')
export class AIAgentController {
  constructor(private readonly aiAgentService: AIAgentService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Process chat message with AI' })
  @ApiBody({ type: ChatMessageDto })
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async chat(@Body() chatMessageDto: ChatMessageDto): Promise<ChatResponseDto> {
    return this.aiAgentService.processMessage(
      chatMessageDto.sessionId,
      chatMessageDto.message
    );
  }
}
```

### Database Patterns

#### AI Entity Design
```typescript
// ✅ Good - AI-related entities
@Entity('chat_memories')
export class ChatMemory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sessionId: string;

  @Column('text')
  history: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('model_configs')
export class ModelConfig extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('json')
  config: object;

  @Column({ default: true })
  isActive: boolean;
}
```

#### AI Repository Pattern
```typescript
// ✅ Good - AI repository abstraction
@Injectable()
export class ChatMemoryRepository {
  constructor(
    @InjectRepository(ChatMemory)
    private readonly memoryRepository: Repository<ChatMemory>,
  ) {}

  async findBySessionId(sessionId: string): Promise<ChatMemory | null> {
    return this.memoryRepository.findOne({ where: { sessionId } });
  }

  async saveMemory(memory: ChatMemory): Promise<ChatMemory> {
    return this.memoryRepository.save(memory);
  }
}
```

### API Design

#### AI RESTful Endpoints
```typescript
// ✅ Good - AI RESTful design
@Controller('ai-agent')
export class AIAgentController {
  @Post('chat')           // POST /ai-agent/chat
  @Get('models')          // GET /ai-agent/models
  @Post('tools')          // POST /ai-agent/tools
  @Get('tools')           // GET /ai-agent/tools
  @Post('memory')         // POST /ai-agent/memory
  @Get('memory/:sessionId') // GET /ai-agent/memory/:sessionId
}
```

#### AI Response Format
```typescript
// ✅ Good - AI response format
{
  "statusCode": 200,
  "message": "AI response generated successfully",
  "data": {
    "response": "AI generated response",
    "sessionId": "uuid",
    "modelUsed": "gpt-4",
    "toolsUsed": ["database-query"],
    "processingTime": 1.5
  },
  "timestamp": "2023-06-15T10:30:00Z"
}
```

## 🎨 Frontend Standards

### React Patterns

#### AI Chat Component
```typescript
// ✅ Good - AI chat component
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  toolsUsed?: string[];
}

interface ChatWindowProps {
  sessionId: string;
  onMessageSend: (message: string) => Promise<void>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  sessionId, 
  onMessageSend 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        content,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to AI
      await onMessageSend(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};
```

#### AI State Management
```typescript
// ✅ Good - AI state management
interface AIState {
  sessionId: string | null;
  isConnected: boolean;
  modelConfig: ModelConfig | null;
  availableTools: Tool[];
  sendMessage: (message: string) => Promise<void>;
  setModel: (config: ModelConfig) => void;
  addTool: (tool: Tool) => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  sessionId: null,
  isConnected: false,
  modelConfig: null,
  availableTools: [],
  
  sendMessage: async (message: string) => {
    const { sessionId } = get();
    if (!sessionId) throw new Error('No active session');
    
    try {
      const response = await aiService.chat(sessionId, message);
      // Handle response
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },
  
  setModel: (config: ModelConfig) => {
    set({ modelConfig: config });
  },
  
  addTool: (tool: Tool) => {
    set(state => ({
      availableTools: [...state.availableTools, tool]
    }));
  },
}));
```

### Styling Standards

#### AI Chat Styling
```typescript
// ✅ Good - AI chat styling
@layer components {
  .chat-window {
    @apply flex flex-col h-full bg-gray-50;
  }
  
  .chat-messages {
    @apply flex-1 overflow-y-auto p-4 space-y-4;
  }
  
  .message {
    @apply flex gap-3;
  }
  
  .message-user {
    @apply justify-end;
  }
  
  .message-ai {
    @apply justify-start;
  }
  
  .message-bubble {
    @apply max-w-xs px-4 py-2 rounded-lg;
  }
  
  .message-bubble-user {
    @apply bg-blue-600 text-white;
  }
  
  .message-bubble-ai {
    @apply bg-white text-gray-900 border border-gray-200;
  }
  
  .chat-input {
    @apply border-t border-gray-200 p-4 bg-white;
  }
}
```

## 🔒 Security Standards

### AI Model Security
```typescript
// ✅ Good - AI model security
@Injectable()
export class ModelSecurityService {
  constructor(private readonly configService: ConfigService) {}

  validateApiKey(provider: string): boolean {
    const apiKey = this.configService.get(`${provider.toUpperCase()}_API_KEY`);
    return !!apiKey && apiKey.length > 0;
  }

  sanitizeInput(input: string): string {
    // Remove potentially harmful content
    return DOMPurify.sanitize(input);
  }

  validateModelAccess(modelType: string, userRole: string): boolean {
    const allowedModels = this.getAllowedModels(userRole);
    return allowedModels.includes(modelType);
  }
}

// ❌ Bad - No security
const model = new ChatOpenAI({ apiKey: 'hardcoded-key' });
```

### Input Validation cho AI
```typescript
// ✅ Good - AI input validation
export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsOptional()
  @IsString()
  modelType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];
}

// ❌ Bad - No validation
export class ChatMessageDto {
  message: string;
  sessionId: string;
}
```

### Rate Limiting cho AI
```typescript
// ✅ Good - AI rate limiting
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
@Post('chat')
async chat(@Body() chatMessageDto: ChatMessageDto): Promise<ChatResponseDto> {
  return this.aiAgentService.processMessage(
    chatMessageDto.sessionId,
    chatMessageDto.message
  );
}

// ❌ Bad - No rate limiting
@Post('chat')
async chat(@Body() dto: any) {
  return this.service.process(dto);
}
```

## 🧪 Testing Standards

### AI Agent Testing
```typescript
// ✅ Good - AI agent testing
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

  describe('processMessage', () => {
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
      expect(modelFactory.createModel).toHaveBeenCalled();
      expect(toolRegistry.getAllTools).toHaveBeenCalled();
      expect(memoryService.getMemory).toHaveBeenCalledWith(sessionId);
    });

    it('should handle errors gracefully', async () => {
      const sessionId = 'test-session';
      const message = 'Hello AI';

      jest.spyOn(modelFactory, 'createModel').mockImplementation(() => {
        throw new Error('Model creation failed');
      });

      await expect(service.processMessage(sessionId, message))
        .rejects.toThrow('Model creation failed');
    });
  });
});
```

### Tool Testing
```typescript
// ✅ Good - Tool testing
describe('DatabaseQueryTool', () => {
  let tool: DatabaseQueryTool;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DatabaseQueryTool,
        {
          provide: DatabaseService,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    tool = module.get<DatabaseQueryTool>(DatabaseQueryTool);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should execute database query successfully', async () => {
    const input = { query: 'SELECT * FROM users', table: 'users' };
    const expectedResult = [{ id: 1, name: 'John' }];

    jest.spyOn(databaseService, 'query').mockResolvedValue(expectedResult);

    const result = await tool.execute(input);

    expect(result).toEqual(expectedResult);
    expect(databaseService.query).toHaveBeenCalledWith(input.query, input.table);
  });

  it('should validate input', async () => {
    const input = null;

    await expect(tool.execute(input)).rejects.toThrow('Input is required');
  });
});
```

## 📊 Performance Standards

### AI Performance
- Model response time optimization
- Tool execution caching
- Memory usage optimization
- Batch processing for multiple requests
- Model switching based on performance

### Backend Performance
- Database query optimization
- Caching strategies
- Rate limiting
- Connection pooling

### Frontend Performance
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

### Monitoring
- AI model performance metrics
- Tool usage statistics
- Response time tracking
- Error rate monitoring
- User analytics

## 🔄 Git Workflow

### Branch Naming
```
feature/ai-agent-integration
feature/tool-registry
bugfix/model-factory-error
hotfix/security-patch
release/v1.0.0
```

### Commit Messages
```
feat: add OpenAI model integration
feat: implement tool registry system
fix: resolve memory service error
docs: update AI agent documentation
refactor: improve model factory
test: add AI agent unit tests
```

### Pull Request Standards
- Clear description
- Related issue reference
- Code review checklist
- Test coverage
- Documentation updates
- AI model testing results

## 📚 Documentation Standards

### AI Documentation
- Model configuration guides
- Tool development tutorials
- Memory system documentation
- Performance optimization guides
- Security best practices

### Code Documentation
- JSDoc comments for AI functions
- README files for AI modules
- API documentation with Swagger
- Architecture diagrams

### Commit Documentation
- Clear commit messages
- Issue references
- Breaking change notes
- Migration guides

## 🆘 Code Review Checklist

### AI Agent Review
- [ ] LangChain integration follows patterns
- [ ] Model factory implemented correctly
- [ ] Tool registry working properly
- [ ] Memory system functional
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Tests written and passing
- [ ] Documentation updated

### Backend Review
- [ ] Code follows NestJS patterns
- [ ] Proper error handling
- [ ] Input validation implemented
- [ ] Security measures in place
- [ ] Tests written and passing
- [ ] Documentation updated

### Frontend Review
- [ ] Component structure follows patterns
- [ ] State management implemented correctly
- [ ] Responsive design implemented
- [ ] Accessibility standards met
- [ ] Performance optimized
- [ ] Tests written and passing

### General Review
- [ ] Code is readable and maintainable
- [ ] Naming conventions followed
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Error handling implemented
- [ ] Logging added where appropriate
- [ ] AI components are modular
- [ ] Tools are properly abstracted

---

**Standards Team** - Startkit Platform Agent

*Last updated: [Current Date]* 