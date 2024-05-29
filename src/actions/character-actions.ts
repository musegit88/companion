"use server";

import { checkSubscription } from "@/lib/check-subscription";
import db from "@/lib/prismaDb";
import { revalidatePath } from "next/cache";
import { addToSupabase } from "@/lib/add-to-supabase";

type CharacterProps = {
  name: string;
  description: string;
  instructions: string;
  seed: string;
  backgroundstory: string;
  imageUrl: string;
  categoryId: string;
  userId: string | undefined;
  userName: string | null | undefined;
  characterId?: string;
};

type DeleteProps = {
  userId: string | undefined;
  userName: string | null | undefined;
  characterId?: string;
  characterName: string;
};

export const createCharacter = async (data: CharacterProps) => {
  try {
    const {
      name,
      description,
      instructions,
      seed,
      backgroundstory,
      imageUrl,
      categoryId,
      userId,
      userName,
    } = data;

    if (!userId || !userName) {
      return { message: "Unauthorized" };
    }

    const isSubscribed = await checkSubscription();
    if (!isSubscribed) {
      return { message: "Character plus subscription is required" };
    }

    await db.character.create({
      data: {
        userId: userId!,
        userName: userName!,
        name,
        description,
        instructions,
        seed,
        backgroundstory,
        imageUrl,
        categoryId,
      },
    });

    await addToSupabase(backgroundstory, name);

    revalidatePath("/");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const updateCharacter = async (data: CharacterProps) => {
  try {
    const {
      name,
      description,
      instructions,
      seed,
      backgroundstory,
      imageUrl,
      categoryId,
      userId,
      userName,
      characterId,
    } = data;

    if (!characterId) {
      return { message: "something went wrong" };
    }

    if (!userId || !userName) {
      return { message: "Unauthorized" };
    }

    const isSubscribed = await checkSubscription();
    if (!isSubscribed) {
      return { message: "Subscription is required" };
    }

    await db.character.update({
      where: {
        id: characterId,
        userId: userId,
      },
      data: {
        name,
        description,
        instructions,
        seed,
        backgroundstory,
        imageUrl,
        categoryId,
      },
    });
    await addToSupabase(backgroundstory, name);
    revalidatePath("/");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteCharacter = async (data: DeleteProps) => {
  const { userId, userName, characterId, characterName } = data;

  if (!characterId) {
    return { message: "something went wrong" };
  }

  if (!userId || !userName) {
    return { message: "Unauthorized" };
  }

  await db.character.delete({
    where: {
      userId,
      id: characterId,
    },
  });

  revalidatePath("/");
  return { status: "ok" };
};
