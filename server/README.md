<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Startkit</h1>

<p align="center">
  <b>A modern, opinionated starter kit for building scalable, production-ready backend applications with NestJS.</b>
</p>

---

## What is this?

This repository is a <b>NestJS Startkit</b> – a boilerplate project designed to help you kickstart your backend development with best practices, pre-configured modules, and a clean architecture. It provides a solid foundation for building robust, maintainable, and secure server-side applications using TypeScript and NestJS.

## Key Features
- Pre-configured with essential NestJS modules
- Standardized API response format
- Built-in Swagger documentation with best practices
- Ready-to-use authentication & user modules
- Clean code structure following SOLID & DRY principles
- Environment-based configuration
- Example unit & e2e tests
- Easy to extend and customize

## Who should use this?
- Developers who want to start a new NestJS project quickly
- Teams looking for a standardized, maintainable backend template
- Anyone who wants to follow best practices from the beginning

---

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# startkit-nest

# Server - NestJS API & Worker

Backend server được xây dựng với NestJS, cung cấp REST API, WebSocket, Queue processing và database management.

## 🏗️ Kiến trúc

```
server/
├── src/
│   ├── modules/
│   │   ├── api/           # REST API endpoints
│   │   ├── business/      # Business logic services
│   │   ├── database/      # Database entities & configs
│   │   ├── queue/         # Queue management
│   │   ├── websocket/     # WebSocket gateways
│   │   └── worker/        # Background jobs
│   ├── shared/            # Shared utilities & helpers
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
├── scripts/              # Utility scripts
└── Dockerfile           # Docker configuration
```

## 🚀 Công nghệ sử dụng

- **NestJS** - Framework chính
- **TypeORM** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Cache & Queue storage
- **Bull Queue** - Job processing
- **JWT** - Authentication
- **Passport** - Authentication strategy
- **WebSocket** - Real-time communication
- **Swagger** - API documentation
- **Jest** - Testing framework

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- pnpm (khuyến nghị)

### Setup

```bash
# Cài đặt dependencies
pnpm install

# Tạo file environment
cp .env.example .env

# Cấu hình database và Redis trong .env
```

## 🔧 Environment Variables

Tạo file `.env` trong thư mục `server/`:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=startkit_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API Configuration
API_PORT=3000
API_HOST=localhost
NODE_ENV=development

# Worker Configuration
WORKER_ENABLED=true
WORKER_CONCURRENCY=5

# External Services
OPENAI_API_KEY=your-openai-api-key
```

## 🏃‍♂️ Chạy ứng dụng

### Development

```bash
# Development mode với hot reload
pnpm run start:dev

# Debug mode
pnpm run start:debug

# Production mode
pnpm run start:prod
```

### Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Build production
pnpm run build
```

## 📁 Cấu trúc modules

### API Module (`/src/modules/api/`)
- **Controllers** - REST API endpoints
- **DTOs** - Data Transfer Objects
- **Guards** - Authentication & Authorization
- **Interceptors** - Response formatting
- **Filters** - Exception handling
- **Decorators** - Custom decorators

### Business Module (`/src/modules/business/`)
- **Services** - Business logic
- **Interfaces** - Type definitions
- **OpenAI Service** - AI integration

### Database Module (`/src/modules/database/`)
- **Entities** - Database models
- **Repositories** - Data access layer
- **Configs** - Database configuration
- **Seeders** - Database seeding

### Queue Module (`/src/modules/queue/`)
- **Queue Service** - Job queue management
- **Configs** - Queue configuration

### WebSocket Module (`/src/modules/websocket/`)
- **Gateway** - Real-time communication
- **Events** - WebSocket events

### Worker Module (`/src/modules/worker/`)
- **Consumers** - Job processors
- **Schedulers** - Scheduled tasks
- **Configs** - Worker configuration

## 🔐 Authentication & Authorization

### JWT Authentication
- JWT token-based authentication
- Token refresh mechanism
- Role-based access control

### Guards
- `JwtAuthGuard` - JWT authentication
- `CustomThrottlerGuard` - Rate limiting

### Decorators
- `@User()` - Get current user
- `@ResponseMessage()` - Custom response messages

## 📊 Database

### Entities
- `BaseEntity` - Base entity with common fields
- `AdminConfig` - Admin configuration
- User entities (extendable)

### Migrations
```bash
# Generate migration
pnpm run migration:generate

# Run migrations
pnpm run migration:run

# Revert migration
pnpm run migration:revert
```

## 🔄 Queue System

### Job Types
- User processing jobs
- Background tasks
- Scheduled jobs

### Queue Management
```bash
# Start queue processor
pnpm run start:worker

# Monitor queues
# Access Bull Dashboard at http://localhost:3000/admin/queues
```

## 🌐 WebSocket

### Real-time Features
- Live chat functionality
- Real-time notifications
- Live updates

### Events
- Connection/disconnection handling
- Message broadcasting
- Room management

## 📚 API Documentation

### Swagger UI
- Access tại: `http://localhost:3000/api`
- Interactive API documentation
- Request/response examples
- Authentication testing

### API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - User logout

#### Health Check
- `GET /health` - Health check endpoint

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov
```

### E2E Tests
```bash
# Run E2E tests
pnpm run test:e2e
```

## 🐳 Docker

### Build Image
```bash
docker build -t startkit-server .
```

### Run Container
```bash
docker run -p 3000:3000 startkit-server
```

### Docker Compose
```yaml
version: '3.8'
services:
  server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
```

## 🔧 Scripts

### Development Scripts
```bash
pnpm run start:dev      # Development mode
pnpm run start:debug    # Debug mode
pnpm run start:prod     # Production mode
```

### Build Scripts
```bash
pnpm run build          # Build application
pnpm run start          # Start built application
```

### Testing Scripts
```bash
pnpm run test           # Unit tests
pnpm run test:watch     # Watch mode tests
pnpm run test:e2e       # E2E tests
pnpm run test:cov       # Coverage tests
```

### Code Quality Scripts
```bash
pnpm run lint           # ESLint
pnpm run format         # Prettier
pnpm run pretty         # Format all files
```

## 📈 Monitoring & Logging

### Logging
- Pino logger integration
- Structured logging
- Log levels configuration

### Health Checks
- Database connectivity
- Redis connectivity
- External services health

## 🔒 Security

### Rate Limiting
- Request throttling
- IP-based limiting
- Custom throttler guard

### Validation
- Class-validator integration
- Custom validators
- Input sanitization

### CORS
- Cross-origin resource sharing
- Configurable origins
- Credentials support

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure database connection
- [ ] Set up Redis
- [ ] Configure JWT secrets
- [ ] Set up SSL/TLS
- [ ] Configure logging
- [ ] Set up monitoring

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_HOST=your-db-host
REDIS_HOST=your-redis-host
JWT_SECRET=your-production-secret
API_PORT=3000
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Kiểm tra PostgreSQL service
   - Verify connection string
   - Check firewall settings

2. **Redis Connection Error**
   - Kiểm tra Redis service
   - Verify Redis configuration
   - Check network connectivity

3. **JWT Token Issues**
   - Verify JWT_SECRET
   - Check token expiration
   - Validate token format

### Debug Mode
```bash
# Enable debug logging
DEBUG=* pnpm run start:dev

# Run with Node inspector
pnpm run start:debug
```

## 📚 Tài liệu tham khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Swagger Documentation](https://swagger.io/)

---

**Server Team** - StartKit Fullstack
