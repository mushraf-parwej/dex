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
import { ethers } from "ethers";
import ABI from "../../../../dex/lib/config/poolabi.json";
const poolAddress = "0x06ad811434afd10E597232B4513b70b3a8950a1e"; // existing pool address

// Define a TypeScript interface for our form data
interface SwapFormData {
  sellAmount: string;
  buyAmount: string;
  coin1: { image: string; name: string; symbol: string }; // Replace `unknown` with a proper coin type as available in your project
  coin2: { image: string; name: string; symbol: string };
}

const swapTokens = () => {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  const swapTokens = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed,
      // so they only have read-only access
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new ethers.Contract(poolAddress, ABI, signer);

      // Define parameters for the swap function
      const recipient = await signer.getAddress(); // Get the user's wallet address
      const zeroForOne = true; // Set this based on which token you are swapping (true for token0 to token1)
      const amountSpecified = ethers.parseUnits(sellAmount, 18); // Assuming token has 18 decimals
      const sqrtPriceLimitX96 = 0; // Set this to your desired price limit or use 0 for no limit
      const data = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [buyAmount]
      ); // Encode any additional data if needed

      // Call the swap function
      const tx = await poolContract.swap(
        recipient,
        zeroForOne,
        amountSpecified,
        sqrtPriceLimitX96,
        data
      );
      console.log("Transaction sent:", tx.hash);
      setTxHash(tx.hash);

      // Wait for transaction confirmation
      await tx.wait();
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error executing swap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-black">Swap Tokens</h2>

      <input
        type="text"
        placeholder="Sell Amount"
        value={sellAmount}
        onChange={(e) => setSellAmount(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />

      <input
        type="text"
        placeholder="Buy Amount"
        value={buyAmount}
        onChange={(e) => setBuyAmount(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={swapTokens}
        disabled={loading}
        className={`w-full p-2 text-white bg-blue-500 rounded ${
          loading && "opacity-50"
        }`}
      >
        {loading ? "Swapping..." : "Swap Tokens"}
      </button>

      {txHash && (
        <p className="mt-4 text-sm">
          <strong>Transaction Hash:</strong>{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
};

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

const SwapComponent = () => {
  const { isConnected } = useAccount();
  const { coin1, coin2 } = useCoinStore();

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      setShowConfirmation(true);
    },
    [isFormValid]
  );

  const swapTokens = async () => {
    if (!window.ethereum) {
      alert("Wallet is not connected");
      return;
    }

    try {
      setLoading(true);
       let signer = null;

    let provider;
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed,
      // so they only have read-only access
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new ethers.Contract(poolAddress, ABI, signer);

      const recipient = await signer.getAddress();
      const zeroForOne = true; // Adjust based on your swap direction
      const amountSpecified = ethers.parseUnits(sellAmount, 18); // Assuming token has 18 decimals
      const sqrtPriceLimitX96 = 0;
      const data = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [ethers.parseUnits(buyAmount, 18)]
      );

      const tx = await poolContract.swap(
        recipient,
        zeroForOne,
        amountSpecified,
        sqrtPriceLimitX96,
        data
      );
      console.log("Transaction sent:", tx);
      setTxHash(tx.hash);
      setIsSubmitted(true);

      await tx.wait();
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error executing swap:", error);
      setError("Swap failed. Please try again.");
      setIsSubmitted(false);
    } finally {
      setLoading(false);
      setShowConfirmation(false); // Hide confirmation after swap attempt
    }
  };
};

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px]  z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <SwapProgress
              key="progress"
              onback={() => {
                setIsSubmitted(false);
                setTxHash(null); // Clear transaction hash on back
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
                data={{ sellAmount, buyAmount, coin1, coin2 }}
                onBack={() => setShowConfirmation(false)}
                onConfirm={swapTokens}
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
