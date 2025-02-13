"use client";

import { ChevronDown } from "lucide-react";
import { FC, useState, useCallback } from "react";
import Image from "next/image";
import eth from "@/public/assets/icons/eth.png";
import group from "@/public/assets/icons/Group 1321316732.png";
import newImage from "@/public/assets/icons/Shape.png";
import { TokenInput } from "../web3/swap/TokenInput";
import { SwapButton } from "../web3/swap/SwapButton";
import { useAccount } from "wagmi";
import { useSwap } from "@/hooks/swap/useSwap";
import { useCoinStore } from "@/store";

const options = ["1 day", "1 week", "1 Month", "1 Year"];
const buttons = ["Market", "+1%", "+5%", "+10%"];

const EXPIRY_MAPPING = {
  "1 day": 24 * 60 * 60,
  "1 week": 7 * 24 * 60 * 60,
  "1 Month": 30 * 24 * 60 * 60,
  "1 Year": 365 * 24 * 60 * 60,
};

export default function LimitComponent() {
  const [expiry, setExpiry] = useState("1 day");
  const [activeButton, setActiveButton] = useState(buttons[0]);

  const { isConnected } = useAccount();
  const { coin1, coin2 } = useCoinStore();

  // Local component state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    sellAmount: string;
    buyAmount: string;
    coin1: string;
    coin2: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    sellAmount,
    buyAmount,
    handleSellAmountChange,
    handleBuyAmountChange,
    handleSwap,
  } = useSwap();

  // Validate the form data
  const isFormValid = Boolean(
    sellAmount &&
      buyAmount &&
      coin1 &&
      coin2 &&
      Number(sellAmount) > 0 &&
      Number(buyAmount) > 0
  );

  // Use useCallback to memoize the submit handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
        setError("Please ensure all fields are filled correctly.");
        return;
      }
      setError(null);
      setFormData({ sellAmount, buyAmount, coin1, coin2 });
      setShowConfirmation(true);
    },
    [isFormValid, sellAmount, buyAmount, coin1, coin2]
  );

  return (
<div className="font-urbanist absolute top-[75%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-[512px] max-w-[512px] rounded-[10px] border border-white/[0.1] shadow-lg p-4 flex flex-col gap-4 text-justify">      <div className="w-[480px] h-[381px] rounded-[10px] flex flex-col gap-4 bg-[#F8F9FA]">
        <div className="w-[480px] h-[133px] rounded-[10px] p-4 bg-[#E0E0E04D]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-sm">When 1</span>
                <Image
                  src={eth}
                  width={10}
                  height={10}
                  alt="ETH Icon"
                  className="w-4 h-4"
                />
                <span className="text-gray-500 text-sm font-bold">ETH</span>
                <span className="text-gray-500 text-sm">is worth</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">3191.21</h2>
              <div className="flex items-center space-x-2 p-1 cursor-pointer">
                <Image
                  src={group}
                  width={20}
                  height={20}
                  alt="vector"
                  className="w-5 h-5"
                />
                <span className="font-semibold px-2">QRN</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 w-[219px] h-[28px]">
            {buttons.map((label) => (
              <button
                key={label}
                onClick={() => setActiveButton(label)}
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
        </div>
        <div className="space-y-4 relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col relative gap-2">
              <TokenInput
                label="Sell"
                amount={sellAmount}
                onChange={handleSellAmountChange}
                coinType="coin1"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 z-20">
                <SwapButton onSwap={handleSwap} />
              </div>
              <TokenInput
                label="Buy"
                amount={buyAmount}
                onChange={handleBuyAmountChange}
                coinType="coin2"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-[480px] flex justify-between p-3 rounded-lg mt-10">
        <p className="text-gray-500 text-md">Expiry</p>
        <div className="flex gap-1">
          {options.map((option) => (
            <button
              key={option}
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                expiry === option
                  ? "bg-[#FFF7F7] text-red-500 border border-[#CE192D66]"
                  : "text-gray-900"
              }`}
              onClick={() => setExpiry(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button
        className={`w-[480px] py-2 rounded-lg ${
          isLoading || !sellAmount
            ? "cursor-not-allowed bg-gray-300 text-gray-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
        onClick={handleSubmit}
        disabled={isLoading || !sellAmount}
      >
        {isLoading ? "Processing..." : "Confirm Limit Order"}
      </button>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
}