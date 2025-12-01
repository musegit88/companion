import Image from "next/image";
import { Character } from "@prisma/client";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";

export type CharacterProps = {
  character: Character & {
    _count: {
      messages: number;
    };
  };
};

const CharacterCard = ({ character }: CharacterProps) => {
  return (
    <div className="relative rounded-md w-full h-64 shadow-lg overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src={character.imageUrl}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="aspect-video object-cover hover:scale-y-105 hover:scale-x-105 hover:origin-center"
        />
      </div>
      <div className="absolute bg-slate-800/40 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between w-full p-2 text-white">
        <div className="flex items-center justify-between h-full">
          <div>
            <Link
              href={`/chat/${character.id}`}
              className="font-bold line-clamp-1"
            >
              {character.name}
            </Link>
            <p className="text-xs line-clamp-1">{character.description}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-end">
              <MessageSquareText className="w-4 h-4 mr-1" />
              <p className="text-xs">{character._count.messages}</p>
            </div>
            <p className="text-xs whitespace-nowrap">
              by @{character.userName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
