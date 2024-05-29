"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type BotAvatarProps = {
  image: string;
};

const BotAvatar = ({ image }: BotAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={image} className="object-cover" />
      <AvatarFallback className="bg-gray-400 animate-pulse"></AvatarFallback>
    </Avatar>
  );
};

export default BotAvatar;
