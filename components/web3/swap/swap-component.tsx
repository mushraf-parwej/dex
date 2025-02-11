"use client";

import React, { useState, useCallback, FC } from "react";
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
import { SwapProgress } from "./SwapProgress";
import { useCoinStore } from "@/store";

// Define a TypeScript interface for our form data
interface SwapFormData {
  sellAmount: string;
  buyAmount: string;
  coin1: { image: string; name: string; symbol: string }; // Replace `unknown` with a proper coin type as available in your project
  coin2: { image: string; name: string; symbol: string };
}

const steps = [
  {
    label: "Approve Token",
    description: "Approve token for swapping",
  },
  {
    label: "Confirm Swap",
    description: "Confirm the transaction in your wallet",
  },
  {
    label: "Transaction Submitted",
    description: "Waiting for transaction confirmation",
  },
  {
    label: "Transaction Completed",
    description: "Your swap has been completed successfully",
  },
];

const SwapComponent: FC = () => {
  const { isConnected } = useAccount();
  const { coin1, coin2 } = useCoinStore();

  // Local component state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [formData, setFormData] = useState<SwapFormData | null>(null);
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

      // Clear any previous errors
      setError(null);

      // Set the form data using a typed object
      setFormData({
        sellAmount,
        buyAmount,
        coin1,
        coin2,
      });

      setShowConfirmation(true);
    },
    [isFormValid, sellAmount, buyAmount, coin1, coin2]
  );

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px]  z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <SwapProgress
              key="progress"
              onback={() => {
                setIsSubmitted(false);
                // Optionally reset the confirmation state or form data here
                setShowConfirmation(false);
              }}
              steps={steps}
            />
          ) : showConfirmation ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SwapConfirmation
                data={formData as SwapFormData}
                onBack={() => setShowConfirmation(false)}
                onConfirm={() => setIsSubmitted(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div onSubmit={handleSubmit} className="space-y-5">
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
                    <AccordionTrigger className="text-neutral-500 leading-relaxed p-2 rounded-md text-base hover:no-underline">
                      1QRN = 1.023USDT ≈ ($1)
                    </AccordionTrigger>
                    <AccordionContent className="p-2 no-underline border-none">
                      <div className="flex flex-col gap-2 text-neutral-500">
                        <div className="flex flex-row w-full justify-between">
                          <span>Platform fees</span>
                          <span>0.00</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* Display an error message if needed */}
                {error && (
                  <div className="text-red-500 text-sm mt-2" role="alert">
                    {error}
                  </div>
                )}
                <ActionButton
                  handleSubmit={handleSubmit}
                  isConnected={isConnected}
                  disabled={!isFormValid}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </main>
  );
};

export default SwapComponent;
