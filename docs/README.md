# Documentation - StartKit Fullstack

Tài liệu chi tiết cho dự án StartKit Fullstack, bao gồm hướng dẫn setup, development, deployment và best practices.

## 📁 Cấu trúc tài liệu

```
docs/
├── README.md          # Tài liệu chính (này)
├── server/            # Tài liệu cho server
├── frontend/          # Tài liệu cho frontend
└── landing/           # Tài liệu cho landing page
```

## 🚀 Bắt đầu nhanh

### 1. Setup dự án
```bash
# Clone repository
git clone <repository-url>
cd startkit-fullstack

# Cài đặt dependencies
pnpm install

# Setup environment
cp server/.env.example server/.env
cp frontend/.env.example frontend/.env
cp landing/.env.example landing/.env.local
```

### 2. Chạy development
```bash
# Terminal 1: Server
cd server && pnpm run start:dev

# Terminal 2: Frontend
cd frontend && pnpm run dev

# Terminal 3: Landing
cd landing && pnpm run dev
```

### 3. Truy cập ứng dụng
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Dashboard**: http://localhost:5173
- **Landing Page**: http://localhost:3001

## 📚 Tài liệu theo module

### Server Documentation (`/docs/server/`)
- [API Reference](./server/api-reference.md)
- [Database Schema](./server/database-schema.md)
- [Authentication](./server/authentication.md)
- [WebSocket Guide](./server/websocket-guide.md)
- [Queue System](./server/queue-system.md)
- [Deployment Guide](./server/deployment.md)

### Frontend Documentation (`/docs/frontend/`)
- [Component Library](./frontend/component-library.md)
- [State Management](./frontend/state-management.md)
- [Routing Guide](./frontend/routing-guide.md)
- [API Integration](./frontend/api-integration.md)
- [Testing Guide](./frontend/testing-guide.md)
- [Build & Deploy](./frontend/build-deploy.md)

### Landing Documentation (`/docs/landing/`)
- [Page Structure](./landing/page-structure.md)
- [Blog System](./landing/blog-system.md)
- [SEO Guide](./landing/seo-guide.md)
- [Performance](./landing/performance.md)
- [Analytics](./landing/analytics.md)

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
DATABASE_NAME=startkit_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API
API_PORT=3000
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=StartKit Dashboard
```

#### Landing (.env.local)
```env
# App Configuration
NEXT_PUBLIC_APP_NAME=StartKit
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

---

**Documentation Team** - StartKit Fullstack

*Last updated: [Current Date]* 