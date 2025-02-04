"use client";
import React from "react";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { notification, theme } from "@/public/assets/navbar";
import { logo } from "@/public/assets/common";
import { DockDemo } from "./ui/Navbar/NavbarDock";
import { SearchInput } from "./common/SearchBar";
import Link from "next/link";

const Navbar = () => {
  const { isConnected, address } = useAccount();
  return (
    <nav className="flex flex-row justify-between w-full items-center border-b py-[10px] px-[40px] ">
      <div className="flex flex-row items-center space-x-10  w-1/3  ">
        <Link href="/" className="flex flex-row items-center space-x-1">
          <Image src={logo} alt="logo" />
          <span className=" text-2xl">QDEX</span>
        </Link>
        <div className="flex flex-row items-center space-x-5 text-base">
          <Link className="font-semibold hover:text-red" href="/">
            Trade
          </Link>
          <Link className="font-semibold hover:text-red" href="/pool">
            Pool
          </Link>
          <Link className="font-semibold hover:text-red" href="/pool">
            Explore
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-end items-center space-x-5 w-2/3">
        <SearchInput
          placeholder="Search Tokens"
          className="border rounded-xl shadow-sm w-1/2 "
          value={""}
          onChange={function (
            event: React.ChangeEvent<HTMLInputElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />

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
