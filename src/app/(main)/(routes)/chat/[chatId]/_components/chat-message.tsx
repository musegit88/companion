"use client";

import { BeatLoader } from "react-spinners";
import BotAvatar from "@/components/bot-avatar";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import UserAvatar from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export type ChatMessageProps = {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  imageUrl?: string;
};

const ChatMessage = ({
  role,
  content,
  isLoading,
  imageUrl,
}: ChatMessageProps) => {
  const { user } = useUser();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) {
      return;
    }
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-4 w-full py-4",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && imageUrl && <BotAvatar image={imageUrl} />}
      <div
        className={cn(
          "text-xs sm:text-sm max-w-sm px-4 py-2 border shadow-md rounded-md",
          role === "user"
            ? "rounded-tr-[2px] rounded-tl-lg rounded-bl-lg rounded-br-lg"
            : "rounded-tl-[2px] rounded-tr-lg rounded-bl-lg rounded-br-lg"
        )}
      >
        {isLoading ? (
          <BeatLoader color={theme === "light" ? "black" : "white"} size={4} />
        ) : (
          content
        )}
      </div>
      {role === "user" && (
        <UserAvatar userImage={user?.imageUrl} userName={user?.username} />
      )}
      {role !== "user" && !isLoading && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          <Clipboard className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatMessage;
