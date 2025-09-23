# Coding Standards & Best Practices

Tài liệu về coding standards, best practices và guidelines cho dự án Chat Widget Q&A for Token Project.

## 📁 Cấu trúc rules

```
docs/
├── README.md          # Tài liệu chính (này)
├── Coding Standards & Best Practices.md  # Tài liệu này
├── server/            # Server documentation
├── frontend/          # Widget documentation
├── landing/           # Landing page documentation
├── integration/       # Integration guides
├── ai-system/         # AI system documentation
└── deployment/        # Deployment guides
```

## 🎯 Tổng quan

### Mục tiêu
- Đảm bảo code quality và consistency cho hệ thống AI chatbot
- Tăng productivity của development team
- Giảm bugs và technical debt
- Cải thiện maintainability và scalability
- Đảm bảo performance cho real-time chat
- Tối ưu hóa AI processing và vector search

### Nguyên tắc chung
- **Readability** - Code dễ đọc và hiểu
- **Maintainability** - Code dễ bảo trì và mở rộng
- **Performance** - Code hiệu quả và tối ưu cho AI processing
- **Security** - Code an toàn và bảo mật cho chat data
- **Testing** - Code có test coverage đầy đủ
- **AI-First** - Thiết kế tối ưu cho AI/ML workflows
- **Real-time** - Đảm bảo performance cho WebSocket chat
- **Scalability** - Hỗ trợ nhiều token projects đồng thời

## 📋 Coding Standards

### Naming Conventions

#### Variables & Functions
```typescript
// ✅ Good
const userName = 'john'
const isAuthenticated = true
const getUserById = (id: string) => { }

// ❌ Bad
const user_name = 'john'
const is_authenticated = true
const get_user_by_id = (id: string) => { }
```

#### Classes & Interfaces
```typescript
// ✅ Good
class UserService { }
interface UserData { }
type UserStatus = 'active' | 'inactive'

// ❌ Bad
class userService { }
interface userData { }
type userStatus = 'active' | 'inactive'
```

#### Files & Folders
```
// ✅ Good
user-service.ts
user.controller.ts
user.entity.ts
user.dto.ts

// ❌ Bad
userService.ts
userController.ts
userEntity.ts
userDto.ts
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
function calculateTotal(items: Item[]): number {
  return items.reduce((total, item) => total + item.price, 0)
}

// ❌ Bad
function calculateTotal(items:Item[]):number{
  return items.reduce((total,item)=>total+item.price,0)
}
```

### Comments & Documentation

#### JSDoc Comments
```typescript
/**
 * Calculates the total price of items
 * @param items - Array of items to calculate
 * @returns Total price of all items
 */
function calculateTotal(items: Item[]): number {
  return items.reduce((total, item) => total + item.price, 0)
}
```

#### Inline Comments
```typescript
// ✅ Good - Explain why, not what
const result = items.filter(item => item.price > 100) // Only expensive items

// ❌ Bad - Obvious comments
const result = items.filter(item => item.price > 100) // Filter items by price
```

## 🔧 Backend Standards

### AI Processing Patterns

#### OpenAI Integration
```typescript
// ✅ Good - Proper OpenAI service structure
@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateAnswer(context: string, question: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for token project Q&A. 
                     Answer based only on the provided context.`
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nQuestion: ${question}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      return completion.choices[0].message.content
    } catch (error) {
      console.error(`[🔴] [OpenAIService] [generateAnswer] [error]:`, error)
      throw new Error('Failed to generate answer')
    }
  }
}

// ❌ Bad - No error handling
async generateAnswer(context: string, question: string): Promise<string> {
  const completion = await this.openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: question }]
  })
  return completion.choices[0].message.content
}
```

#### Vector Search Patterns
```typescript
// ✅ Good - Vector search service
@Injectable()
export class VectorSearchService {
  async searchSimilarChunks(
    query: string, 
    tokenSlug: string, 
    limit: number = 5
  ): Promise<Chunk[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query)
      
      // Search in vector database
      const results = await this.vectorDB.query({
        vector: queryEmbedding,
        filter: { tokenSlug },
        topK: limit,
        includeMetadata: true
      })

