"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  userImage?: string;
  userName?:string | null
};

const UserAvatar = ({ userImage, userName }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={userImage} />
      <AvatarFallback className="bg-cyan-400 text-white">{userName?.slice(0,1)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
