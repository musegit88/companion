# 🤖AI Companion Web App

Welcome to the AI Companion Web App! This project leverages advanced AI technology and a robust stack to provide a comprehensive, interactive, and user-friendly experience. The application is built using Next.js, integrates the Meta LLaMA-2-70b-chat model for conversational AI, and utilizes various other modern tools and services.

Inspiration [`a16z-infra`](https://github.com/a16z-infra/companion-app/blob/main/README.md?plain=1), [`Character.ai`](https://beta.character.ai/)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#gettingstarted)
- [Contributing](#contributing)

## Features

- Interactive Chat Interface: Engage in conversations with an advanced AI model.
- Dynamic Data Handling: Utilize Supabase Postgres for structured data storage.
- Efficient Querying: Leverage Supabase Vector Database and OpenAI Embeddings for fast and relevant information retrieval.
- File Storage: Manage uploads with Uploadthing for efficient storage solutions.
- Payment Processing: Seamless payment integration using Stripe.
- ORM: Simplified database interactions with Prisma.

## Technologies Used

- Auth: [Clerk](https://clerk.com/)
- React Framework: [Next.js](https://nextjs.org/)
- UI Components: [shadcn](https://ui.shadcn.com)
- Database: [Supabase](https://supabase.com/)
- Vector Database: [Supabase Vector Database](https://supabase.com/)
- Embeddings Model: [OpenAI Text-embedding-ada-002-v2](https://openai.com/)
- LLM orchestration: [Langchain.js](https://js.langchain.com/docs/)
- AI Model: [Cloudflare (meta/llama-2-7b-chat-int8)](https://developers.cloudflare.com/workers-ai/models/)
- Text Streaming: [ai sdk](https://github.com/vercel-labs/ai)
- Conversation history: [Upstash](https://upstash.com/)
- File Storage: [Uploadthing](https://Uploadthing.com/)
- Payment: [Stripe](https://stripe.com/)
- Deployment: [Vercel](https://vercel.com/)

## GettingStarted

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account and project
- Uploadthing account
- Stripe account
- OpenAI account

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/ai-companion-webapp.git
cd ai-companion-webapp
```

2. Install dependencies:

```
npm install
```

or if you're using yarn:

```
yarn install
```

### Configuration

1. Environment Variables:
   Create a .env.local file in the root directory and add the following environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key
   CLERK_SECRET_KEY="your_clerk_secret_key"
   SUPABASE_URL="your_supabase_url"
   SUPABASE_PRIVATE_KEY="your_supabase_private_key"
   UPSTASH_REDIS_REST_URL="your_upstash_url"
   UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"
   DATABASE_URL="your_supabase__database_url"
   OPENAI_API_KEY="your_openai_api_key"
   WORKERS_AI_API_TOKEN="your_workers_ai_api_key"
   CLOUDFLARE_ACCOUNT_ID="your_cloudflare_account_id"
   STRIPE_API_KEY="your_stripe_api_key"
   STRIPE_WEBHOOK_SECRET="our_stripe_webhook_secret"
   ```
2. Clerk Setup: [https://clerk.com/docs/quickstarts/nextjs](https://clerk.com/docs/quickstarts/nextjs)
3. Supabase Setup:[Set up your Supabase database and vector database according to the project's needs. Refer to the Supabase documentation for detailed instructions.](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
4. Uploadthing Setup: [Configure your Uploadthing storage settings as per the documentation provided by Uploadthing.](https://docs.uploadthing.com/getting-started/appdir)

### Running the Application

1. Development Mode:

```
npm run dev
```

or with yarn:

```
yarn dev
```

2. Production Mode:

```
npm run build
npm start
```

or with yarn:

```
yarn build
yarn start
```

## Contributing

1. Fork the repository.

2. Create a new branch `git checkout -b feature/your-feature`.

3. Commit your changes `git commit -am 'Add some feature'`.

4. Push to the branch `git push origin feature/your-feature`.

5. Open a Pull Request.
