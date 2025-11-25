"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import UserDialog from "./user-dialog";
import { Bot } from "lucide-react";

type NavbarProps = {
  isSubscribed: boolean;
};
const Navbar = ({ isSubscribed }: NavbarProps) => {
  const url = typeof window !== "undefined" ? window.location.href : undefined;
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };
  handleLoading();

  return (
    <div className="md:hidden px-4 py-2 border-b dark:bg-[#171717]">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <h4 className="font-semibold text-2xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Companion
          </h4>
        </Link>
        <SignedIn>
          {isLoaded ? (
            <UserDialog
              isInNavbar={true}
              isSubscribed={isSubscribed}
              userImg={user?.imageUrl}
              userEmail={user?.primaryEmailAddress?.emailAddress}
              side="bottom"
            />
          ) : (
            <div className="bg-gray-400 w-8 h-8 rounded-full animate-pulse" />
          )}
        </SignedIn>
        <SignedOut>
          {loading ? (
            <Loading />
          ) : (
            <Button asChild size="sm">
              <SignInButton afterSignInUrl={url} />
            </Button>
          )}
        </SignedOut>
      </div>
    </div>
  );
};

export default Navbar;

const Loading = () => {
  return (
    <div className="bg-gray-400 w-[70px] h-9 rounded-md animate-pulse"></div>
  );
};
