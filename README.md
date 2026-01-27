# LinkedInbox

A Next.js application that analyzes your LinkedIn messages to provide insights on outreach effectiveness, prospect engagement, and conversation patterns.

## Features

- **Message Import**: Upload your LinkedIn messages export (CSV) for analysis
- **Conversation View**: Browse and search through all your LinkedIn conversations
- **AI-Powered Analysis**: Uses OpenAI's GPT-4o-mini to analyze:
  - **Prospect Status**: Automatically categorize prospects (interested, ghosted, meeting scheduled, etc.)
  - **Outreach Quality Score**: Get detailed feedback on your cold outreach effectiveness
- **Analytics Dashboard**: View aggregate metrics including:
  - Response rate
  - Average engagement rate
  - Average response time
  - Outreach score trends
  - Hot prospects list

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Auth**: Supabase Auth with Google OAuth
- **AI**: LangChain.js with OpenAI (gpt-4o-mini)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── analyze/       # Analysis trigger and status endpoints
│   │   ├── conversations/ # Conversation CRUD
│   │   └── users/         # User management
│   ├── auth/              # Auth callback
│   ├── dashboard/         # Main dashboard page
│   └── login/             # Login page
├── components/            # React components
│   ├── layout/           # Layout components (Header, Logo)
│   └── ui/               # Reusable UI components (Avatar, Button, Spinner)
├── hooks/                 # Custom React hooks
│   ├── useAnalysis.ts    # Analysis state and polling
│   └── useConversations.ts # Conversation data management
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client configuration
│   ├── parseMessages.ts  # CSV parsing logic
│   └── utils.ts          # Date formatting utilities
├── server/               # Backend services
│   └── services/         # Business logic
│       └── analysis/     # LLM and metrics services
└── types/                # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key
- Google OAuth credentials (for Supabase Auth)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
```

### Database Setup

1. Create a new Supabase project
2. Run the migrations in order:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_analysis_fields.sql
   supabase/migrations/003_fix_profile_trigger.sql
   supabase/migrations/004_add_profile_insert_policy.sql
   ```
3. Configure Google OAuth in Supabase Authentication settings

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign in** with your Google account
2. **Enter your LinkedIn name** (exactly as it appears on LinkedIn)
3. **Export your messages** from LinkedIn:
   - Go to LinkedIn → Settings → Data Privacy → Get a copy of your data
   - Select "Messages" and download your archive
   - Extract the ZIP and find `messages.csv`
4. **Upload the CSV** file
5. **Click "Analyze"** to start AI analysis
6. **View insights** in the dashboard

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Trigger analysis for pending conversations |
| `/api/analyze/status` | GET | Get analysis progress status |
| `/api/conversations` | GET | List all conversations |
| `/api/conversations/[id]` | GET | Get conversation with messages |

## Analysis Metrics

### Prospect Status Categories
- `no_response` - No reply received
- `engaged` - Active conversation
- `interested` - Positive signals shown
- `meeting_scheduled` - Call/meeting agreed
- `not_interested` - Declined
- `wrong_person` - Redirected elsewhere
- `ghosted` - Stopped responding after engagement
- `closed` - Conversation concluded

### Outreach Score Dimensions (0-100)
- **Personalization** - Research evident in message
- **Value Proposition** - Clear benefit articulated
- **Call to Action** - Clear, low-friction next step
- **Tone** - Professional yet human
- **Brevity** - Concise and respectful
- **Originality** - Genuine vs template feeling

## License

MIT
