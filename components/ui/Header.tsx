"use client";
import React from "react";
import SwapComponent from "../web3/swap-component";
import { RetroGrid } from "./Backgrounds/RetroGrid";

const Header = () => {
  return (
    <main className="flex flex-col justify-center items-center gap-10 ">
      <h1 className="text-6xl font-semibold text-center">
        {" "}
        Swap with Quantum proof security
      </h1>
      <SwapComponent />
      <RetroGrid />
    </main>
  );
};

export default Header;
