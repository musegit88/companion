"use client";

import SubscriptionButton from "@/components/subscription-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";
import { useState } from "react";

type SettingMenuProps = {
  isSubscribed: boolean;
};

const SettingsMenu = ({ isSubscribed }: SettingMenuProps) => {
  const [selected, setSelected] = useState<string>("Account");
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className="flex">
            <Settings size={18} />
            <p className="ml-4">Settings</p>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <h2 className="text-left">Settings</h2>
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="flex space-x-8">
            <div className="flex flex-col gap-4">
              <Button
                variant={selected === "Account" ? "default" : "secondary"}
                onClick={() => setSelected("Account")}
              >
                Account
              </Button>
              <Button
                variant={selected === "Preferences" ? "default" : "secondary"}
                onClick={() => setSelected("Preferences")}
              >
                Preferences
              </Button>
            </div>

            <div className="flex-grow">
              {selected === "Account" && (
                <div className="flex flex-col">
                  <h2 className="font-bold">Account</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-md p-2 md:p-4 mt-4">
                    <div className="flex flex-row items-center gap-2 sm:flex sm:flex-col">
                      <p className="text-xs">Your current plan</p>
                      <span className="">{isSubscribed ? "Plus" : "Free"}</span>
                    </div>
                    <SubscriptionButton isSubscribed={isSubscribed} />
                  </div>
                </div>
              )}
              {selected === "Preferences" && (
                <div className="flex flex-col">
                  <h2 className="font-bold">Preferences</h2>
                  <div className="flex flex-col">
                    <p className="text-xs">Theme</p>
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsMenu;
