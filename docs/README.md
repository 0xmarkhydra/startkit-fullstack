# Documentation - Chat Widget Q&A for Token Project

Tài liệu chi tiết cho dự án Chat Widget Q&A, bao gồm hướng dẫn setup, development, deployment và best practices cho hệ thống AI chatbot nhúng website.

## 📁 Cấu trúc tài liệu

```
docs/
├── README.md          # Tài liệu chính (này)
├── server/            # Tài liệu cho server (API + AI)
├── frontend/          # Tài liệu cho chat widget
├── landing/           # Tài liệu cho demo page
├── integration/       # Hướng dẫn tích hợp widget
├── ai-system/         # Tài liệu hệ thống AI
└── deployment/        # Hướng dẫn deployment
```

## 🚀 Bắt đầu nhanh

### 1. Setup dự án
```bash
# Clone repository
git clone <repository-url>
cd agent-prtge

# Cài đặt dependencies
pnpm install

# Setup environment
cp server/.env.example server/.env
# Cập nhật API keys trong .env
```

### 2. Chạy development
```bash
# Terminal 1: Server (API + AI Processing)
cd server && pnpm run start:dev

# Terminal 2: Chat Widget
cd frontend && pnpm run dev

# Terminal 3: Demo Landing
cd landing && pnpm run dev
```

### 3. Truy cập ứng dụng
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Chat Widget**: http://localhost:5173
- **Demo Landing**: http://localhost:3001
- **Widget Integration**: http://localhost:5173/widget.js

## 📚 Tài liệu theo module

### Server Documentation (`/docs/server/`)
- [API Reference](./server/api-reference.md) - REST API endpoints
- [Database Schema](./server/database-schema.md) - Database design
- [AI Processing](./server/ai-processing.md) - OpenAI integration
- [Data Ingestion](./server/data-ingestion.md) - Crawl API và docs
- [Vector Database](./server/vector-database.md) - Embeddings storage
- [Streaming API Guide](./server/streaming-api-guide.md) - Real-time chat
- [Queue System](./server/queue-system.md) - Background jobs
- [Deployment Guide](./server/deployment.md) - Production setup

### Frontend Documentation (`/docs/frontend/`)
- [Widget Integration](./frontend/widget-integration.md) - Cách nhúng widget
- [Component Library](./frontend/component-library.md) - Chat components
- [State Management](./frontend/state-management.md) - Zustand store
- [API Integration](./frontend/api-integration.md) - Backend communication
- [Responsive Design](./frontend/responsive-design.md) - Mobile optimization
- [Testing Guide](./frontend/testing-guide.md) - Unit tests
- [Build & Deploy](./frontend/build-deploy.md) - Production build

### Landing Documentation (`/docs/landing/`)
- [Demo Page](./landing/demo-page.md) - Trang demo widget
- [Widget Showcase](./landing/widget-showcase.md) - Hiển thị tính năng
- [SEO Guide](./landing/seo-guide.md) - Search optimization
- [Performance](./landing/performance.md) - Speed optimization
- [Analytics](./landing/analytics.md) - User tracking

### AI System Documentation (`/docs/ai-system/`)
- [Vector Search](./ai-system/vector-search.md) - Semantic search
- [Knowledge Base](./ai-system/knowledge-base.md) - Data management
- [LLM Integration](./ai-system/llm-integration.md) - OpenAI setup
- [Citation System](./ai-system/citation-system.md) - Source tracking
- [Multi-language](./ai-system/multi-language.md) - Language support

### Integration Documentation (`/docs/integration/`)
- [Quick Start](./integration/quick-start.md) - Setup nhanh
- [Widget API](./integration/widget-api.md) - API reference
- [Customization](./integration/customization.md) - Tùy chỉnh giao diện
- [Advanced Config](./integration/advanced-config.md) - Cấu hình nâng cao
- [Troubleshooting](./integration/troubleshooting.md) - Xử lý lỗi

## 🛠️ Development Guides

### Environment Setup
- [Development Environment](./development/environment-setup.md)
- [IDE Configuration](./development/ide-configuration.md)
- [Git Workflow](./development/git-workflow.md)
- [Code Standards](./development/code-standards.md)

### Testing
- [Unit Testing](./testing/unit-testing.md)
- [Integration Testing](./testing/integration-testing.md)
- [E2E Testing](./testing/e2e-testing.md)
- [Test Coverage](./testing/test-coverage.md)