      return results.matches.map(match => ({
        id: match.id,
        content: match.metadata.content,
        source: match.metadata.source,
        score: match.score
      }))
    } catch (error) {
      console.error(`[🔴] [VectorSearchService] [searchSimilarChunks] [error]:`, error)
      throw new Error('Vector search failed')
    }
  }
}
```

#### Data Ingestion Patterns
```typescript
// ✅ Good - Data ingestion service
@Injectable()
export class DataIngestionService {
  async ingestTokenData(tokenSlug: string): Promise<void> {
    try {
      console.log(`[🔄] [DataIngestionService] [ingestTokenData] [tokenSlug]:`, tokenSlug)
      
      // 1. Fetch data from PretgeMarket API
      const tokenData = await this.pretgeApiService.getTokenData(tokenSlug)
      const projectData = await this.pretgeApiService.getProjectData(tokenSlug)
      
      // 2. Crawl official docs
      const docsData = await this.docsCrawlerService.crawlDocs(tokenData.docsUrl)
      
      // 3. Process and chunk data
      const chunks = await this.dataProcessorService.processData({
        tokenData,
        projectData,
        docsData
      })
      
      // 4. Generate embeddings and store
      await this.vectorStoreService.storeChunks(chunks, tokenSlug)
      
      console.log(`[✅] [DataIngestionService] [ingestTokenData] [success]`)
    } catch (error) {
      console.error(`[🔴] [DataIngestionService] [ingestTokenData] [error]:`, error)
      throw error
    }
  }
}
```

### NestJS Patterns

#### Module Structure
```typescript
// ✅ Good - Clear module organization
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
```

#### Service Patterns
```typescript
// ✅ Good - Single responsibility
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Business logic here
  }
}
```

#### Controller Patterns
```typescript
// ✅ Good - Clean controller
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto)
  }
}
```

### Database Patterns

#### Entity Design
```typescript
// ✅ Good - Proper entity structure
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

#### Repository Pattern
```typescript
// ✅ Good - Repository abstraction
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }
}
```

### API Design

#### RESTful Endpoints
```typescript
// ✅ Good - RESTful design
@Controller('users')
export class UserController {
  @Get()           // GET /users
  @Get(':id')      // GET /users/:id
  @Post()          // POST /users
  @Put(':id')      // PUT /users/:id
  @Delete(':id')   // DELETE /users/:id
}
```

#### Response Format
```typescript
// ✅ Good - Consistent response format
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "User created successfully"
}
```

## 🎨 Frontend Standards

### Chat Widget Patterns

#### Widget Component Structure
```typescript
// ✅ Good - Chat widget component
interface ChatWidgetProps {
  tokenSlug: string
  apiUrl: string
  theme?: 'light' | 'dark'
  onMessage?: (message: Message) => void
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  tokenSlug,
  apiUrl,
  theme = 'light',
  onMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenSlug,
          question: content
        })
      })
      
      const data = await response.json()
      const newMessage: Message = {
        id: Date.now().toString(),
        content: data.answer,
        sources: data.sources,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      onMessage?.(newMessage)
    } catch (error) {
      console.error(`[🔴] [ChatWidget] [sendMessage] [error]:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`chat-widget chat-widget--${theme}`}>
      {/* Widget UI */}
    </div>
  )
}

// ❌ Bad - No error handling
const sendMessage = async (content: string) => {
  const response = await fetch(`${apiUrl}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({ tokenSlug, question: content })
  })
  const data = await response.json()
  setMessages(prev => [...prev, data])
}
```

#### Streaming API Integration
```typescript
// ✅ Good - Streaming API hook for real-time chat
export const useChatStream = (tokenSlug: string, apiUrl: string) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')

  const sendMessage = async (content: string) => {
    try {
      setIsStreaming(true)
      setCurrentMessage('')

      const response = await fetch(`${apiUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenSlug,
          question: content,
          language: 'en'
        })
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            
            switch (data.type) {
              case 'content':
                setCurrentMessage(prev => prev + data.data)
                break
              case 'citations':
                // Add message with citations
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  content: currentMessage,
                  citations: data.data,
                  timestamp: new Date()
                }])
                setCurrentMessage('')
                break
              case 'done':
                setIsStreaming(false)
                break
              case 'error':
                console.error(`[🔴] [useChatStream] [error]:`, data.message)
                setIsStreaming(false)
                break
            }
          }
        }
      }
    } catch (error) {
      console.error(`[🔴] [useChatStream] [sendMessage] [error]:`, error)
      setIsStreaming(false)
    }
  }

  return { isStreaming, messages, currentMessage, sendMessage }
}
```

#### Widget State Management
```typescript
// ✅ Good - Zustand store for chat widget with history
interface ChatStore {
  messages: Message[]
  isLoading: boolean
  isOpen: boolean
  tokenSlug: string | null
  sessionId: string | null
  chatHistory: ChatHistoryItem[]
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
  toggleOpen: () => void
  setTokenSlug: (slug: string) => void
  setSessionId: (id: string) => void
  loadChatHistory: (history: ChatHistoryItem[]) => void
  clearMessages: () => void
  clearHistory: () => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  isOpen: false,
  tokenSlug: null,
  sessionId: null,
  chatHistory: [],

  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message] 
    })),

  setLoading: (loading) => 
    set({ isLoading: loading }),

  toggleOpen: () => 
    set((state) => ({ isOpen: !state.isOpen })),

  setTokenSlug: (slug) => 
    set({ tokenSlug: slug, messages: [], chatHistory: [] }),

  setSessionId: (id) => 
    set({ sessionId: id }),

  loadChatHistory: (history) => 
    set({ chatHistory: history, messages: history }),

  clearMessages: () => 
    set({ messages: [] }),

  clearHistory: async () => {
    const { sessionId, tokenSlug } = get()
    if (sessionId && tokenSlug) {
      try {
        await fetch(`/api/chat-history/${sessionId}?tokenSlug=${tokenSlug}`, {
          method: 'DELETE'
        })
        set({ messages: [], chatHistory: [] })
      } catch (error) {
        console.error('Failed to clear history:', error)
      }
    }
  }
}))
```

### React Patterns

#### Component Structure
```typescript
// ✅ Good - Functional component with hooks
interface UserCardProps {
  user: User
  onEdit: (user: User) => void
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const handleEdit = () => {
    onEdit(user)
  }

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  )
}
```

#### Hook Patterns
```typescript
// ✅ Good - Custom hook
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const data = await userService.getUser(userId)
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, loading, error }
}
```

### State Management

#### Zustand Store
```typescript
// ✅ Good - Clean store structure
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Login logic
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))
```

### Styling Standards

#### Tailwind CSS
```typescript
// ✅ Good - Utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Edit
  </button>
