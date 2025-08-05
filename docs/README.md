# Documentation - Startkit Platform Agent

Tài liệu chi tiết cho dự án **Startkit Platform Agent** - một nền tảng AI Agent mở rộng với LangChain, hỗ trợ plug-and-play cho bất kỳ AI model nào.

## 🎯 Tổng quan dự án

**Startkit Platform Agent** là một nền tảng AI Agent hiện đại được xây dựng với kiến trúc modular, cho phép:

- **Plug-and-play AI Models** - Hỗ trợ bất kỳ AI model nào (OpenAI, Anthropic, DeepSeek, etc.)
- **LangChain Integration** - Tích hợp mạnh mẽ với LangChain framework
- **Tool/MCP Registry** - Dễ dàng thêm tools và Model Context Protocol
- **Real-time Chat** - Giao tiếp real-time với AI Agent
- **Community-driven** - Kiến trúc mở cho cộng đồng phát triển

## 🏗️ Kiến trúc hệ thống

```
Startkit Platform Agent
├── Input (sessionId, chatInput)
├── AI Agent (LangChain)
│   ├── Model Factory (Any AI Model)
│   ├── Tool Registry (MCP/Tools)
│   └── Memory System (PostgreSQL)
└── Output (AI Response)
```

## 📁 Cấu trúc tài liệu

```
docs/
├── README.md                    # Tài liệu chính (này)
├── Coding Standards & Best Practices.md  # Coding standards
├── server/                      # Tài liệu cho server
├── frontend/                    # Tài liệu cho frontend
└── landing/                     # Tài liệu cho landing page
```

## 🚀 Bắt đầu nhanh

### 1. Setup dự án
```bash
# Clone repository
git clone <repository-url>
cd platform-agent

# Cài đặt dependencies
pnpm install

# Setup environment
cp server/.env.example server/.env
cp frontend/.env.example frontend/.env
cp landing/.env.example landing/.env.local
```

### 2. Chạy development
```bash
# Terminal 1: Server (AI Agent Backend)
cd server && pnpm run start:dev

# Terminal 2: Frontend (Chat Interface)
cd frontend && pnpm run dev

# Terminal 3: Landing (Marketing Page)
cd landing && pnpm run dev
```

### 3. Truy cập ứng dụng
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Chat Dashboard**: http://localhost:5173
- **Landing Page**: http://localhost:3001

## 🤖 AI Agent Features

### Model Support
- **OpenAI** (GPT-3.5, GPT-4, GPT-4 Turbo)
- **Anthropic** (Claude-2, Claude-3)
- **DeepSeek** (DeepSeek Chat)
- **Custom Models** (Any LangChain compatible model)

### Tool System
```typescript
// ✅ ĐÚNG - Easy tool registration
@Injectable()
export class ToolRegistry {
  registerTool('database-query', new DatabaseTool());
  registerTool('web-search', new WebSearchTool());
  registerTool('file-reader', new FileReaderTool());
}
```

### Memory Management
- **PostgreSQL Chat Memory** - Persistent conversation history
- **Session Management** - Multi-session support
- **Context Preservation** - Maintain conversation context

## 📚 Tài liệu theo module

### Server Documentation (`/docs/server/`)
- [AI Agent Architecture](./server/ai-agent-architecture.md)
- [LangChain Integration](./server/langchain-integration.md)
- [Model Factory Guide](./server/model-factory-guide.md)
- [Tool Development](./server/tool-development.md)
- [Memory System](./server/memory-system.md)
- [API Reference](./server/api-reference.md)
- [WebSocket Guide](./server/websocket-guide.md)
- [Deployment Guide](./server/deployment.md)

### Frontend Documentation (`/docs/frontend/`)
- [Chat Interface](./frontend/chat-interface.md)
- [Component Library](./frontend/component-library.md)
- [State Management](./frontend/state-management.md)
- [Real-time Communication](./frontend/realtime-communication.md)
- [Testing Guide](./frontend/testing-guide.md)
- [Build & Deploy](./frontend/build-deploy.md)

### Landing Documentation (`/docs/landing/`)
- [Page Structure](./landing/page-structure.md)
- [AI Agent Showcase](./landing/ai-agent-showcase.md)
- [SEO Guide](./landing/seo-guide.md)
- [Performance](./landing/performance.md)
- [Analytics](./landing/analytics.md)

## 🛠️ Development Guides

### AI Agent Development
- [Creating Custom Tools](./development/creating-tools.md)
- [Adding New Models](./development/adding-models.md)
- [Memory Implementation](./development/memory-implementation.md)
- [Testing AI Agents](./development/testing-ai-agents.md)

### Environment Setup
- [Development Environment](./development/environment-setup.md)
- [IDE Configuration](./development/ide-configuration.md)
- [Git Workflow](./development/git-workflow.md)
- [Code Standards](./development/code-standards.md)

### Testing
- [Unit Testing](./testing/unit-testing.md)
- [Integration Testing](./testing/integration-testing.md)
- [AI Agent Testing](./testing/ai-agent-testing.md)
- [E2E Testing](./testing/e2e-testing.md)

### Deployment
- [Production Setup](./deployment/production-setup.md)
- [Docker Deployment](./deployment/docker-deployment.md)
- [CI/CD Pipeline](./deployment/ci-cd-pipeline.md)
- [Monitoring](./deployment/monitoring.md)

