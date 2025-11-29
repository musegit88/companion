import db from "@/lib/prismaDb";
import CharacterForm from "../_components/character-form";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

type CharacterPageProps = {
  params: {
    characterId: string;
  };
};

const CharacterIdPage = async ({ params }: CharacterPageProps) => {
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
