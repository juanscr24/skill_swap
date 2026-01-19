# SkillSwap 🔄

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**SkillSwap** is a professional skill exchange platform that connects people who want to teach and learn new skills. It functions as a complete mentorship and collaborative learning ecosystem, with an intelligent matching system, real-time chat, and comprehensive educational session management.

## 🎯 Project Description

SkillSwap is more than a simple skill exchange. It's a comprehensive platform that allows:

- 📚 **Publish and manage skills** - Share your experience and knowledge with expertise levels
- 🎓 **Find mentors and students** - Connect with users based on your learning needs
- 🤝 **Intelligent matching system** - Algorithm that connects complementary skills
- 💬 **Real-time chat** - Instant communication with user presence and read status
- 📅 **Availability management** - Integrated calendar to schedule sessions
- ⚡ **Structured sessions** - Complete booking and tracking system for sessions
- ⭐ **Reputation system** - Reviews and ratings that build trust
- 🌍 **Multilingual** - Support for multiple languages with next-intl
- 🎨 **Dark/light mode** - Customizable themes saved locally
- 🔔 **Real-time notifications** - Stay up to date with all interactions
- ⚙️ **Advanced configuration** - Complete control over privacy and notifications

## ✨ Key Features

### 🎭 Role and Profile System
- **Roles**: USER, MENTOR, STUDENT, ADMIN
- Complete profiles with biography, photo, location
- Cloudinary integration for image management
- Professional titles and social media links
- Email verification system

### 🤝 Matching System
- Matching algorithm based on complementary skills
- Personalized exchange requests with messages
- States: pending, accepted, rejected
- Optimized indexing for fast searches
- Automatic notifications for new matches

### 💬 Real-time Chat
Powered by **Supabase Realtime**:
- **Instant messaging** without polling, real-time events
- **Message status** WhatsApp-style:
  - ✓ Sent
  - ✓✓ Delivered (delivered_at)
  - ✓✓ Read (read_at)
- **User presence** (online/offline)
- **Last seen** - Last time seen
- **Unread message counter** automatically updated
- **Persistent conversations** with complete history
- No need to refresh the page

### 📅 Availability and Session System
- **Mentor availability**:
  - Time slot management by date
  - Booking states (is_booked)
  - Configurable time ranges
- **Educational sessions**:
  - Host and guest
  - States: pending, scheduled, completed, cancelled, rejected
  - Title, description, and notes
  - Link with mentor availability
  - Schedule conflict validation

### 🌟 Review System
- 1-5 star ratings
- Optional detailed comments
- Complete history of reviews received and given
- Automatic average rating calculation
- Bidirectional reviews (both participants can rate)

### 🔔 Notification System
- Real-time notifications
- Customizable types (matches, messages, sessions, reviews)
- Read/unread status
- User-configurable preferences
- JSON storage for flexible data

### 🌐 Internationalization (i18n)
- Multilingual support with next-intl
- User language management
- Proficiency level per language
- Integration with skills system

