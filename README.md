# Chat Widget Q&A for Token Project

Một hệ thống AI chatbot thông minh có thể nhúng vào website để trả lời câu hỏi về token/dự án cụ thể. Hệ thống sử dụng dữ liệu từ API và tài liệu chính thức để cung cấp thông tin chính xác và cập nhật.

## 🎯 Mục tiêu dự án

Xây dựng một **widget chat** nhúng vào website (ví dụ `app.pretgemarket.xyz/token/xpl`) để người dùng có thể đặt câu hỏi về chính dự án/token hiển thị tại trang đó. Hệ thống sẽ đọc dữ liệu từ API và tài liệu chính chủ để làm nguồn kiến thức.

## 🏗️ Kiến trúc dự án

```
agent-prtge/
├── server/          # NestJS API + AI Processing + Vector DB
├── frontend/        # React Chat Widget (Vite)
├── landing/         # Next.js Demo Page + Documentation
├── docs/           # Tài liệu dự án
└── srs_chat_widget_q_a_for_token_project.md  # SRS Document
```

## 🚀 Công nghệ sử dụng

### Backend (Server)
- **NestJS** - Framework chính cho API
- **TypeORM** - ORM cho database
- **PostgreSQL** - Database chính
- **Redis** - Cache và Queue
- **Bull Queue** - Job processing
- **OpenAI API** - AI/LLM processing
- **PostgreSQL Vector** - Embeddings storage với pgvector extension
- **Streaming API** - Real-time chat responses
- **Swagger** - API documentation

### Frontend (Chat Widget)
- **React 19** - UI framework cho widget
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Framer Motion** - Animations

### Landing Page (Demo)
- **Next.js 15** - Full-stack React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Turbopack** - Fast bundler

### AI & Data Processing
- **OpenAI GPT-4** - Language model
- **Vector Embeddings** - Semantic search
- **Web Scraping** - Data ingestion từ docs
- **API Integration** - PretgeMarket API

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- pnpm (khuyến nghị) hoặc npm
- OpenAI API Key
- PostgreSQL với pgvector extension

### Setup toàn bộ dự án

```bash
# Clone repository
git clone <repository-url>
cd agent-prtge

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
DATABASE_NAME=chat_widget_db

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

# Worker
WORKER_ENABLED=true
WORKER_CONCURRENCY=5
```

## 🏃‍♂️ Chạy dự án

### Development mode

```bash
# Terminal 1: Chạy server (API + AI Processing)
cd server
pnpm run start:dev

# Terminal 2: Chạy chat widget
cd frontend
pnpm run dev

# Terminal 3: Chạy demo landing page
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

### Chạy với Docker

```bash
# Build và chạy tất cả services
docker-compose up -d

# Chỉ chạy database và Redis
docker-compose up -d postgres redis
```

## 📁 Cấu trúc thư mục

### Server (`/server`)
- **API endpoints** - REST API cho chat widget
- **AI Processing** - OpenAI integration, vector embeddings
- **Data Ingestion** - Crawl API và docs, process data
- **Vector Database** - Store và search embeddings
- **Worker Jobs** - Background processing cho data updates
- **WebSocket** - Real-time chat communication

### Frontend (`/frontend`)
- **Chat Widget** - React component có thể nhúng vào website
- **State Management** - Zustand cho chat state
- **API Integration** - Kết nối với backend API
- **Responsive Design** - Mobile-friendly interface

### Landing (`/landing`)
- **Demo Page** - Trang demo cho chat widget
- **Documentation** - Hướng dẫn sử dụng và integration
- **SEO Optimization** - Tối ưu cho search engines
- **Widget Showcase** - Hiển thị các tính năng của widget

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
- **Chat Widget**: http://localhost:5173
- **Demo Landing**: http://localhost:3001
- **Widget Integration**: http://localhost:5173/widget.js

## 📚 Tài liệu

- [SRS Document](./srs_chat_widget_q_a_for_token_project.md) - Yêu cầu chi tiết dự án
- [Server Documentation](./docs/server/) - API và AI processing
- [Widget Documentation](./docs/frontend/) - Chat widget integration
- [Landing Documentation](./docs/landing/) - Demo page và showcase
- [Coding Standards](./docs/Coding%20Standards%20&%20Best%20Practices.md) - Quy tắc coding

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

## 🎯 Tính năng chính

### Chat Widget
- **Nhúng dễ dàng** - Chỉ cần thêm 1 script tag vào website
- **Context-aware** - Tự động nhận diện token/dự án từ URL
- **Real-time chat** - Streaming API cho trải nghiệm chat mượt mà
- **Responsive** - Hoạt động tốt trên mọi thiết bị

### AI Processing
- **Vector Search** - Tìm kiếm semantic trong knowledge base
- **Hybrid Retrieval** - Kết hợp keyword và vector search
- **Citation** - Trả lời kèm nguồn tham khảo
- **Chat History** - Duy trì ngữ cảnh cuộc hội thoại
- **Multi-language** - Hỗ trợ tiếng Việt và tiếng Anh

### Data Management
- **Auto Sync** - Tự động cập nhật dữ liệu từ API và docs
- **Delta Update** - Chỉ cập nhật phần thay đổi
- **Caching** - Redis cache cho performance tốt
- **Monitoring** - Theo dõi data quality và accuracy

## 🚀 Quick Start

### 1. Setup dự án
```bash
git clone <repository-url>
cd agent-prtge
pnpm install
```

### 2. Cấu hình environment
```bash
cp server/.env.example server/.env
# Cập nhật các API keys trong .env
```

### 3. Chạy development
```bash
# Terminal 1: Server
cd server && pnpm run start:dev

# Terminal 2: Widget
cd frontend && pnpm run dev

# Terminal 3: Demo
cd landing && pnpm run dev
```

### 4. Test widget
Mở http://localhost:3001 và test chat widget với token "xpl"

---

**Made with ❤️ by Agent PRTGE Team**
