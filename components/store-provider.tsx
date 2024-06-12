import { Provider } from "jotai";
import { ReactNode } from "react";

import { ChatMessage } from "@/types";
import { db } from "@/lib/db";
import { llmTools } from "@/lib/llm-tools";
import { StoreHydrate } from "@/components/store-hydrate";

export async function StoreProdiver({ children }: { children?: ReactNode }) {
  const chatMessageRows = await db.controllers.findMany<
    (Pick<ChatMessage, "id" | "role"> & { created_at: number; content: string })[]
  >({ collection: "chat_messages", extra: "ORDER BY created_at DESC" });

  const chatMessages = chatMessageRows.map((message) => {
    let node: ChatMessage["node"] | undefined = undefined;

    let content;
    try {
      content = JSON.parse(message.content);
    } catch (error) {
      content = message.content;
    }

    const isToolResult = typeof content === "object" && "name" in content && "props" in content;

    if (isToolResult) {
      const tool = llmTools[content.name];
      if (tool.node) node = <tool.node {...content.props} />;
    }

    return {
      id: message.id.toString(),
      createdAt: new Date(message.created_at),
      role: message.role,
      content: !isToolResult ? content : "",
      node,
    } satisfies ChatMessage;
  });

  return (
    <Provider>
      <StoreHydrate chatMessages={chatMessages}>{children}</StoreHydrate>
    </Provider>
  );
}
