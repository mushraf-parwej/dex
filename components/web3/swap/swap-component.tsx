"use client";
import React from "react";
import { useAccount } from "wagmi";
import { Card } from "../../ui/card";
import { TokenInput } from "./TokenInput";
import { SwapButton } from "./SwapButton";
import { ActionButton } from "./ActionButton";
import { useSwap } from "@/hooks/swap/useSwap";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TabIcon from "./SettingsButton";
const SwapComponent = () => {
  const { isConnected } = useAccount();
  const {
    sellAmount,
    buyAmount,
    handleSellAmountChange,
    handleBuyAmountChange,
    handleSwap,
  } = useSwap();

  return (
    <main className="w-full max-w-xl z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-8 shadow-lg">
        <div className="flex flex-col relative gap-2">
          <TokenInput
            label="Sell"
            amount={sellAmount}
            onChange={handleSellAmountChange}
            coinType="coin1"
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1   z-20">
            <SwapButton onSwap={handleSwap} />
          </div>

          <TokenInput
            label="Buy"
            amount={buyAmount}
            onChange={handleBuyAmountChange}
            coinType="coin2"
          />
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border">
            <AccordionTrigger className="text-neutral-500 leading-relaxed  p-2 rounded-md text-base hover:no-underline">
              1QRN = 1.023USDT ≈ ($1)
            </AccordionTrigger>
            <AccordionContent className="p-2 no-underline border-none">
              <div className="flex flex-col gap-2 text-neutral-500 ">
                <div className="flex flex-row w-full justify-between">
                  <span>Platform fess</span>
                  <span>0.00</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <ActionButton isConnected={isConnected} />
      </Card>
    </main>
  );
};

export default SwapComponent;
