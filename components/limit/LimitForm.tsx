"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const options = ["1 day", "1 week", "1 Month", "1 Year"];
const buttons = ["Market", "+1%", "+5%", "+10%"];

export default function LimitComponent() {
  const [expiry, setExpiry] = useState("1 day");
  const [activeButton, setActiveButton] = useState(buttons[0]);

  return (
    <div
      className="font-urbanist absolute top-[126px] left-[464px] w-[512px] h-[541px] max-w-[512px] rounded-[10px] border border-white/[0.1] shadow-lg p-4 flex flex-col gap-4"
      style={{ borderWidth: "1px", fontFamily: "'Urbanist', sans-serif" }}
    >
      <div className="w-[480px] h-[381px] rounded-[10px] flex flex-col gap-4 bg-[#F8F9FA]">
        <div className="w-[480px] h-[133px] rounded-[10px] p-4 bg-[#E0E0E04D]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 text-sm">When 1</span>
                <img
                  src="/icons/eth-icon.svg"
                  alt="ETH Icon"
                  className="w-4 h-4"
                />
                <span className="text-gray-500 text-sm font-bold">ETH</span>
                <span className="text-gray-500 text-sm">is worth</span>
              </div>
              <img
                src="/icons/options-icon.svg"
                alt="Options Icon"
                className="w-4 h-4"
              />
            </div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">3191.21</h2>
              <div className="flex items-center gap-[5px]">
              <Image
                  src="/path-to-image.png"
                  width={10}
                  height={10}
                  alt="asd"
                />
                <span className="text-gray-900 font-semibold text-sm">QRN</span>
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
              <p className="text-xl font-semibold">0.00</p>
              <p className="text-xs text-gray-400">≈$0.00</p>
            </div>
            <div className="relative">
              <div className="flex items-center space-x-2 p-1 rounded-md border border-red-500 cursor-pointer">
                <span className="text-green-500 font-semibold px-2 py-1">
                  HBK
                </span>
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
              <p className="text-xl font-semibold">0.00</p>
              <p className="text-gray-400 text-xs">≈$0.00</p>
            </div>
            <div className="relative">
              <div className="flex items-center space-x-2 p-1 rounded-md border border-red-500 cursor-pointer">
                <span className="text-green-500 font-semibold px-2 py-1">
                  QRN
                </span>
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
      <button className="w-[480px] text-gray-600 py-2 rounded-lg cursor-not-allowed bg-gray-300">
        Confirm
      </button>
    </div>
  );
}