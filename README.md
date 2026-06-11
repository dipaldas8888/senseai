# SenseAI - AI-Powered Career Assistant

SenseAI is a comprehensive AI-powered platform designed to help professionals with their career development. It leverages cutting-edge technologies to provide intelligent resume building, cover letter generation, interview preparation, and personalized career guidance.

## 🎯 Project Overview

SenseAI is a full-stack web application built with modern technologies to streamline career preparation and job application processes. The platform analyzes user profiles, industries, and experiences to provide tailored recommendations and automated content generation.

**Key Features:**

- 📄 **Resume Builder** - Create ATS-optimized resumes with multiple templates
- ✉️ **Cover Letter Generator** - AI-generated, tailored cover letters
- 🎤 **Interview Preparation** - Mock interview simulations and guidance
- 📊 **Onboarding & Assessment** - Industry-specific assessments and insights
- 👤 **User Dashboard** - Centralized hub for all career tools
- 🔐 **Secure Authentication** - Enterprise-grade user authentication

---

## 🛠️ Technology Stack

### Frontend

- **Framework**: [Next.js 16.2.6](https://nextjs.org/) - React-based full-stack framework
- **React**: 19.2.4 - UI library
- **TypeScript**: Strict type safety across the codebase
- **Styling**:
  - [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
  - [Framer Motion 12.40.0](https://www.framer.com/motion/) - Smooth animations
- **UI Components**:
  - [shadcn](https://shadcn.com/) - High-quality React components
  - [Base UI React 1.5.0](https://base-ui.com/) - Headless UI components
  - [Lucide React 1.16.0](https://lucide.dev/) - Icon library

### Backend & API

- **Runtime**: Node.js via Next.js
- **API Routes**: Next.js API routes
- **Background Jobs**: [Inngest 4.4.0](https://www.inngest.com/) - Workflow orchestration

### Database & ORM

- **Database**: PostgreSQL
- **ORM**: [Prisma 7.8.0](https://www.prisma.io/) with `@prisma/adapter-pg`
- **Client**: `@prisma/client`
- **Driver**: `pg` (Node.js PostgreSQL driver)

### Authentication

- **Clerk 7.4.1** - User authentication and management
- **Clerk Themes 2.4.57** - Pre-built authentication UI themes

### Backend Services

- **Supabase**:
  - `@supabase/supabase-js` - Client SDK
  - `@supabase/ssr` - Server-side rendering support
- **File Processing**:
  - `mammoth` - DOCX file parsing
  - `pdf-parse` - PDF document parsing

### Development Tools

- **Build Tool**: Webpack (via Next.js)
- **Linting**: ESLint 9
- **CSS Processing**: PostCSS with Tailwind CSS
- **Type Checking**: TypeScript 5

### Utilities

- **Class Variance**: `class-variance-authority` - CSS-in-JS variants
- **Classname Merging**: `clsx` & `tailwind-merge` - Utility class handling
- **3D Graphics**: `ogl` - WebGL rendering engine
- **Animation**: `tw-animate-css` - Tailwind CSS animations

---

## 📦 Project Structure

```
senseai/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── inngest/              # Inngest webhooks
│   ├── (main)/                   # Main layout group
│   │   ├── resume/               # Resume builder
│   │   ├── cover-letter/         # Cover letter generator
│   │   ├── interview/            # Interview prep
│   │   ├── onboarding/           # Onboarding flow
│   │   └── mock/                 # Mock interviews
│   ├── dashboard/                # User dashboard
│   ├── sign-in/                  # Clerk auth signin
│   ├── sign-up/                  # Clerk auth signup
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── actions/                      # Server actions
│   ├── resume.ts
│   ├── cover-letter.ts
│   ├── dashboard.ts
│   └── user.ts
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── Header.tsx
│   ├── Hero.tsx
│   └── ...                       # Other components
├── lib/                          # Utilities & helpers
│   ├── prisma.ts                 # Prisma client
│   ├── inngest/                  # Inngest workflows
│   ├── supabase/                 # Supabase clients
│   └── utils.ts
├── data/                         # Static data
│   ├── faqs.js
│   ├── features.js
│   ├── industries.js
│   └── testimonial.js
├── prisma/                       # Database schema
│   └── schema.prisma
├── public/                       # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
├── next.config.ts                # Next.js config
└── eslint.config.mjs             # ESLint config
```

---

## 🗄️ Database Schema

### Core Models:

- **User** - User profile with Clerk integration
- **Assessment** - Quiz results and career assessments
- **Resume** - Resume content and metadata
- **CoverLetter** - Generated cover letters
- **IndustryInsight** - Industry-specific data and insights

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or remote)
- Supabase account (for authentication & storage)
- Clerk account (for user management)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd senseai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/senseai

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
   CLERK_SECRET_KEY=your-clerk-secret

   # Inngest
   INNGEST_EVENT_KEY=your-inngest-key
   INNGEST_SIGNING_KEY=your-inngest-signing-key
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 📝 Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server with Webpack |
| `npm run build` | Build for production                  |
| `npm start`     | Start production server               |
| `npm run lint`  | Run ESLint                            |

---

## 🔧 Development Workflow

### Adding Database Migrations

```bash
npx prisma migrate dev --name describe_your_change
```

### Viewing Database

```bash
npx prisma studio
```

### Building for Production

```bash
npm run build
npm start
```

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

---

## 📚 Documentation & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Inngest Workflows](https://www.inngest.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🛠️ Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Check database credentials

### Prisma Errors

```bash
# Reset database (development only)
npx prisma migrate reset

# Verify schema
npx prisma validate
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Contributing

For development guidelines and contribution process, please refer to the project documentation.

---

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository.
