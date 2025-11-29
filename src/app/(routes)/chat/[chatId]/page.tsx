import db from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatClient from "./_components/chat-client";
import { Metadata } from "next";

type Params = Promise<{
  chatId: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { chatId } = await params;

  const character = await db.character.findUnique({
    where: {
      id: chatId,
    },
    include: {
      category: true,
    },
  });
  if (!character) {
    return {
      title: "Character Not Found",
      description: "Character Not Found",
    };
  }
  return {
    title: `Chat with ${character?.name}`,
    keywords: [
      `${character?.name} ai companion,${character?.name} ai Chatbot,${character?.name} ai, ${character?.name},${character?.category.name} ai companion,${character?.category.name} ai chatbot`,
    ],
    openGraph: {
      title: `${character?.name} AI companion`,
      description: `chat with ${character?.name}`,
      url: "https://ai-companions-alpha.vercel.app",
      images: [
        {
          url: character?.imageUrl as string,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${character?.name} AI companion`,
      description: `chat with ${character?.name}`,
      images: [`${character?.imageUrl as string}`],
    },
  };
}

const page = async ({ params }: { params: Params }) => {
  const { userId } = await auth();
  const { chatId } = await params;

  if (!userId) {
    return redirect("/sign-in");
  }

  const character = await db.character.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        where: {
          userId,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!character) {
    return redirect("/");
  }

  return (
    <>
      <ChatClient character={character} />
    </>
  );
};

export default page;
