# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Companion web app using Next.js 15 App Router where users chat with AI characters. Characters have backstory/instructions that inform LLM responses, with conversation history stored in Upstash Redis and semantic search powered by Supabase Vector DB.

## Commands

```bash
npm run dev      # Start dev server (requires --experimental-https flag)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run postinstall  # Runs prisma generate (auto-runs after npm install)
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database**: PostgreSQL via Prisma
- **Vector DB**: Supabase Vector Store + OpenAI Embeddings
- **Chat History**: Upstash Redis
- **AI Model**: Cloudflare Workers AI (`meta/llama-2-7b-chat-int8`)
- **Streaming**: Vercel AI SDK (`ai` package)
- **Payments**: Stripe
- **File Storage**: Uploadthing
- **UI**: shadcn/ui + Radix UI + Tailwind CSS

## Architecture

### Route Groups
- `src/app/(auth)/` — Clerk auth pages (sign-in, sign-up)
- `src/app/(routes)/` — Main app routes with Navbar + Sidebar layout
- `src/app/api/` — API routes including `/api/chat/[chatId]` for streaming LLM responses

### Key Libraries
- `src/lib/prismaDb.ts` — Prisma client singleton for database access
- `src/lib/memory.ts` — MemoryManager class: Redis for chat history, Supabase Vector DB for semantic search
- `src/lib/rate-limit.ts` — Upstash rate limiting
- `src/actions/character-actions.ts` — Server actions for CRUD on characters

### Chat Flow
1. User sends message → `chat-client.tsx` uses `useCompletion` from AI SDK
2. POST to `/api/chat/[chatId]/route.ts`
3. Rate limit check via Upstash
4. Save user message to Prisma
5. Load recent chat history from Upstash Redis
6. Query Supabase Vector DB for relevant context
7. Call Cloudflare Workers AI API with system prompt + context
8. Stream response back via `StreamingTextResponse`
9. Save AI response to Prisma and Upstash

### Subscription Gate
Character creation/update requires active Stripe subscription. `checkSubscription()` validates `stripeCurrentPeriodEnd + 1 day > now()`.

### Prisma Schema
Models: `Category`, `Character`, `Message`, `UserSubscription`. The `documents` table in Supabase stores vector embeddings for character background stories.
