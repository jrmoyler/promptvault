import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "PromptVault — Team AI Prompt Library",
  description:
    "5,000+ curated AI prompts for Claude, ChatGPT, Gemini, Midjourney, and 38 other tools. Browse, filter, and copy the best prompts for your team.",
  keywords: ["AI prompts", "Claude", "ChatGPT", "Gemini", "Midjourney", "prompt library"],
  authors: [{ name: "PromptVault Team" }],
  openGraph: {
    title: "PromptVault — Team AI Prompt Library",
    description: "5,000+ curated AI prompts for your team",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