</div>
```

#### Component Styling
```typescript
// ✅ Good - Component-specific styles
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}
```

## 🤖 AI System Standards

### Vector Database Patterns
```typescript
// ✅ Good - Vector database service
@Injectable()
export class VectorDatabaseService {
  async storeChunks(chunks: Chunk[], tokenSlug: string): Promise<void> {
    try {
      const vectors = await Promise.all(
        chunks.map(async (chunk) => ({
          id: `${tokenSlug}_${chunk.id}`,
          values: await this.generateEmbedding(chunk.content),
          metadata: {
            content: chunk.content,
            source: chunk.source,
            tokenSlug,
            type: chunk.type,
            url: chunk.url
          }
        }))
      )

      await this.pinecone.upsert({
        vectors,
        namespace: tokenSlug
      })

      console.log(`[✅] [VectorDatabaseService] [storeChunks] [count]:`, vectors.length)
    } catch (error) {
      console.error(`[🔴] [VectorDatabaseService] [storeChunks] [error]:`, error)
      throw error
    }
  }

  async searchSimilar(
    query: string, 
    tokenSlug: string, 
    topK: number = 5
  ): Promise<SearchResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query)
      
      const response = await this.pinecone.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        filter: { tokenSlug },
        namespace: tokenSlug
      })

      return response.matches.map(match => ({
        id: match.id,
        score: match.score,
        content: match.metadata.content,
        source: match.metadata.source,
        url: match.metadata.url
      }))
    } catch (error) {
      console.error(`[🔴] [VectorDatabaseService] [searchSimilar] [error]:`, error)
      throw error
    }
  }
}
```

### Data Processing Patterns
```typescript
// ✅ Good - Data processing service
@Injectable()
export class DataProcessorService {
  async processTokenData(data: TokenData): Promise<Chunk[]> {
    const chunks: Chunk[] = []

    // Process token basic info
    chunks.push({
      id: `token_${data.slug}`,
      content: `Token: ${data.name} (${data.symbol})\nNetwork: ${data.network}\nPrice: $${data.price}`,
      source: 'pretge_api',
      type: 'token_info',
      url: `https://app.pretgemarket.xyz/token/${data.slug}`
    })

    // Process project description
    if (data.description) {
      const descriptionChunks = this.chunkText(data.description, 500)
      descriptionChunks.forEach((chunk, index) => {
        chunks.push({
          id: `description_${data.slug}_${index}`,
          content: chunk,
          source: 'pretge_api',
          type: 'description',
          url: `https://app.pretgemarket.xyz/token/${data.slug}`
        })
      })
    }

    // Process tokenomics
    if (data.tokenomics) {
      chunks.push({
        id: `tokenomics_${data.slug}`,
        content: `Tokenomics:\n${JSON.stringify(data.tokenomics, null, 2)}`,
        source: 'pretge_api',
        type: 'tokenomics',
        url: `https://app.pretgemarket.xyz/token/${data.slug}`
      })
    }

    return chunks
  }

