"use client";
import React from "react";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { logo } from "@/public/assets/common";
import { notification, theme } from "@/public/assets/navbar";
import { SearchInput } from "./common/SearchBar";
import Link from "next/link";

const Navbar = () => {
  const { isConnected } = useAccount();

  return (
    <nav className="flex items-center justify-between w-full h-[72px] border-b px-8">
      {/* Left section - Logo and Navigation */}
      <div className="flex items-center gap-8 w-1/3">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="QDEX" width={32} height={32} />
          <span className="text-2xl font-semibold">QDEX</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            className="font-medium text-neutral-400 hover:text-red transition-colors"
            href="/"
          >
            Trade
          </Link>
          <Link
            className="font-medium text-neutral-400 hover:text-red transition-colors"
            href="/pool"
          >
            Pool
          </Link>
          <Link
            className="font-medium text-neutral-400 hover:text-red transition-colors"
            href="/explore"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex justify-start w-1/3 border rounded-lg">
        <SearchInput
          placeholder="Search tokens..."
          className="w-full max-w-[423px]"
          value=""
          onChange={() => {}}
        />
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button className="p-2 rounded-lg border hover:bg-neutral-900 transition-colors">
          <Image src={notification} alt="Notifications" />
        </button>

        <button className="p-2 rounded-lg border hover:bg-neutral-900 transition-colors">
          <Image src={theme} alt="Theme" />
        </button>

        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
