"use client";

import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";
import { ChatMessageCard } from "@/components/chat-message-card";
import { Card } from "@/components/ui/card";
import { chatMessagesAtom } from "@/atoms/chat-messages";

export function ChatMessageList() {
  const messages = useAtomValue(chatMessagesAtom);

  return (
    <Card className="relative w-full flex-1">
      <div className="absolute left-0 top-0 flex h-full w-full flex-col-reverse overflow-y-auto overflow-x-hidden p-4">
        <ul className="relative flex w-full flex-col-reverse">
          {messages.map((message, i, arr) => {
            const isSameRole = message.role === arr[i + 1]?.role;

            return (
              <li
                key={message.id}
                className={cn(isSameRole ? "mt-2" : "mt-8", "flex w-full max-w-full last:mt-0")}
              >
                <ChatMessageCard {...message} />
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
