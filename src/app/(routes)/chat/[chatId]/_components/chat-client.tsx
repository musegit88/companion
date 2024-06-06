"use client";

import { Character, Message } from "@prisma/client";
import ChatHeader from "./chat-header";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "./chat-form";
import ChatMessages from "./chat-messages";

type ChatClientProps = {
  character: Character & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
};

export type MessageProps = {
  id: string;
  role: "system" | "user";
  content?: string;
  isLoading?: boolean | undefined;
  imageUrl?: string | undefined;
};

const ChatClient = ({ character }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageProps[]>(character.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${character.id}`,
      onFinish(prompt, completion) {
        const systemMessage: MessageProps = {
          id: crypto.randomUUID(),
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
      streamMode: "text",
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: MessageProps = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col  p-4 space-y-4 h-screen">
      <ChatHeader character={character} />
      <ChatMessages
        character={character}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
