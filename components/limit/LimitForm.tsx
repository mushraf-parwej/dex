"use client";

import { ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import eth from "@/public/assets/icons/eth.png";
import group from "@/public/assets/icons/Group 1321316732.png";
import newImage from "@/public/assets/icons/Shape.png";
import { TokenInput } from "../web3/swap/TokenInput";
import { SwapButton } from "../web3/swap/SwapButton";
import { useAccount } from "wagmi";
import { useSwap } from "@/hooks/swap/useSwap";
import { useCoinStore } from "@/store";
import { Card } from "@/components/ui/card"; // Adjust path as needed

const options = ["1 day", "1 week", "1 Month", "1 Year"];
const buttons = ["Market", "+1%", "+5%", "+10%"];

export default function LimitComponent() {
  const [expiry, setExpiry] = useState("1 day");
  const [activeButton, setActiveButton] = useState(buttons[0]);

  const { isConnected } = useAccount();
  const { coin1, coin2 } = useCoinStore();

  // Local component states for transitioning views
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

  const isFormValid = Boolean(
    sellAmount &&
      buyAmount &&
      coin1 &&
      coin2 &&
      Number(sellAmount) > 0 &&
      Number(buyAmount) > 0
  );

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
    <main className="md:min-w-[480px] w-full min-h-[420px]  z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <div className="w-full rounded-xl p-4 bg-[#E0E0E04D]">
          <div className="flex flex-col gap-2">
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
                  alt="QRN Icon"
                  className="w-5 h-5"
                />
                <span className="font-semibold px-2">QRN</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
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

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Limit Order Progress State */}
              <div className="p-4 text-center">
                <p className="text-lg font-semibold">
                  Limit Order Submitted
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setShowConfirmation(false);
                  }}
                  className="mt-2 text-blue-500 underline"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          ) : showConfirmation ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 text-center">
                <p className="text-lg font-semibold">
                  Confirm Limit Order
                </p>
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="text-red-500 underline"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="text-green-500 underline"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5 relative">
                <div className="flex flex-col relative gap-2">
                  <TokenInput
                    label="Sell"
                    amount={sellAmount}
                    onChange={handleSellAmountChange}
                    coinType="coin1"
                    coinSelect={true}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 z-20">
                    <SwapButton onSwap={handleSwap} />
                  </div>
                  <TokenInput
                    label="Buy"
                    amount={buyAmount}
                    onChange={handleBuyAmountChange}
                    coinType="coin2"
                    coinSelect={true}
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2" role="alert">
                    {error}
                  </div>
                )}
              </form>
              <div className="flex justify-between p-3 rounded-lg mt-10">
                <p className="text-gray-500 text-md">Expiry</p>
                <div className="flex gap-1">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setExpiry(option)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        expiry === option
                          ? "bg-[#FFF7F7] text-red-500 border border-[#CE192D66]"
                          : "text-gray-900"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              {/* Confirm Button */}
              <button
                onClick={handleSubmit}
                className="w-full text-gray-600 py-2 rounded-lg cursor-pointer bg-gray-300"
              >
                Confirm
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </main>
  );
}
