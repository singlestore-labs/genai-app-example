import { ChatInput } from "@/components/chat-input";
import { ChatMessageList } from "@/components/chat-message-list";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-4 p-4">
      <ChatMessageList />
      <ChatInput />
    </main>
  );
}
