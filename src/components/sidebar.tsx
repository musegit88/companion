"use client";

import { Bot, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

import UserDialog from "./user-dialog";
import { usePlusModal } from "../../hooks/usePlusModal";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isSubscribed: boolean;
};

const Sidebar = ({ isSubscribed }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const url = typeof window !== "undefined" ? window.location.href : undefined;
  const plusModal = usePlusModal();
  const handleClick = (url: string) => {
    if (!isSubscribed) {
      return plusModal.onOpen();
    }

    return router.push(url);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div
        className="hidden md:block absolute top-4 left-4 cursor-pointer z-[999]"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
      </div>
      <div
        className={cn(
          "hidden md:block transition-transform duration-300 ease",
          isSidebarOpen ? "w-64 transition-[width]" : "w-0 transition-[width]"
        )}
      >
        <div className="w-full dark:bg-[#171717] overflow-x-hidden">
          <div className="h-full border-r">
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <div className="pl-5 pt-14 w-full">
                <Link href="/" className="flex items-center">
                  <h4 className="font-semibold text-2xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Companion
                  </h4>
                </Link>
              </div>
              <div className="flex flex-col grow overflow-hidden mt-4">
                <div className="w-full px-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 rounded-full shadow-md"
                    onClick={() => handleClick("/character/new")}
                  >
                    <Plus size={24} />
                    <p>Create</p>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-end px-4 pb-4">
                <div className="flex flex-col gap-2 w-full">
                  <SignedIn>
                    <>
                      {!isSubscribed ? (
                        <Button
                          onClick={() => plusModal.onOpen()}
                          variant="outline"
                          size="lg"
                          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                        >
                          Upgrade to Companion+
                        </Button>
                      ) : (
                        ""
                      )}

                      {isLoaded ? (
                        <UserDialog
                          isSubscribed={isSubscribed}
                          isInNavbar={false}
                          userImg={user?.imageUrl}
                          userEmail={user?.primaryEmailAddress?.emailAddress}
                          userName={user?.username!}
                          side="top"
                        />
                      ) : (
                        <div className="flex items-center gap-2 w-full dark:bg-[#212121] px-4 py-2 rounded-md border shadow-md">
                          <div className="bg-gray-400 w-8 h-8 rounded-full animate-pulse" />
                          <p className="bg-gray-400 w-24 h-4 rounded-full animate-pulse"></p>
                        </div>
                      )}
                    </>
                  </SignedIn>
                  <SignedOut>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      <SignInButton afterSignInUrl={url} />
                    </Button>
                    <Button asChild className="w-full rounded-2xl">
                      <SignUpButton afterSignInUrl={url} />
                    </Button>
                  </SignedOut>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
