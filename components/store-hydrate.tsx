"use client";

import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";

import { ChatMessage } from "@/types";
import { chatMessagesAtom } from "@/atoms/chat-messages";

export function StoreHydrate({
  children,
  chatMessages,
}: {
  children?: ReactNode;
  chatMessages: ChatMessage[];
}) {
  useHydrateAtoms([[chatMessagesAtom, chatMessages]]);

  return children;
}
