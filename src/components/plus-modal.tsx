"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePlusModal } from "../../hooks/usePlusModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const PlusModal = () => {
  const plusModal = usePlusModal();
  const router = useRouter();
  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/stripe");
      const data = await response.json();
      router.push(data.url);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <Dialog open={plusModal.isOpen} onOpenChange={plusModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            Upgrade to CompanionPlus
          </DialogTitle>
          <DialogDescription>
            Create <span className="text-cyan-500 mx-1">Custom AI</span>{" "}
            Companion
          </DialogDescription>
          <Separator />
          <div className="flex justify-between">
            <p className="text-2xl">
              $12<span className="text-sm font-normal">.99 / mo</span>
            </p>
            <Button variant="plus" onClick={handleSubscribe}>
              Subscribe
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlusModal;
