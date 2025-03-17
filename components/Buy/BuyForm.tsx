"use client";
import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCoinStore } from "@/store";
import { Input } from "../ui/input";
import CoinSelect from "../ui/coinSelect/CoinSelect";

export default function BuyForm() {
  const { coin1 } = useCoinStore();
  const [limitPrice, setLimitPrice] = useState("");
  const buttons = ["$3000", "$6000", "$9000", "$10,000"];
  const [activeButton, setActiveButton] = useState(buttons[0]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (limitPrice && coin1) {
        console.log("Amount:", limitPrice);
        console.log("Coin:", coin1.symbol);
      }
    },
    [limitPrice, coin1]
  );

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px] z-30 mx-auto p-6 md:p-6">
      <Card className="border backdrop-blur-lg rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500 font-urbanist text-sm">
            You’re buying
          </span>
          <div className="relative">
            <select className="appearance-none bg-transparent text-2xl pr-8">
              <option value="india">🇮🇳</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full rounded-xl p-4 bg-[#E0E0E04D] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Input
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="focus:outline-none text-lg"
                placeholder="0.00"
              />
              <div className="flex items-center space-x-2 p-1 cursor-pointer">
                <CoinSelect coinType="coin1" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {buttons.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setActiveButton(label);
                    setLimitPrice(label);
                  }}
                  className={`w-[69px] h-[28px] rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                    activeButton === label
                      ? "text-red-500 bg-[#FFF7F7] border-[#CE192D66]"
                      : "text-gray-900 bg-transparent border-none"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-lg cursor-pointer ${
                limitPrice && coin1
                  ? "bg-red text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              Confirm
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}