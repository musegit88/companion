import db from "@/lib/prismaDb";
import CharacterForm from "../_components/character-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

const CharacterIdPage = async ({
  params,
}: {
  params: { characterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const character = await db.character.findUnique({
    where: {
      id: params.characterId,
      userId,
    },
  });

  const categories = await db.category.findMany();

  return <CharacterForm initialData={character} categories={categories} />;
};

export default CharacterIdPage;
