"use client";

import Sidebar from "./Sidebar";
import Toast from "@/components/ui/Toast";
import PromptModal from "@/components/prompts/PromptModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        {children}
      </div>
      <PromptModal />
      <Toast />
    </div>
  );
}
