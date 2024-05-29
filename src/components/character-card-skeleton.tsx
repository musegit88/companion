import React from "react";
import { Skeleton } from "./ui/skeleton";

const CharacterCardSkeleton = () => {
  return (
    <Skeleton className="relative rounded-md w-full bg-gray-500 h-64 shadow-lg overflow-hidden" />
  );
};

export default CharacterCardSkeleton;