### Deployment
- [Production Setup](./deployment/production-setup.md)
- [Docker Deployment](./deployment/docker-deployment.md)
- [CI/CD Pipeline](./deployment/ci-cd-pipeline.md)
- [Monitoring](./deployment/monitoring.md)

## 📋 Checklists

### Development Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API endpoints tested
- [ ] Frontend components working
- [ ] Landing page responsive
- [ ] Tests passing
- [ ] Code linted and formatted

### Production Checklist
- [ ] Environment variables set
- [ ] Database optimized
- [ ] SSL certificates configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance optimized

### Security Checklist
- [ ] JWT secrets secure
- [ ] API rate limiting enabled
- [ ] Input validation implemented
- [ ] CORS configured properly
- [ ] SQL injection prevented
- [ ] XSS protection enabled
- [ ] CSRF protection active

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=chat_widget_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API
API_PORT=3000

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# PostgreSQL Vector
POSTGRES_VECTOR_EXTENSION=pgvector
VECTOR_DIMENSION=3072
VECTOR_SIMILARITY_THRESHOLD=0.7

# PretgeMarket API
PRETGE_API_BASE_URL=https://app.pretgemarket.xyz/api/v1
PRETGE_API_KEY=your-pretge-api-key

# Data Sources
DOCS_BASE_URL=https://docs.plasma.to/docs
CRAWL_INTERVAL=3600
EMBEDDING_BATCH_SIZE=100
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3000
VITE_API_TIMEOUT=10000

# Widget Configuration
VITE_WIDGET_NAME=Token Chat Widget
VITE_DEFAULT_TOKEN=xpl
```

#### Landing (.env.local)
```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Token Chat Widget Demo
NEXT_PUBLIC_APP_URL=http://localhost:3001

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WIDGET_URL=http://localhost:5173
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

### Server Monitoring
- Application logs
- Database performance
- API response times
- Error tracking
- Queue monitoring
- AI processing metrics
- Vector search performance
- Data ingestion status

### Widget Monitoring
- Chat interactions
- Response accuracy
- User satisfaction
- Performance metrics
- Error tracking
- Usage analytics

### Landing Analytics
- Page views
- Widget demos
- Conversion tracking
- SEO performance
- User engagement
- Integration requests

## 🔒 Security

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
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### External Resources
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

### Documentation Standards
- Use clear and concise language
- Include code examples
- Add screenshots when helpful
- Keep documentation up to date
- Follow markdown best practices

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation if needed
5. Submit a pull request

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

## 🎯 Tính năng chính

### Chat Widget
- **Context-aware** - Tự động nhận diện token từ URL
- **Real-time** - Streaming API cho trải nghiệm chat mượt mà
- **Responsive** - Hoạt động tốt trên mọi thiết bị
- **Customizable** - Dễ dàng tùy chỉnh giao diện

### AI System
- **Vector Search** - Tìm kiếm semantic trong knowledge base
- **Hybrid Retrieval** - Kết hợp keyword và vector search
- **Citation** - Trả lời kèm nguồn tham khảo
- **Multi-language** - Hỗ trợ tiếng Việt và tiếng Anh

### Data Management
- **Auto Sync** - Tự động cập nhật dữ liệu từ API và docs
- **Delta Update** - Chỉ cập nhật phần thay đổi
- **Caching** - Redis cache cho performance tốt
- **Monitoring** - Theo dõi data quality và accuracy

## 🚀 Quick Integration

### 1. Nhúng widget vào website
```html
<!-- Thêm script tag vào website -->
<script src="http://localhost:5173/widget.js"></script>
<script>
  TokenChatWidget.init({
    tokenSlug: 'xpl', // Tự động detect từ URL
    apiUrl: 'http://localhost:3000',
    theme: 'light' // hoặc 'dark'
  });
</script>
```

### 2. Tùy chỉnh giao diện
```css
/* Custom CSS cho widget */
.token-chat-widget {
  --primary-color: #3b82f6;
  --background-color: #ffffff;
  --text-color: #1f2937;
}
```

### 3. API Integration
```javascript
// Gọi API trực tiếp
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenSlug: 'xpl',
    question: 'What is Plasma token?'
  })
});
```

---

**Documentation Team** - Agent PRTGE

*Last updated: [Current Date]* 