  private chunkText(text: string, maxLength: number): string[] {
    const sentences = text.split(/[.!?]+/)
    const chunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        currentChunk += sentence + '. '
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim())
    return chunks
  }
}
```

### Citation System Patterns
```typescript
// ✅ Good - Citation service
@Injectable()
export class CitationService {
  generateCitations(searchResults: SearchResult[]): Citation[] {
    return searchResults.map(result => ({
      id: result.id,
      title: this.extractTitle(result.content),
      url: result.url,
      source: result.source,
      relevanceScore: result.score,
      snippet: this.extractSnippet(result.content, 200)
    }))
  }

  private extractTitle(content: string): string {
    // Extract title from content or use source
    const lines = content.split('\n')
    return lines[0].length > 50 ? lines[0].substring(0, 50) + '...' : lines[0]
  }

  private extractSnippet(content: string, maxLength: number): string {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...'
      : content
  }
}
```

## 🔒 Security Standards

### Authentication
- Sử dụng JWT tokens
- Implement refresh token mechanism
- Secure token storage
- Proper logout handling

### Input Validation
```typescript
// ✅ Good - Input validation
export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string
}
```

### SQL Injection Prevention
```typescript
// ✅ Good - Use TypeORM query builder
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getMany()
```

### XSS Prevention
```typescript
// ✅ Good - Sanitize user input
import DOMPurify from 'dompurify'

const sanitizedContent = DOMPurify.sanitize(userInput)
```

## 🧪 Testing Standards

### Unit Testing
```typescript
// ✅ Good - Comprehensive unit tests
describe('UserService', () => {
  let service: UserService
  let repository: UserRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    repository = module.get<UserRepository>(UserRepository)
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' }
      const expectedUser = { id: '1', ...createUserDto }

      jest.spyOn(repository, 'create').mockResolvedValue(expectedUser)

      const result = await service.createUser(createUserDto)

      expect(result).toEqual(expectedUser)
      expect(repository.create).toHaveBeenCalledWith(createUserDto)
    })
  })
})
```

### Integration Testing
```typescript
// ✅ Good - API integration tests
describe('UserController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201)
  })
})
```

## 📊 Performance Standards

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
- Application metrics
- Error tracking
- Performance monitoring
- User analytics

## 🔄 Git Workflow

### Branch Naming
```
feature/user-authentication
bugfix/login-validation
hotfix/security-patch
release/v1.0.0
```

### Commit Messages
```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
refactor: improve user service
test: add unit tests for auth
```

### Pull Request Standards
- Clear description
- Related issue reference
- Code review checklist
- Test coverage
- Documentation updates

## 📚 Documentation Standards

### Code Documentation
- JSDoc comments for functions
- README files for modules
- API documentation with Swagger
- Architecture diagrams

### Commit Documentation
- Clear commit messages
- Issue references
- Breaking change notes
- Migration guides

## 🆘 Code Review Checklist

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

## 🎯 Project-Specific Standards

### Chat Widget Integration
- **Widget Loading** - Lazy load widget để không ảnh hưởng performance
- **Context Detection** - Tự động detect tokenSlug từ URL
- **Theme Support** - Hỗ trợ light/dark theme
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliance

### AI Response Quality
- **Citation Accuracy** - Đảm bảo nguồn tham khảo chính xác
- **Response Relevance** - Kiểm tra độ liên quan của câu trả lời
- **Language Support** - Hỗ trợ đa ngôn ngữ (VI/EN)
- **Context Preservation** - Duy trì context trong cuộc hội thoại

### Data Management
- **Incremental Updates** - Chỉ cập nhật data thay đổi
- **Data Validation** - Validate data từ external APIs
- **Error Recovery** - Xử lý lỗi và retry mechanism
- **Cache Strategy** - Redis cache cho performance

### Performance Optimization
- **Vector Search** - Optimize vector search queries
- **API Rate Limiting** - Rate limit cho external APIs
- **WebSocket Connection** - Connection pooling và reconnection
- **Bundle Size** - Minimize widget bundle size

## 📊 Monitoring & Metrics

### AI System Metrics
- Response accuracy rate
- Vector search performance
- Data ingestion success rate
- Citation quality score
- User satisfaction rating

### Widget Metrics
- Load time
- User engagement
- Error rate
- Conversion rate
- Mobile vs desktop usage

### System Health
- API response times
- Database performance
- Redis cache hit rate
- WebSocket connection stability
- Error tracking và alerting

---

**Standards Team** - Agent PRTGE

*Last updated: [Current Date]* 