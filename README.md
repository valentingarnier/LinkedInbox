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