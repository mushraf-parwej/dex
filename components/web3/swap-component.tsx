import React, { useState } from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import CoinSelect from "../ui/coinSelect/CoinSelect";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const SwapComponent = () => {
  const { isConnected } = useAccount();
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  const handleSwap = () => {
    setBuyAmount(sellAmount);
    setSellAmount(buyAmount);
  };

  return (
    <main className="w-full md:w-2/3 z-30 mx-auto p-6">
      <Card className="flex flex-col bg-neutral-950 backdrop-blur-lg rounded-2xl p-2 gap-6 w-full shadow-lg">
        {/* Sell Section */}
        <div className="flex flex-col space-y-2">
          <Card className="p-4 w-full flex flex-col gap-4 bg-neutral-900 rounded-xl">
            <h2 className="text-2xl font-semibold text-white">Sell</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Input
                className="outline-none text-lg w-full border-2 border-transparent p-4 rounded-lg text-white placeholder:text-neutral-500"
                type="number"
                placeholder="Amount"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
              <CoinSelect coinType="coin1" />
            </div>
          </Card>

          {/* Swap Button */}
          <div className="flex flex-row justify-center w-full">
            <button
              className="w-fit bg-slate-900 shadow-md text-white p-4 rounded-lg font-semibold"
              onClick={handleSwap}
            >
              <ChevronDownIcon />
            </button>
          </div>

          {/* Buy Section */}
          <Card className="p-4 w-full flex flex-col gap-4 bg-neutral-900 rounded-xl">
            <h2 className="text-2xl font-semibold text-white">Buy</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Input
                className="outline-none text-lg w-full border-2 border-transparent p-4 rounded-lg text-white placeholder:text-neutral-500"
                type="number"
                placeholder="Amount"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
              <CoinSelect coinType="coin2" />
            </div>
          </Card>
        </div>

        {/* Action Button */}
        {isConnected ? (
          <button className="w-full md:w-auto bg-red-900 text-white p-4 rounded-lg font-semibold">
            Swap
          </button>
        ) : (
          <div className="flex flex-row w-full justify-center flex-center">
            <ConnectButton />
          </div>
        )}
      </Card>
    </main>
  );
};

export default SwapComponent;
