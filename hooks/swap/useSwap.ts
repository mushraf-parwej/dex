// import { useState } from "react";
// import { useCoinStore } from "@/store";

// export const useSwap = () => {
//   const [sellAmount, setSellAmount] = useState("");
//   const [buyAmount, setBuyAmount] = useState("");
//   const { coin1, coin2, setCoin1, setCoin2 } = useCoinStore();

//   const handleSellAmountChange = (value: string) => setSellAmount(value);
//   const handleBuyAmountChange = (value: string) => setBuyAmount(value);

//   const handleSwap = () => {
//     setBuyAmount(sellAmount);
//     setSellAmount(buyAmount);
//     const tempCoin = coin1;
//     setCoin1(coin2);
//     setCoin2(tempCoin);
//   };

//   return {
//     sellAmount,
//     buyAmount,
//     handleSellAmountChange,
//     handleBuyAmountChange,
//     handleSwap,
//   };
// };
////////////////////////////////////////////////////
// hooks/swap/useSwap.ts

import { useState } from "react";
import { useCoinStore } from "@/store";
import { ethers } from "ethers";
import swapRouterABI from "../../lib/config/swapRouterABI.json";
export const useSwap = () => {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const { coin1, coin2, setCoin1, setCoin2 } = useCoinStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const handleSellAmountChange = (value: string) => setSellAmount(value);
  const handleBuyAmountChange = (value: string) => setBuyAmount(value);
  const ERC20ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
  ];
  const steps = [
    { label: "Approval", description: "Approving token transfer" },
    {
      label: "Transaction Submission",
      description: "Submitting transaction",
    },
    { label: "Confirmation", description: "Transaction confirmed" },
  ];

  const handleSwap = () => {
    setBuyAmount(sellAmount);
    setSellAmount(buyAmount);
    const tempCoin = coin1;
    setCoin1(coin2);
    setCoin2(tempCoin);
  };

  // New function to execute the swap transaction via the SwapRouter
  const executeSwapTransaction = async () => {
    if (!window.ethereum) {
      console.error("No Ethereum provider found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const swapRouterAddress = "0x217eE4295fcFDedF740080fA12b6ec82c60A973a";

      const swapRouter = new ethers.Contract(
        swapRouterAddress,
        swapRouterABI,
        signer
      );
      const tokenIn = coin1.address;
      const tokenOut = coin2.address;
      const fee = 3000; // need to change this hardcode value
      const recipient = await signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      const amountIn = ethers.parseUnits(sellAmount, 6);
      const amountOutMinimum = 0;
      const sqrtPriceLimitX96 = 0;

      const params = {
        tokenIn,
        tokenOut,
        fee,
        recipient,
        deadline,
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96,
      };

      console.log("Executing swap with params:", params);
      console.log("Approving token transfer...");
      const tokenContract = new ethers.Contract(
        coin1.address,
        ERC20ABI,
        signer
      );
      const approveTx = await tokenContract.approve(
        swapRouterAddress,
        amountIn
      );
      console.log("Approval transaction submitted:", approveTx.hash);
      await approveTx.wait();
      console.log("Token approval confirmed");
      const tx = await swapRouter.exactInputSingle(params, { value: 0 });
      console.log("Transaction submitted:", tx.hash);
      setCurrentStep(2);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      setCurrentStep(3);
      setIsCompleted(true);
      return receipt;
    } catch (error) {
      console.error("Swap transaction failed:", error);
      throw error;
    }
  };

  return {
    sellAmount,
    buyAmount,
    handleSellAmountChange,
    handleBuyAmountChange,
    handleSwap,
    executeSwapTransaction,
    steps,
    currentStep,
    isCompleted,
  };
};