### ⚙️ User Settings
Granular configurations for:
- **Notifications**: Email, push, news, security, mentors, messages
- **Privacy**:
  - Profile visibility: public, mentors, private
  - Message privacy: everyone, matches, mentors

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.1](https://nextjs.org/)** - React framework with App Router and Server Components
- **[React 19.2](https://react.dev/)** - UI library with React Server Components
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - End-to-end static typing
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Modern and consistent icons
- **[Motion](https://motion.dev/)** - Smooth and professional animations
- **[React Hook Form 7.68](https://react-hook-form.com/)** - Optimized form management
- **[Zod 4.1](https://zod.dev/)** - Schema validation and type safety
- **[next-intl 4.5](https://next-intl-docs.vercel.app/)** - Complete internationalization
- **[Zustand 5.0](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### Backend & Database
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless RESTful API
- **[Prisma ORM 5.22](https://www.prisma.io/)** - Type-safe database client
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service with Realtime
  - Realtime subscriptions for chat
  - Database hosting (PostgreSQL)
  - Row-level security

### Authentication & Authorization
- **[NextAuth.js 4.24](https://next-auth.js.org/)** - Complete authentication
- **[@next-auth/prisma-adapter](https://authjs.dev/reference/adapter/prisma)** - Prisma integration
- **[bcrypt 6.0](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing

### Cloud Services
- **[Cloudinary](https://cloudinary.com/)** - Image management and optimization
- **[Supabase Storage](https://supabase.com/storage)** - File storage

### Code Quality
- **[ESLint 9](https://eslint.org/)** - Linter with Next.js configuration
- **[TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)** - Maximum type safety

### Utilities
- **[@tanstack/react-query 5.90](https://tanstack.com/query/latest)** - Server state management
- **[date-fns 4.1](https://date-fns.org/)** - Date manipulation
- **[React Icons 5.5](https://react-icons.github.io/react-icons/)** - Additional icon library

## 📁 Project Structure

```
skill_swap/
├── prisma/
│   ├── schema.prisma           # Prisma database schema
│   └── migrations/             # Migration history
│       ├── migration_lock.toml
│       ├── 20251230154511_add_chat_tables/
│       ├── 20260108001652_add_message_status_and_presence/
│       └── 20260114194527_add_user_settings_table/
├── public/
│   ├── flag/                   # Country flags
│   └── images/                 # Static images
├── src/
│   ├── middleware.ts           # Next.js middleware
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── layout.tsx
│   │   │   ├── activity/      # User activity
│   │   │   ├── chats/         # Real-time chat
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── matching/      # Matching system
│   │   │   ├── mentors/       # Mentor search
│   │   │   ├── profile/       # User profile
│   │   │   ├── requests/      # Exchange requests
│   │   │   ├── reviews/       # Review system
│   │   │   ├── sessions/      # Session management
│   │   │   └── settings/      # Settings
│   │   └── api/               # API Routes
│   │       ├── auth/          # Authentication (NextAuth)
│   │       ├── availability/  # Mentor availability
│   │       ├── calendar/      # Calendar
│   │       ├── conversations/ # Conversations
│   │       ├── dashboard/     # Statistics
│   │       ├── languages/     # Languages
│   │       ├── matches/       # Matches
│   │       ├── messages/      # Messages
│   │       ├── presence/      # User presence
│   │       ├── reviews/       # Reviews
│   │       ├── sessions/      # Sessions
│   │       ├── settings/      # Settings
│   │       ├── skills/        # Skills
│   │       ├── upload/        # File upload
│   │       └── users/         # Users
│   ├── data/                  # Static data
│   │   └── activity.ts
│   ├── features/              # Feature modules (modular architecture)
│   │   ├── activity/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── validations/
│   │   │   └── index.ts
│   │   ├── calendar/
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── language/
│   │   ├── matching/
│   │   ├── mentor/
│   │   ├── profile/
│   │   ├── request/
│   │   ├── review/
│   │   ├── session/
│   │   └── setting/
│   ├── i18n/                  # Internationalization
│   │   └── messages/
│   ├── lib/                   # Utilities and configuration
│   │   ├── auth/              # NextAuth configuration
│   │   ├── providers/         # React providers
│   │   ├── supabase/          # Supabase client
│   │   ├── prisma.ts          # Prisma client
│   │   └── index.ts
│   ├── shared/                # Shared code
│   │   ├── components/        # Reusable components
│   │   ├── constants/         # Global constants
│   │   ├── hooks/             # Shared hooks
│   │   ├── types/             # Global types
│   │   ├── utils/             # Utilities
│   │   └── validations/       # Shared validations
│   └── stores/                # Global state (Zustand)
│       ├── localeStore.ts
│       ├── settingsStore.ts
│       └── themeStore.ts
├── doc/                       # Documentation
├── .env                       # Environment variables (not committed)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🗄️ Database Models

### 👤 Authentication and Users
- **users** - Platform users with roles and complete profiles
- **accounts** - OAuth accounts (Google, GitHub, etc.)
- **account_sessions** - Authentication sessions
- **verification_tokens** - Email verification tokens

### 🎯 Skills and Matching
- **skills** - Skills that users teach
- **wanted_skills** - Skills that users want to learn
- **matches** - Exchange requests between users
- **languages** - Languages spoken by users

### 💬 Real-time Chat
- **conversations** - Conversations between users
- **conversation_participants** - Conversation participants with last_read_at
- **messages** - Messages with status (sent, delivered, read)
- **user_presence** - Online/offline status with last_seen

### 📅 Sessions and Mentorship
- **sessions** - Scheduled exchange sessions
- **mentor_availability** - Mentor availability by date and time

### ⭐ Reputation and Social
- **reviews** - Reviews and ratings between users
- **notifications** - System notifications

### ⚙️ Settings
- **user_settings** - Notification and privacy settings

## 🚀 Installation and Configuration

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **PostgreSQL** - Database (recommended: Supabase)
- **Supabase account** - For Realtime and DB hosting
- **Cloudinary account** (optional) - For image management

### 1. Clone the repository

```bash
git clone https://github.com/juanscr24/skill_swap.git
cd skill_swap
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the project root with the following variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase (for Realtime and Storage)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth.js (Authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-with: openssl rand -base64 32"

# Cloudinary (optional - for images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Configure the database

```bash
# Run migrations (apply all existing migrations)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 5. Configure Supabase Realtime (IMPORTANT)

For real-time chat to work, you must enable Realtime on Supabase tables:

1. Go to your project in [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Database** → **Replication**
3. Enable Realtime on the following tables:
   - ✅ `messages`
   - ✅ `conversations`
   - ✅ `conversation_participants`
   - ✅ `user_presence`

You can also run the SQL script at `doc/script/setup_realtime_chat.sql` for automatic configuration.

### 6. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 7. Open the application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server on localhost:3000

# Production
npm run build            # Build the application for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create new migration (development)
npx prisma migrate deploy # Apply migrations (production)
npx prisma studio        # Open visual database interface
npx prisma db push       # Sync schema without migration (useful for rapid development)

# Linting
npm run lint             # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Configure environment variables in Vercel
4. Vercel will automatically detect Next.js and configure the build

```bash
# Or using Vercel CLI
npm i -g vercel
vercel
```

### Environment variables in production

Make sure to configure all environment variables in your deployment platform:
- `DATABASE_URL` and `DIRECT_URL` (database connection)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_URL` (your production domain)
- `NEXTAUTH_SECRET`
- Cloudinary credentials (if used)

## 📚 Additional Documentation

### Real-time Chat
If you want to understand how the chat system works:
- **🚀 Quick Start Guide** - `doc/INICIO_RAPIDO.md` - Set up chat in 5 minutes
- **📖 Complete Summary** - `doc/RESUMEN_CHAT_TIEMPO_REAL.md` - All features
- **🔧 Technical Setup** - `doc/REALTIME_CHAT_SETUP.md` - Detailed documentation

### SQL Scripts
- **📝 Supabase Setup** - `doc/script/setup_realtime_chat.sql` - SQL configuration script

## 🤝 Contributions

Contributions are welcome. Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the ISC License. See the `LICENSE` file for more details.

## 👨‍💻 Author

**Juan Sebastian**
- GitHub: [@juanscr24](https://github.com/juanscr24)
- Repository: [skill_swap](https://github.com/juanscr24/skill_swap)

---

⭐ If you like this project, give it a star on GitHub!
