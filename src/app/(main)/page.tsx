import Categories from "@/components/categories";
import CharacterCard from "@/components/character-card";
import CharacterCardSkeleton from "@/components/character-card-skeleton";
import SearchInput from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import db from "@/lib/prismaDb";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: {
    categoryId: string;
    name: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const getCategories = async () => {
    return db.category.findMany();
  };

  const getCharacters = async () => {
    return db.character.findMany({
      where: {
        categoryId: searchParams.categoryId,
        name: {
          startsWith: searchParams.name,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });
  };
  const characters = await getCharacters();

  return (
    <div>
      <div className="flex justify-end items-center md:justify-between px-4 mb-2">
        <SearchInput />
      </div>
      <Suspense
        fallback={
          <div className="flex w-full overflow-x-auto space-x-2 p-1">
            <Skeleton className="w-28 h-10" />
            <Skeleton className="w-28 h-10" />
            <Skeleton className="w-28 h-10" />
            <Skeleton className="w-28 h-10" />
            <Skeleton className="w-28 h-10" />
          </div>
        }
      >
        <CategorySuspense categoriesFeatcher={getCategories} />
      </Suspense>
      {characters.length === 0 && (
        <div className="flex items-center justify-center pt-14">
          No result found
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full min-w-36 justify-items-start my-4">
        <Suspense
          fallback={
            <>
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
              <CharacterCardSkeleton />
            </>
          }
        >
          <CharacterSuspense characterFeatcher={getCharacters()} />
        </Suspense>
      </div>
    </div>
  );
}

const CharacterSuspense = async ({
  characterFeatcher,
}: {
  characterFeatcher: Promise<any>;
}) => {
  return (await characterFeatcher).map((character: any) => (
    <>
      <CharacterCard key={character.id} character={character} />
    </>
  ));
};

const CategorySuspense = async ({
  categoriesFeatcher,
}: {
  categoriesFeatcher: () => Promise<any>;
}) => {
  const categories = await categoriesFeatcher();
  return <Categories data={categories} />;
};
