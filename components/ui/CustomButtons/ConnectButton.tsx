"use client";

import React from 'react';
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect, useEnsName } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ConnectedButton from './ConnectedButton';

export default function EnhancedConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    if (isConnected) {
      await disconnect();
    } else {
      await open();
    }
    setIsLoading(false);
  };

  // Display either the ENS name or a truncated address

  return (
    <>
      {isConnected ? (
        // Render a rounded div when connected
        <ConnectedButton />
      ) : (
        // Render the button when not connected
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className={`w-40`}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Connect Wallet'
          )}
        </Button>
      )}
    </>
  );
}
