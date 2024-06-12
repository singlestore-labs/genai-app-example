"use client";

import { readStreamableValue } from "ai/rsc";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";

import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ChatMessageCard({ content, role, createdAt, node }: ChatMessage) {
  const [activeContent, setActiveContent] = useState<string>(typeof content === "string" ? content : "");

  useEffect(() => {
    (async () => {
      if (typeof content === "object") {
        let value = "";
        for await (const token of readStreamableValue(content)) {
          setActiveContent((value += token));
        }
      }
    })();
  }, [content]);

  return (
    <Card className={cn("max-w-[75%] py-2", role === "user" ? "ml-auto" : "mr-auto")}>
      <div className="flex items-center justify-between gap-2 px-4">
        <h4 className="font-medium first-letter:uppercase">{role}</h4>
        <time
          className="ml-auto text-right text-xs text-muted-foreground"
          dateTime={createdAt.toLocaleString()}
        >
          {createdAt.toLocaleTimeString("en-US", { hour12: false })}
        </time>
      </div>

      {activeContent && (
        <div className="w-full max-w-full px-4 [&_pre]:overflow-auto">
          <Markdown>{activeContent}</Markdown>
        </div>
      )}

      {node && <div className="mt-2">{node}</div>}
    </Card>
  );
}
