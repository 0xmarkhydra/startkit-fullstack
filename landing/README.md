# Landing Page - Next.js

Landing page được xây dựng với Next.js 15, TypeScript và Tailwind CSS. Cung cấp trang chủ, blog system và SEO optimization.

## 🏗️ Kiến trúc

```
landing/
├── src/
│   ├── app/           # App Router (Next.js 13+)
│   │   ├── layout.tsx # Root layout
│   │   ├── page.tsx   # Home page
│   │   └── globals.css # Global styles
│   ├── components/    # Reusable components
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript types
├── public/           # Static assets
└── next.config.ts   # Next.js configuration
```

## 🚀 Công nghệ sử dụng

- **Next.js 15** - Full-stack React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Turbopack** - Fast bundler
- **App Router** - Next.js 13+ routing
- **ESLint** - Code linting

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18
- pnpm (khuyến nghị) hoặc npm

### Setup

```bash
# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm run dev
```

## 🔧 Configuration

### Environment Variables

Tạo file `.env.local` trong thư mục `landing/`:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=StartKit
NEXT_PUBLIC_APP_URL=http://localhost:3001

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@startkit
NEXT_PUBLIC_GITHUB_URL=https://github.com/startkit
```

### Next.js Configuration

File `next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['localhost'],
  },
  // Enable static exports if needed
  // output: 'export',
}

export default nextConfig
```

## 🏃‍♂️ Chạy ứng dụng

### Development

```bash
# Development server với Turbopack
pnpm run dev

# Build cho production
pnpm run build

# Start production server
pnpm run start
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Type checking
pnpm run type-check
```

## 📁 Cấu trúc App Router

### Root Layout (`/src/app/layout.tsx`)
- Global layout component
- Metadata configuration
- Font loading
- Global styles

### Home Page (`/src/app/page.tsx`)
- Landing page content
- Hero section
- Feature highlights
- Call-to-action

### Global Styles (`/src/app/globals.css`)
- Tailwind CSS imports
- Custom CSS variables
- Global styles

## 🎨 Styling

### Tailwind CSS v4
- Latest Tailwind CSS features
- Custom design system
- Responsive design
- Dark mode support

### CSS Structure
```css
/* src/app/globals.css */
@import "tailwindcss";

/* Custom CSS variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
}

/* Custom components */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }
}
```

## 📄 Pages & Routes

### Static Pages
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/pricing` - Pricing page

### Blog System
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog posts
- `/blog/category/[category]` - Category pages
- `/blog/tag/[tag]` - Tag pages

### Dynamic Routes
```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <div>Blog post: {params.slug}</div>
}
```

## 🔍 SEO Optimization

### Metadata Configuration
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'StartKit - Fullstack Development',
    template: '%s | StartKit'
  },
  description: 'Modern fullstack development platform',
  keywords: ['fullstack', 'development', 'startkit'],
  authors: [{ name: 'StartKit Team' }],
  openGraph: {
    title: 'StartKit - Fullstack Development',
    description: 'Modern fullstack development platform',
    url: 'https://startkit.dev',
    siteName: 'StartKit',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

### Dynamic Metadata
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  }
}
```

## 📝 Blog System

### Blog Structure
```
src/
├── app/
│   └── blog/
│       ├── page.tsx           # Blog listing
│       ├── [slug]/
│       │   └── page.tsx      # Individual post
│       └── category/
│           └── [category]/
│               └── page.tsx  # Category pages
└── content/
    └── blog/
        ├── post-1.md
        ├── post-2.md
        └── ...
```

### Markdown Processing
- MDX support for rich content
- Frontmatter parsing
- Syntax highlighting
- Image optimization

### Blog Features
- Search functionality
- Category filtering
- Tag system
- Related posts
- Reading time estimation

## 🚀 Performance

### Optimization Techniques
- **Static Generation** - Pre-render pages at build time
- **Incremental Static Regeneration** - Update static pages
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Next.js font loading
- **Bundle Analysis** - Analyze JavaScript bundles

### Performance Monitoring
```bash
# Analyze bundle
pnpm run build --analyze

# Lighthouse CI
pnpm run lighthouse
```

## 📱 Responsive Design

### Mobile-First Approach
- Tailwind responsive utilities
- Touch-friendly interfaces
- Mobile navigation
- Progressive Web App features

### Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## 🔧 Development Tools

### ESLint Configuration
```javascript
// eslint.config.mjs
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Custom rules
    },
  },
]
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🧪 Testing

### Unit Testing
```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Testing Libraries
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Other Platforms
- **Netlify** - Static site hosting
- **AWS Amplify** - Full-stack hosting
- **Docker** - Containerized deployment

### Static Export
```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
```

## 📊 Analytics

### Google Analytics
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}
```

### Custom Analytics
- Page view tracking
- Event tracking
- Conversion tracking
- Performance monitoring

## 🔒 Security

### Security Headers
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors
   - Verify dependencies
   - Clear .next folder and rebuild

2. **Runtime Errors**
   - Check browser console
   - Verify environment variables
   - Check Next.js version compatibility

3. **Performance Issues**
   - Analyze bundle size
   - Check image optimization
   - Verify static generation

### Debug Mode
```bash
# Enable debug logging
DEBUG=* pnpm run dev

# Build with verbose output
pnpm run build --verbose
```

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

### Code Standards
- Follow Next.js best practices
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features

---

**Landing Team** - StartKit Fullstack
