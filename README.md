# Portfolio Website

A modern, full-stack portfolio website built with [Next.js](https://nextjs.org) featuring an admin panel for content management, blog with markdown support, project showcase, and experience timeline.

## Features

- **Admin Dashboard** - Authenticated admin panel to manage content
  - Blog posts with markdown editor
  - Projects portfolio
  - Experience/timeline entries
  - About section
  - Search and filtering capabilities
  - Pagination

- **Public Site**
  - Portfolio homepage with hero section
  - Blog with markdown rendering and syntax highlighting
  - Experience timeline
  - Projects showcase
  - About section
  - Contact form with email integration

- **Technical Stack**
  - Next.js 16+ with App Router
  - React 19 + TypeScript
  - Prisma ORM for database management
  - NextAuth for authentication
  - Tailwind CSS for styling
  - Markdown support with `marked` and `shiki` for syntax highlighting
  - Content sanitization with `dompurify`
  - Email via Resend
  - Testing with Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (create `.env.local`):

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your-database-url

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Admin credentials (or your auth provider)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

4. Set up the database:

```bash
npx prisma migrate dev
```

5. (Optional) Seed the database with sample data:

```bash
npm run seed
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will auto-reload as you edit files.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (Vitest)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard routes
│   ├── api/             # API routes
│   ├── blog/            # Blog pages
│   └── page.tsx         # Home page
├── components/          # Reusable React components
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
└── tests/               # Test files
```

## Database Schema

Uses Prisma with models for:
- Blog posts
- Projects
- Experience entries
- About content
- User authentication

Run `npx prisma studio` to browse the database.

## Authentication

Protected admin routes use NextAuth for authentication. Configure your auth provider in `src/auth.ts`.

## Testing

Run tests with Vitest:

```bash
npm test              # Run once
npm run test:watch   # Watch mode
npm run test:ui      # Interactive UI
```

Tests are located in `src/tests/` directory.

## Deployment

### On Vercel

The easiest deployment option:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

[Vercel Documentation](https://vercel.com/docs/frameworks/nextjs)

### Other Platforms

Works on any platform supporting Node.js 18+.

## Contributing

This is a personal project. Feel free to fork and customize for your own use.

## License

MIT
