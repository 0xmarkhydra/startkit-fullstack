# Coding Standards & Best Practices

Tài liệu về coding standards, best practices và guidelines cho dự án StartKit Fullstack.

## 📁 Cấu trúc rules

```
rules/
├── README.md          # Tài liệu chính (này)
├── index.mdc          # Tổng quan coding standards
├── frontend.mdc       # Frontend standards
└── backend/           # Backend standards
    ├── common.mdc     # Common backend rules
    ├── nest.mdc       # NestJS specific rules
    ├── startkit-patterns.mdc # StartKit patterns
    ├── swagger-best-practices.mdc # Swagger guidelines
    ├── swagger-guide.mdc # Swagger documentation
    └── swagger-implementation-checklist.mdc # Swagger checklist
```

## 🎯 Tổng quan

### Mục tiêu
- Đảm bảo code quality và consistency
- Tăng productivity của development team
- Giảm bugs và technical debt
- Cải thiện maintainability

### Nguyên tắc chung
- **Readability** - Code dễ đọc và hiểu
- **Maintainability** - Code dễ bảo trì và mở rộng
- **Performance** - Code hiệu quả và tối ưu
- **Security** - Code an toàn và bảo mật
- **Testing** - Code có test coverage đầy đủ

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

---

**Standards Team** - StartKit Fullstack

*Last updated: [Current Date]* 