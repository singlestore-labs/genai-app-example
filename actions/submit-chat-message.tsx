"use server";

import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { nanoid } from "nanoid";
import { createElement } from "react";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatMessage } from "@/types";
import { db } from "@/lib/db";
import { llm } from "@/lib/llm";
import { llmTools } from "@/lib/llm-tools";

// Helper function to insert a message into the db
function insertChatMessage({ role, content }: Pick<ChatMessage, "role" | "content">) {
  return db.controllers.insertOne({
    collection: "chat_messages",
    value: { role, content: JSON.stringify(content), created_at: new Date().getTime() },
  });
}

export async function submitChatMessage(content: string) {
  // The text stream that is used to stream the LLM text response to the client
  const textStream: ReturnType<typeof createStreamableValue<string>> = createStreamableValue("");

  // The initial LLM response message
  const message: ChatMessage = {
    id: nanoid(),
    role: "assistant",
    content: textStream.value,
    createdAt: new Date(),
  };

  // The node steram that is used to stream React nodes to the client
  const nodeStream = createStreamableUI();

  (async () => {
    try {
      const [completionStream] = await Promise.all([
        // The create chat completion call with tools that returns a completion steram
        llm.chat.completions.create({
          model: "gpt-4o",
          temperature: 0,
          stream: true,
          messages: [
            { role: "system", content: "You are an assistant" },
            { role: "user", content },
          ],
          // The tools normalization for the llm accepted format
          tools: Object.values(llmTools).map(({ name, description, schema }) => ({
            type: "function",
            function: { name, description, parameters: zodToJsonSchema(schema) },
          })),
        }),

        // The user message inserting
        insertChatMessage({ role: "user", content }),
      ]);

      // The pasered tool name that should be called
      let completionToolName = "";
      // The pasered tool args that should be provided to a tool call function
      let completionToolArgs = "";
      // The simple text response
      let completionContent = "";

      // The completion stream chunking
      for await (const chunk of completionStream) {
        const tool = chunk.choices[0].delta.tool_calls?.[0]?.function;
        const textToken = chunk.choices[0].delta.content || "";

        // Assigning tool-related data
        if (tool) {
          if (tool?.name) completionToolName = tool.name;
          if (tool?.arguments) completionToolArgs += tool.arguments;
        }

        // Updating the textStream on the new text response
        if (textToken) {
          completionContent += textToken;
          textStream.update(textToken);
        }
      }

      await Promise.all([
        // Inserting a message with the completion content into the db
        (async () => {
          if (!completionContent) return;
          return insertChatMessage({
            role: "assistant",
            content: JSON.stringify(completionContent),
          });
        })(),

        // Calls the tool provided by the LLM and updates the nodeStream with the new React node
        (async () => {
          if (!completionToolName) return;
          const tool = llmTools[completionToolName as keyof typeof llmTools];
          if (!tool) return;
          const args = JSON.parse(completionToolArgs);
          const result = await tool.call(args);
          const node = result.props ? createElement(tool.node, result.props) : undefined;

          await Promise.all([
            nodeStream.update(node),
            insertChatMessage({
              role: "function",
              content: JSON.stringify(result),
            }),
          ]);
        })(),
      ]);
    } catch (error) {
      console.error(error);
    }

    textStream.done();
    nodeStream.done();
  })();

  return { ...message, node: nodeStream.value };
}
