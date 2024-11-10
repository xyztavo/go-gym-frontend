import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import ReactQueryProvider from "@/utils/react-query-provider";

export const metadata: Metadata = {
  title: "Go Gym",
  description: "This a next frontend for my go gym backend app",
};
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className={`${inter.className} antialiased`}>
            <Navbar />
            {children}
            <Toaster />
          </body>
        </ThemeProvider>
      </ReactQueryProvider>
    </html>
  );
}
