"use client";
import React from "react";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { notification, theme } from "@/public/assets/navbar";
import { logo } from "@/public/assets/common";
import { DockDemo } from "./ui/Navbar/NavbarDock";

const Navbar = () => {
  const { isConnected, address } = useAccount();
  return (
    <nav className="flex flex-row justify-between w-full items-center border-b py-[10px] px-[40px] space-x-5">
      <div className="flex flex-row items-center text-2xl space-x-2  ">
        <Image src={logo} alt="logo" />
        QDEX
      </div>

      <div className="flex flex-row justify-end items-center space-x-5">
        <div className="border rounded-md p-3">
          <Image src={notification} alt="notification" />
        </div>
        <div className="border rounded-md p-3">
          <Image src={theme} alt="notification" />
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
