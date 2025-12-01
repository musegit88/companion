"use client";

import { Category } from "@prisma/client";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

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
      <Badge
        onClick={() => handleClick(undefined)}
        className={cn(
          "bg-accent border-input text-black dark:text-white cursor-pointer",
          categoryId == undefined && "border-black dark:border-white"
        )}
      >
        All
      </Badge>
      {data?.map((category) => (
        <Badge
          key={category.id}
          onClick={() => handleClick(category.id)}
          className={cn(
            "bg-accent border-input text-black dark:text-white cursor-pointer",
            category.id === categoryId && "border-black dark:border-white"
          )}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
};

export default Categories;
