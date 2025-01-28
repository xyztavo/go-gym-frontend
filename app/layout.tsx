import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import ReactQueryProvider from "@/utils/react-query-provider";
import Footer from "@/components/footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#383838",
};

export const metadata: Metadata = {
  title: "UGoGym",
  description: "User and gym management app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UGoGym"
  },
  formatDetection: {
    telephone: false
  }
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
            <div className="min-h-[calc(100vh-7.5rem)]">
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
