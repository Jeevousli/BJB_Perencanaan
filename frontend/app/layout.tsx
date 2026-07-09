import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Research & Economist - bank bjb",
  description: "Portal Publikasi Riset dan Kajian Bank BJB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}
        className={`${inter.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          duration={3000}
          richColors
          theme="light"
        />
      </body>
    </html>
  );
}
