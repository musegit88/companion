"use client";

import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";

type ChatFormProps = {
  input: string;
  isLoading: boolean;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
};

const ChatForm = ({
  input,
  isLoading,
  handleInputChange,
  onSubmit,
}: ChatFormProps) => {
  return (
    <>
      <form onSubmit={onSubmit} className="flex items-center gap-x-2 pt-4">
        <div className="flex w-full max-w-2xl mx-auto border p-2 rounded-xl">
          <Input
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Type a message"
            className="border-none outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
          />
          <Button disabled={!input || isLoading} variant="ghost">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
      <span className="text-center text-[10px] sm:text-xs">
        AI can make mistakes.Everything Companions say is made up!
      </span>
    </>
  );
};

export default ChatForm;
