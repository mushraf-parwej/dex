"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button"; // Adjust the import path for your Edit icon
import { useCoinStore } from "@/store";
import { useStepContext } from "@/context/StepContext";
import { Edit } from "lucide-react";
const DepositAmount = () => {
  const { coin1, coin2 } = useCoinStore();
  const { setCurrentStep } = useStepContext();
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");

  const handleMaxCoin1 = async () => {
    // Simulate fetching max balance for coin1, replace with actual logic
    const simulatedMax = "100.00";
    setAmount1(simulatedMax);
  };

  const handleMaxCoin2 = async () => {
    // Simulate fetching max balance for coin2, replace with actual logic
    const simulatedMax = "200.00";
    setAmount2(simulatedMax);
  };

  const handleSubmit = () => {
    const depositData = {
      coin1,
      coin2,
      amount1,
      amount2,
    };
    console.log("Deposit Data:", depositData);
  };

  return (
    <main className="p-6">
      {/* Header with coin names and an Edit button */}
      <section className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center space-x-2">
          <span>{coin1.name}</span>
          <span>/</span>
          <span>{coin2.name}</span>
        </div>
        <Edit className="cursor-pointer" onClick={() => setCurrentStep(1)} />
      </section>

      {/* Graph section with Edit for "Full Range" */}
      <section className="p-5 rounded-[13px] w-full border flex flex-row space-x-5 justify-between mt-4">
        <div>Graph</div>
        <div className="flex flex-row items-center space-x-2">
          <span>Full Range</span>
          <Edit className="cursor-pointer" onClick={() => setCurrentStep(2)} />
        </div>
      </section>

      {/* Deposit Form */}
      <section className="rounded-[15px] p-5 w-full border flex flex-col space-y-20 mt-4">
        <div className="w-full flex flex-col justify-start">
          <p className="text-lg font-semibold">Deposit Amount</p>
          <span className="text-sm">
            Specify the token amounts for your liquidity contribution.
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          {/* Coin1 Deposit Card */}
          <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
            <div className="flex flex-row items-center justify-between gap-6">
              <Input
                className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                type="number"
                placeholder="0.00"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
              />
              <span>{coin1.name}</span>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
              <span>$0</span>
              <button onClick={handleMaxCoin1} className="text-xs underline">
                Max Button
              </button>
            </div>
          </Card>
          {/* Coin2 Deposit Card */}
          <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
            <div className="flex flex-row items-center justify-between gap-6">
              <Input
                className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                type="number"
                placeholder="0.00"
                value={amount2}
                onChange={(e) => setAmount2(e.target.value)}
              />
              <span>{coin2.name}</span>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
              <span>$0</span>
              <button onClick={handleMaxCoin2} className="text-xs underline">
                Max Button
              </button>
            </div>
          </Card>
          {/* Submit Button */}
          <Button onClick={handleSubmit} className="red-btn">
            Submit
          </Button>
        </div>
      </section>
    </main>
  );
};

export default DepositAmount;