## 📋 Checklists

### Development Checklist
- [ ] Environment variables configured
- [ ] AI models configured
- [ ] Tools registered
- [ ] Memory system setup
- [ ] API endpoints tested
- [ ] Chat interface working
- [ ] Real-time communication tested
- [ ] Tests passing
- [ ] Code linted and formatted

### Production Checklist
- [ ] Environment variables set
- [ ] AI models production-ready
- [ ] Database optimized
- [ ] SSL certificates configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance optimized

### Security Checklist
- [ ] API keys secure
- [ ] JWT secrets secure
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] CORS configured properly
- [ ] SQL injection prevented
- [ ] XSS protection enabled
- [ ] AI model security

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=platform_agent_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Models
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key

# API
API_PORT=3000
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Platform Agent Dashboard
```

#### Landing (.env.local)
```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Platform Agent
NEXT_PUBLIC_APP_URL=http://localhost:3001

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 Scripts Reference

### Server Scripts
```bash
pnpm run start:dev      # Development mode
pnpm run start:debug    # Debug mode
pnpm run start:prod     # Production mode
pnpm run build          # Build application
pnpm run test           # Run tests
pnpm run test:e2e       # Run E2E tests
pnpm run lint           # Lint code
pnpm run format         # Format code
```

### Frontend Scripts
```bash
pnpm run dev            # Development server
pnpm run build          # Build production
pnpm run preview        # Preview build
pnpm run lint           # Lint code
```

### Landing Scripts
```bash
pnpm run dev            # Development server
pnpm run build          # Build production
pnpm run start          # Production server
pnpm run lint           # Lint code
```

## 📊 Monitoring & Analytics

### AI Agent Monitoring
- Model performance metrics
- Tool usage statistics
- Memory usage patterns
- Response time tracking
- Error rate monitoring

### Server Monitoring
- Application logs
- Database performance
- API response times
- Error tracking
- Queue monitoring

### Frontend Monitoring
- Page load times
- User interactions
- Error tracking
- Performance metrics
- User analytics

### Landing Analytics
- Page views
- User engagement
- Conversion tracking
- SEO performance
- Social media metrics

## 🔒 Security

### AI Model Security
- API key management
- Model access control
- Input sanitization
- Output validation
- Rate limiting per model

### Authentication
- JWT token management
- Role-based access control
- Session management
- Password policies

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting

### Infrastructure Security
- SSL/TLS encryption
- Firewall configuration
- Database security
- API security

## 🆘 Troubleshooting

### Common Issues

#### AI Agent Issues
1. **Model Connection Error**
   - Check API keys
   - Verify model configuration
   - Check network connectivity

2. **Tool Registration Error**
   - Verify tool implementation
   - Check tool dependencies
   - Validate tool interface

3. **Memory System Error**
   - Check PostgreSQL connection
   - Verify memory configuration
   - Check database permissions

#### Server Issues
1. **Database Connection Error**
   - Check PostgreSQL service
   - Verify connection string
   - Check firewall settings

2. **Redis Connection Error**
   - Check Redis service
   - Verify Redis configuration
   - Check network connectivity

3. **JWT Token Issues**
   - Verify JWT_SECRET
   - Check token expiration
   - Validate token format

#### Frontend Issues
1. **Build Errors**
   - Check TypeScript errors
   - Verify dependencies
   - Clear node_modules and reinstall

2. **Runtime Errors**
   - Check browser console
   - Verify API endpoints
   - Check authentication state

#### Landing Issues
1. **Build Errors**
   - Check TypeScript errors
   - Verify dependencies
   - Clear .next folder and rebuild

2. **SEO Issues**
   - Check metadata configuration
   - Verify Open Graph tags
   - Test structured data

### Debug Mode
```bash
# Server debug
DEBUG=* pnpm run start:dev

# Frontend debug
DEBUG=* pnpm run dev

# Landing debug
DEBUG=* pnpm run dev
```

## 📚 Tài liệu tham khảo

### Official Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### AI Model Documentation
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [DeepSeek API Documentation](https://platform.deepseek.com/docs)

### External Resources
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

### Community Guidelines
- Follow coding standards
- Write comprehensive tests
- Update documentation
- Create meaningful PRs
- Be respectful and helpful

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Update documentation if needed
6. Submit a pull request

### Contribution Areas
- **AI Models** - Add new model integrations
- **Tools** - Create new tools/MCP
- **Frontend** - Improve chat interface
- **Documentation** - Enhance guides and examples
- **Testing** - Add test coverage
- **Performance** - Optimize performance

### Documentation Standards
- Use clear and concise language
- Include code examples
- Add screenshots when helpful
- Keep documentation up to date
- Follow markdown best practices

### Documentation Structure
- Use consistent headings
- Include table of contents
- Add cross-references
- Maintain version information
- Include last updated dates

## 📞 Support

### Getting Help
1. Check this documentation first
2. Search existing issues
3. Create a new issue with details
4. Contact the development team

### Issue Templates
- Bug reports
- Feature requests
- Documentation improvements
- Security vulnerabilities
- AI model issues
- Tool development questions

---

**Platform Agent Team** - Startkit Platform Agent

*Last updated: [Current Date]* 