import db from "@/lib/prismaDb";
import CharacterForm from "../_components/character-form";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { characterId: string };
}): Promise<Metadata> {
  const { characterId } = await params;
  const character = await db.character.findUnique({
    where: {
      id: characterId,
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
    title: `${character?.name}`,
    keywords: [
      `${character?.name} ai companion,${character?.name} ai Chatbot,${character?.name} ai, ${character?.name},${character?.category.name} ai companion,${character?.category.name} ai chatbot`,
    ],
    openGraph: {
      title: `${character?.name} AI companion`,
      description: `Edit ${character?.name} AI companion`,
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
      description: `Edit ${character?.name} AI companion`,
      images: [`${character?.imageUrl as string}`],
    },
  };
}

const CharacterIdPage = async ({
  params,
}: {
  params: { characterId: string };
}) => {
  const { userId, redirectToSignIn } = await auth();
  const { characterId } = await params;

  if (!userId) {
    return redirectToSignIn();
  }

  const character = await db.character.findUnique({
    where: {
      id: characterId,
      userId,
    },
  });

  const categories = await db.category.findMany();

  return <CharacterForm initialData={character} categories={categories} />;
};

export default CharacterIdPage;
