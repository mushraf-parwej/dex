import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/lib/config/wallet-config";
import { headers } from "next/headers";
import WagmiProviderComp from "@/providers/WagmiProvider";
import { ThemeProvider } from "@/lib/utils/theme-provider";
import Navbar from "@/components/common/Navbar";
import { StepProvider } from "@/context/StepContext";
import toast, { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "DEX",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className="font-urbanist antialiased">
        <WagmiProviderComp initialState={initialState}>
          <div className="">
            <StepProvider>
              <Navbar />
              <Toaster />
              {children}
            </StepProvider>
          </div>
        </WagmiProviderComp>
      </body>
    </html>
  );
}
