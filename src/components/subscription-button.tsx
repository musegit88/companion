"use client";

import { Plus, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type SubscriptionButtonProps = {
  isSubscribed: boolean;
};

const SubscriptionButton = ({
  isSubscribed = false,
}: SubscriptionButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe");
      const data = await response.json();
      router.push(data.url);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant={isSubscribed ? "default" : "plus"}
      className="flex items-center text-xs sm:text-sm"
    >
      {isSubscribed ? "Manage subscription" : "Upgrade"}
      {isSubscribed ? (
        <SquareArrowOutUpRight size={20} className="ml-2" />
      ) : (
        <Plus size={20} className="ml-2" />
      )}
    </Button>
  );
};

export default SubscriptionButton;
