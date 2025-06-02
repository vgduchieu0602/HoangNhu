# Hoang Nhu Project

A Next.js web application with AI capabilities and modern UI components.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd hoang-nhu
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

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

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database with initial data

## Tech Stack

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

## Project Structure

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

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is private and proprietary.

## Author

Vương Đức Hiếu

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
