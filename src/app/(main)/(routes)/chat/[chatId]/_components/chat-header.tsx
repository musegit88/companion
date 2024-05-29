"use client";

import AlertModal from "@/components/alert-modal";
import BotAvatar from "@/components/bot-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlertModal } from "../../../../../../../hooks/useAlertModal";
import { useUser } from "@clerk/nextjs";
import { Character, Message } from "@prisma/client";
import { Edit, MessageSquareText, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

type ChatHeaderProps = {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
};

const ChatHeader = ({ character }: ChatHeaderProps) => {
  const { user } = useUser();
  const router = useRouter();
  const alertModal = useAlertModal();

  return (
    <>
      <AlertModal characterId={character.id} characterName={character.name} />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-2">
          <BotAvatar image={character.imageUrl} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold line-clamp-1 whitespace-normal overflow-hidden">
                {character.name}
              </p>
              <div className="flex items-center">
                <MessageSquareText
                  size={14}
                  className="text-muted-foreground mr-1"
                />
                <p className="text-xs text-muted-foreground">
                  {character._count.messages}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              by @{character.userName}
            </p>
          </div>
        </div>
        {user?.id === character.userId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Button variant="outline">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-[#171717]">
              <DropdownMenuItem
                onClick={() => router.push(`/character/${character.id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alertModal.onOpen()}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
};

export default ChatHeader;
