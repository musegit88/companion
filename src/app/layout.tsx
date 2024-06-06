import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import PlusModal from "@/components/plus-modal";
import { ThemeProvider } from "@/components/theme-provider";
import ToastProvider from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Companion",
  description: "Your personal AI companion",
  keywords: [
    "AI Companion",
    "AI Chatbot",
    "Virtual Assistant",
    "Conversational AI",
    "Intelligent Chat",
    "Chat AI",
    "AI Interaction",
    "AI Conversation",
    "Smart Assistant",
    "AI Engagement",
    "LLaMA-2-70b-chat",
    "AI Powered Chat",
    "AI Communication",
    "Interactive AI",
    "AI Dialog",
    "AI Helper",
    "AI Interface",
    "User-Friendly AI",
    "AI Integration",
    "AI Services",
    "Next.js AI App",
    "React AI App",
    "AI Chat Interface",
    "AI Personal Assistant",
    "AI for Web",
    "AI Technology",
    "Online AI Companion",
    "AI Chat Service",
    "Advanced AI Chat",
  ],
  authors: [{ name: "M4 Dev" }],
  creator: "M4 Dev",
  openGraph: {
    url: "https://ai-companions-alpha.vercel.app",
    siteName: "Companion",
    images: [
      {
        url: "https://utfs.io/f/8f1a9657-bce1-47f2-b07c-3172c25d7ff6-7jkpqi.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("min-h-screen", inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <PlusModal />
            <main>
              <ToastProvider />
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
