"use client";

import { Contrast, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 my-4">
      <Button
        variant={theme == "light" ? "default" : "outline"}
        className={cn("flex items-center", theme === "light")}
        onClick={() => setTheme("light")}
      >
        <Sun />
        <p className="ml-2">Light</p>
      </Button>
      <Button
        variant={theme == "dark" ? "default" : "outline"}
        className="flex items-center"
        onClick={() => setTheme("dark")}
      >
        <Moon />
        <p className="ml-2">Dark</p>
      </Button>
      <Button
        variant={theme == "system" ? "default" : "outline"}
        className="flex items-center"
        onClick={() => setTheme("system")}
      >
        <Contrast />
        <p className="ml-2">System</p>
      </Button>
    </div>
  );
}
