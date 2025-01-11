"use client";
import React from "react";

import ConnectWalletButton from "./ui/CustomButtons/ConnectButton";
import { DockDemo } from "./ui/Navbar/NavbarDock";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between items-center w-full">
      <DockDemo />
      <ConnectWalletButton />
    </nav>
  );
};

export default Navbar;
