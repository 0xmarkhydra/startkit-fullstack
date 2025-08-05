# StartKit Fullstack

Một dự án fullstack hoàn chỉnh với kiến trúc microservices, bao gồm backend API, frontend dashboard, landing page và hệ thống worker.

## 🏗️ Kiến trúc dự án

```
startkit-fullstack/
├── server/          # NestJS API + Worker
├── frontend/        # React Dashboard (Vite)
├── landing/         # Next.js Landing Page + Blog
├── docs/           # Tài liệu dự án
└── rules/          # Coding standards & Best practices
```

## 🚀 Công nghệ sử dụng

### Backend (Server)
- **NestJS** - Framework chính cho API
- **TypeORM** - ORM cho database
- **PostgreSQL** - Database chính
- **Redis** - Cache và Queue
- **Bull Queue** - Job processing
- **JWT** - Authentication
- **WebSocket** - Real-time communication
- **Swagger** - API documentation

### Frontend (Dashboard)
- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **React Hook Form** - Form handling

### Landing Page
- **Next.js 15** - Full-stack React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Turbopack** - Fast bundler

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- pnpm (khuyến nghị) hoặc npm

### Setup toàn bộ dự án

```bash
# Clone repository
git clone <repository-url>
cd startkit-fullstack

# Cài đặt dependencies cho tất cả projects
pnpm install

# Hoặc cài đặt từng phần riêng biệt
cd server && pnpm install
cd ../frontend && pnpm install
cd ../landing && pnpm install
```

## 🔧 Environment Variables

Tạo file `.env` trong thư mục `server/`:

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
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API
API_PORT=3000
API_HOST=localhost

# Worker
WORKER_ENABLED=true
WORKER_CONCURRENCY=5
```

## 🏃‍♂️ Chạy dự án

### Development mode

```bash
# Terminal 1: Chạy server
cd server
pnpm run start:dev

# Terminal 2: Chạy frontend dashboard
cd frontend
pnpm run dev

# Terminal 3: Chạy landing page
cd landing
pnpm run dev
```

### Production mode

```bash
# Build tất cả projects
pnpm run build

# Chạy production
cd server && pnpm run start:prod
```

## 📁 Cấu trúc thư mục

### Server (`/server`)
- API endpoints với NestJS
- Database entities và migrations
- Worker jobs và schedulers
- WebSocket gateways
- Authentication & Authorization

### Frontend (`/frontend`)
- React dashboard components
- State management với Zustand
- API integration
- Routing và navigation

### Landing (`/landing`)
- Next.js pages và components
- Blog system
- SEO optimization
- Static generation

## 🛠️ Scripts có sẵn

### Server
```bash
pnpm run start:dev    # Development mode
pnpm run build        # Build production
pnpm run start:prod   # Production mode
pnpm run test         # Run tests
pnpm run lint         # Lint code
```

### Frontend
```bash
pnpm run dev          # Development server
pnpm run build        # Build production
pnpm run preview      # Preview build
pnpm run lint         # Lint code
```

### Landing
```bash
pnpm run dev          # Development server
pnpm run build        # Build production
pnpm run start        # Production server
pnpm run lint         # Lint code
```

## 🔗 URLs

- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Dashboard**: http://localhost:5173
- **Landing Page**: http://localhost:3001

## 📚 Tài liệu

- [Server Documentation](./docs/server/)
- [Frontend Documentation](./docs/frontend/)
- [Landing Documentation](./docs/landing/)
- [Coding Standards](./rules/)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 🆘 Support

Nếu bạn gặp vấn đề, vui lòng:
1. Kiểm tra [Issues](../../issues)
2. Tạo issue mới với mô tả chi tiết
3. Liên hệ team development

---

**Made with ❤️ by StartKit Team**
