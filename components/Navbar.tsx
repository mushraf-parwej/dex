"use client";
import React from "react";

import ConnectWalletButton from "./ui/CustomButtons/ConnectButton";
import { DockDemo } from "./ui/Navbar/NavbarDock";
import { useAccount } from "wagmi";

const Navbar = () => {
  const { isConnected, address } = useAccount();
  return (
    <nav className="flex flex-row justify-between items-center w-full">
      <DockDemo />
      {/* <ConnectWalletButton /> */}
      <p className="px-4">
        <w3m-button />
        {isConnected && <w3m-network-button />}
      </p>
    </nav>
  );
};

export default Navbar;
