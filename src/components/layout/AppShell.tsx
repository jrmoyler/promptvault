"use client";

import Sidebar from "./Sidebar";
import Toast from "@/components/ui/Toast";
import PromptModal from "@/components/prompts/PromptModal";
import { useAppStore, useSidebarOpen } from "@/store/useAppStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useSidebarOpen();
  const closeSidebar = useAppStore((s) => s.closeSidebar);

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      {/* Sidebar — fixed panel on lg+, slide-in drawer on mobile */}
      <Sidebar />

      {/* Mobile backdrop — dims content when drawer is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-bg/70 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content — full width on mobile, offset by sidebar on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {children}
      </div>

      <PromptModal />
      <Toast />
    </div>
  );
}
