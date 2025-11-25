"use client";

import { Category } from "@prisma/client";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type CategoriesProps = {
  data: Category[];
};

const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");

  const handleClick = (id: string | undefined) => {
    const query = {
      categoryId: id,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };

  return (
    <div className="flex w-full overflow-x-auto space-x-2 p-1">
      <Button
        size="sm"
        onClick={() => handleClick(undefined)}
        className={cn(
          categoryId == undefined && "bg-slate-400 hover:bg-slate-400"
        )}
      >
        All
      </Button>
      {data?.map((category) => (
        <Button
          size="sm"
          key={category.id}
          onClick={() => handleClick(category.id)}
          className={cn(
            category.id === categoryId && "bg-slate-400 hover:bg-slate-400"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
