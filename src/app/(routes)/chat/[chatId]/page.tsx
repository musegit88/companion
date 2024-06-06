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
  });
  return {
    title: `Chat with ${character?.name}`,
    keywords: [`${character?.name} AI companion,${character?.name} AI Chatbot`],
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
