import { StreamableValue } from "ai/rsc";
import { ElementType, ReactNode } from "react";
import { z } from "zod";

export type ChatMessage = {
  id: string;
  createdAt: Date;
  role: "user" | "assistant" | "system" | "function";
  content: string | StreamableValue<string>;
  node?: ReactNode;
};

export type Product = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  image: string;
  price: number;
  gender: string;
  type_id?: number;
  title_v: string;
  description_v: string;
};

export type LLMTool = {
  name: string;
  description: string;
  schema: z.AnyZodObject;
  node: ElementType;
  call: (...args: any[]) => Promise<{ name: string; props: any }>;
};
