import { Inter } from "next/font/google";

import type { Metadata } from "next";

import { StoreProdiver } from "@/components/store-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GenAI App Example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProdiver>{children}</StoreProdiver>
      </body>
    </html>
  );
}
