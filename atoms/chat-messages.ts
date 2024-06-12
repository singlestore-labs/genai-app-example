import { atom } from "jotai";

import { ChatMessage } from "@/types";

export const chatMessagesAtom = atom<ChatMessage[]>([]);
