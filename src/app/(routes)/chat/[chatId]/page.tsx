import db from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatClient from "./_components/chat-client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { chatId: string };
}): Promise<Metadata> {
  const character = await db.character.findUnique({
    where: {
      id: params.chatId,
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

const page = async ({ params }: { params: { chatId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const character = await db.character.findUnique({
    where: {
      id: params.chatId,
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
