"ues client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  ChevronUp,
  LogOut,
  PlusSquare,
  Settings,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import SettingsMenu from "@/components/settings";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserDialogProps = {
  userEmail?: string;
  userImg?: string;
  userName?: string;
  side?: "top" | "bottom" | "left" | "right";
  isSubscribed: boolean;
  isInNavbar: boolean;
};

const UserDialog = ({
  userEmail,
  userImg,
  userName,
  side,
  isSubscribed,
  isInNavbar,
}: UserDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={() => setOpen((prev) => !prev)}>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center px-4 py-2 rounded-md shadow-md border">
          <div className="flex items-center gap-2 w-full ">
            <div className="relative w-8 h-8 overflow-hidden">
              <Image
                src={userImg!}
                alt=""
                fill
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <p className="text-sm text-ellipsis line-clamp-1 whitespace-normal">
              {userName}
            </p>
          </div>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align="center"
        className="mb-2 w-56 dark:bg-[#171717]"
      >
        <DropdownMenuItem>
          <p>{userEmail}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isInNavbar && (
          <DropdownMenuItem>
            <PlusSquare size={18} />
            <Link href={"/character/new"} className="ml-4">
              Create
            </Link>
          </DropdownMenuItem>
        )}

        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <SettingsMenu isSubscribed={isSubscribed} />
        </div>
        <SignOutButton redirectUrl="/">
          <DropdownMenuItem>
            <LogOut size={18} />
            <p className="ml-4">Log out</p>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDialog;
