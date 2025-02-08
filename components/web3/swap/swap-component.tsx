"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Card } from "../../ui/card";
import { TokenInput } from "./TokenInput";
import { SwapButton } from "./SwapButton";
import { ActionButton } from "./ActionButton";
import { useSwap } from "@/hooks/swap/useSwap";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SwapConfirmation } from "./SwapConfirmation";

import { useCoinStore } from "@/store";

const SwapComponent = () => {
  const { isConnected } = useAccount();
  const { coin1, coin2 } = useCoinStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setFormData({
      sellAmount,
      buyAmount,
      coin1,
      coin2,
    });
    setShowConfirmation(true);
  };

  return (
    <main className="min-w-[480px] min-h-[420px] z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <AnimatePresence mode="wait">
          {showConfirmation ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SwapConfirmation
                data={formData}
                onBack={() => setShowConfirmation(false)}
                onConfirm={() => console.log("Confirming swap:", formData)}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
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
              <ActionButton
                handleSubmit={handleSubmit}
                isConnected={isConnected}
                disabled={!isFormValid}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </main>
  );
};

export default SwapComponent;
