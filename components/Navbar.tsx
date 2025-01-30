"use client";
import React from "react";

import { DockDemo } from "./ui/Navbar/NavbarDock";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const { isConnected, address } = useAccount();
  return (
    <nav className="flex flex-row justify-between items-center w-full">
      <DockDemo />
      {/* <ConnectWalletButton /> */}
      <p className="px-4">
        {/* <w3m-button />
        {isConnected && <w3m-network-button />} */}
        <ConnectButton />
      </p>
    </nav>
  );
};

export default Navbar;
