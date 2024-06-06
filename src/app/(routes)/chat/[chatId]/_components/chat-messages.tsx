"use client";

import { Character } from "@prisma/client";
import ChatMessage from "./chat-message";
import { ElementRef, useEffect, useRef, useState } from "react";
import { MessageProps } from "./chat-client";

type ChatMessagesProps = {
  character: Character;
  isLoading: boolean;
  messages: MessageProps[];
};

const ChatMessages = ({
  character,
  isLoading,
  messages = [],
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null);

  const [firstLoading, setFirstLoading] = useState(
    messages.length === 0 ? true : false
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    // First message loader
    const timeout = setTimeout(() => setFirstLoading(false), 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={firstLoading}
        content={`Hello, I am ${character.name}, ${character.description}.`}
        imageUrl={character.imageUrl}
        role="system"
      />
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          imageUrl={character.imageUrl}
          role={message.role}
        />
      ))}
      {isLoading && (
        <ChatMessage isLoading role="system" imageUrl={character.imageUrl} />
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessages;
