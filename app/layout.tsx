import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import ReactQueryProvider from "@/utils/react-query-provider";
import Footer from "@/components/footer";

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
    <html lang="en" suppressHydrationWarning>
      <ReactQueryProvider>
        <body className={`${inter.className} antialiased `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />  
            <div className="min-h-[calc(100vh-8rem)]">
            {children}
            </div>
            <Footer />
            <Toaster richColors/>
          </ThemeProvider>
        </body>
      </ReactQueryProvider>
    </html>
  );
}
