"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { SendHorizonal } from "lucide-react";
import { nanoid } from "nanoid";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { ChatMessage } from "@/types";
import { submitChatMessage } from "@/actions/submit-chat-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField, FormItem, FormControl, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chatMessagesAtom } from "@/atoms/chat-messages";

const chatInputFormSchema = z.object({
  content: z.string().min(1).max(1024),
});

export type ChatInputFormSchema = z.infer<typeof chatInputFormSchema>;

export function ChatInput() {
  const setMessages = useSetAtom(chatMessagesAtom);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChatInputFormSchema>({
    resolver: zodResolver(chatInputFormSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit: SubmitHandler<ChatInputFormSchema> = async ({ content }) => {
    try {
      setMessages((i) => [
        { id: nanoid(), role: "user", content, createdAt: new Date() } satisfies ChatMessage,
        ...i,
      ]);

      const message = await (() => {
        return new Promise<ChatMessage>((resolve) => {
          startTransition(async () => {
            resolve(await submitChatMessage(content));
          });
        });
      })();

      setMessages((i) => [message, ...i]);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="relative w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="content"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="pr-12"
                    placeholder="Message"
                    autoFocus
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-bl-none rounded-tl-none"
            disabled={isPending}
          >
            <SendHorizonal className="w-[1em]" />
          </Button>
        </form>
      </Form>
    </Card>
  );
}
