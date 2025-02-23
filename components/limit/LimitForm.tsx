"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ethers } from 'ethers';
import { useLimitOrder } from "@/hooks/limit/useLimitOrder";
import eth from "@/public/assets/icons/eth.png.png";
import group from "@/public/assets/icons/Group 1321316732.png";
import vector from "@/public/assets/icons/Vector.png"
import newImage from "@/public/assets/icons/Shape.png"


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
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [targetPrice, setTargetPrice] = useState("3191.21"); // Your initial price

  const { submitLimitOrder, isLoading, error } = useLimitOrder();

  // Example token addresses - replace with actual addresses
  const TOKEN_IN = "0xYourTokenInAddress";
  const TOKEN_OUT = "0xYourTokenOutAddress";

  const handleSubmit = async () => {
    if (!sellAmount || !targetPrice) return;

    const deadline = Math.floor(Date.now() / 1000) + EXPIRY_MAPPING[expiry];

    await submitLimitOrder({
      tokenIn: TOKEN_IN,
      tokenOut: TOKEN_OUT,
      amountIn: sellAmount,
      targetPrice: targetPrice,
      deadline: deadline,
    });
  };

  const handlePriceAdjustment = (adjustment: string) => {
    const basePrice = parseFloat(targetPrice);
    switch (adjustment) {
      case "+1%":
        setTargetPrice((basePrice * 1.01).toFixed(2));
        break;
      case "+5%":
        setTargetPrice((basePrice * 1.05).toFixed(2));
        break;
      case "+10%":
        setTargetPrice((basePrice * 1.1).toFixed(2));
        break;
      default:
        setTargetPrice("3191.21"); // Reset to market price
    }
  };

  return (
    <div
    className="font-urbanist absolute top-[75%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-[512px] h-[541px] max-w-[512px] rounded-[10px] border border-white/[0.1] shadow-lg p-4 flex flex-col gap-4 text-justify"
    style={{ borderWidth: "1px", fontFamily: "'Urbanist', sans-serif" }}
  >
   
      <div className="w-[480px] h-[381px] rounded-[10px] flex flex-col gap-4 bg-[#F8F9FA]">
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
              <h2 className="text-2xl font-bold text-gray-900">
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-32 bg-transparent"
                />
              </h2>
              <div className="flex items-center space-x-2 p-1  cursor-pointer">
  <Image src={group} width={20} height={20} alt="vector" className="w-5 h-5" />
  <span className="font-semibold px-2">QRN</span>
 
</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 w-[219px] h-[28px]">
            {buttons.map((label) => (
              <button
                key={label}
                onClick={() => setActiveButton(label)}
                className={`w-[69px] h-[28px] rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200
            ${
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
          <div className="w-[480px] h-[116px] rounded-[6px] p-[16px] flex justify-between items-center bg-[#E0E0E04D]">
            <div>
              <p className="text-sm font-medium text-gray-600">Sell</p>
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="text-xl font-semibold bg-transparent w-32"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-400">≈${(parseFloat(sellAmount || "0") * parseFloat(targetPrice)).toFixed(2)}</p>
            </div>
            <div className="relative">
            <div className="flex items-center space-x-2 p-1 rounded-md border border-red-500 cursor-pointer">
  <Image src={newImage} width={20} height={20} alt="vector" className="w-5 h-5" />
  <span className="font-semibold px-2">HBK</span>
  <ChevronDown className="text-gray-500 w-4 h-4" />
</div>

              
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-32 hidden group-hover:block">
                <ul className="text-sm text-gray-700 p-2 space-y-1">
                  <li className="hover:bg-gray-200 p-2 rounded">Option 1</li>
                  <li className="hover:bg-gray-200 p-2 rounded">Option 2</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-[480px] h-[116px] rounded-[6px] p-[16px] flex justify-between items-center bg-[#E0E0E04D] relative">
            <div>
              <p className="text-gray-500 text-sm">Buy</p>
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="text-xl font-semibold bg-transparent w-32"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-400">≈${(parseFloat(buyAmount || "0") * parseFloat(targetPrice)).toFixed(2)}</p>
            </div>
            <div className="relative">
            <div className="flex items-center space-x-2 p-1 rounded-md border border-red-500 cursor-pointer">
  <Image src={group} width={20} height={20} alt="vector" className="w-5 h-5" />
  <span className="font-semibold px-2">QRN</span>
  <ChevronDown className="text-gray-500 w-4 h-4" />
</div>
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md w-32 hidden group-hover:block">
                <ul className="text-sm text-gray-700 p-2 space-y-1">
                  <li className="hover:bg-gray-200 p-2 rounded">Option A</li>
                  <li className="hover:bg-gray-200 p-2 rounded">Option B</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[480px] flex justify-between p-3 rounded-lg mt-1">
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