# Hoang Nhu Project

## Yêu cầu

Trước khi cài đặt, đảm bảo máy bạn đã cài đặt:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git

## Cài đặt

1. Clone ứng dụng về máy:

```bash
git clone https://github.com/vgduchieu0602/HoangNhu.git
cd hoang-nhu
```

2. Cài đặt thư viện:

```bash
npm install
```

3. Tạo file `.env` trong thư mục gốc và thêm các biến môi trường:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Database (Astra DB)
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
ASTRA_DB_ID=your_astra_db_id
ASTRA_DB_REGION=your_astra_db_region
```

## Development

Để khởi động ứng dụng:

```bash
npm run dev
```

Project thường sẽ chạy trên đường dẫn: `http://localhost:3000`

## Building for Production

Để build project chạy câu lệnh:

```bash
npm run build
```

Để bắt đầu khởi tạo server production chạy câu lệnh:

```bash
npm start
```

## Các câu lệnh thực thi

- `npm run dev` - Khởi chạy chế độ phát triển với Turbopack
- `npm run build` - Tạo bản dựng production
- `npm start` - Tạo server production
- `npm run lint` - Chạy ESLint
- `npm run seed` - Tạo dữ liệu mẫu với database

## Công nghệ sử dụng

- **Framework**: Next.js 15.2.3
- **Authentication**: Clerk
- **Database**: Astra DB (MongoDB compatible)
- **AI Integration**: OpenAI, LangChain
- **UI Components**:
  - Radix UI
  - Tailwind CSS
  - shadcn/ui
- **State Management**: React Context
- **Styling**: Tailwind CSS
- **Development Tools**:
  - TypeScript
  - ESLint
  - Turbopack

## Cấu trúc thư mục

```
hoang-nhu/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── context/         # React context providers
├── lib/             # Utility functions and configurations
├── models/          # Database models
├── public/          # Static assets
├── scripts/         # Utility scripts
└── config/          # Configuration files
```

## Bản quyền

Dự án này là riêng tư và thuộc quyền sở hữu

## Tác giả

Vương Đức Hiếu

## Thư viện sử dụng

```bash
  "dependencies": {
    "@clerk/nextjs": "^6.12.12",
    "@datastax/astra-db-ts": "^1.5.0",
    "@langchain/community": "^0.3.40",
    "@langchain/core": "^0.3.44",
    "@radix-ui/react-scroll-area": "^1.2.8",
    "ai": "^3.1.0",
    "axios": "^1.8.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^16.5.0",
    "langchain": "^0.3.26",
    "lucide-react": "^0.487.0",
    "mongoose": "^8.13.1",
    "next": "15.2.3",
    "openai": "^4.94.0",
    "prismjs": "^1.30.0",
    "puppeteer": "^24.6.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.5.2",
    "react-markdown": "^10.1.0",
    "svix": "^1.63.0",
    "tailwind-merge": "^3.3.0",
    "ts-node": "^10.9.2"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.2.3",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.2.9"
  }
```
