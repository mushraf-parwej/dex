'use client';

import { WagmiConfig, createConfig } from 'wagmi';
import { sepolia } from 'viem/chains';
import { http } from 'viem';
import { ThemeProvider } from "@/lib/utils/theme-provider";
import WagmiProviderComp from "@/providers/WagmiProvider";

const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
});

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <WagmiConfig config={wagmiConfig}>
        <WagmiProviderComp>
          {children}
        </WagmiProviderComp>
      </WagmiConfig>
    </ThemeProvider>
  );
}