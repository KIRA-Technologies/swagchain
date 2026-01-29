import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwagChain | Crypto Swag Store",
  description: "Premium crypto-themed merchandise. Pay with crypto via Kira-Pay.",
  keywords: ["crypto", "merchandise", "swag", "kira-pay", "web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <SessionProvider>
          {/* Background Gradient Orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="bg-orb bg-orb-purple w-[600px] h-[600px] -top-64 -left-64" />
            <div className="bg-orb bg-orb-cyan w-[400px] h-[400px] top-1/2 -right-32" />
            <div className="bg-orb bg-orb-pink w-[300px] h-[300px] bottom-0 left-1/3" />
          </div>

          <div className="relative z-10">
            {children}
          </div>

          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
