// "use client";

// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "../ui/input";
// import { Button } from "@/components/ui/button"; // Adjust the import path for your Edit icon
// import { useCoinStore } from "@/store";
// import { useStepContext } from "@/context/StepContext";
// import { Edit } from "lucide-react";
// const DepositAmount = () => {
//   const { coin1, coin2 } = useCoinStore();
//   const { setCurrentStep } = useStepContext();
//   const [amount1, setAmount1] = useState("");
//   const [amount2, setAmount2] = useState("");

//   const handleMaxCoin1 = async () => {
//     // Simulate fetching max balance for coin1, replace with actual logic
//     const simulatedMax = "100.00";
//     setAmount1(simulatedMax);
//   };

//   const handleMaxCoin2 = async () => {
//     // Simulate fetching max balance for coin2, replace with actual logic
//     const simulatedMax = "200.00";
//     setAmount2(simulatedMax);
//   };

//   const handleSubmit = () => {
//     const depositData = {
//       coin1,
//       coin2,
//       amount1,
//       amount2,
//     };
//     console.log("Deposit Data:", depositData);
//   };

//   return (
//     <main className="p-6">
//       {/* Header with coin names and an Edit button */}
//       <section className="flex flex-row items-center justify-between w-full border">
//         <div className="flex flex-row items-center space-x-2">
//           <span>{coin1.name}</span>
//           <span>/</span>
//           <span>{coin2.name}</span>
//         </div>
//         <Edit className="cursor-pointer" onClick={() => setCurrentStep(1)} />
//       </section>

//       {/* Graph section with Edit for "Full Range" */}
//       <section className="p-5 rounded-[13px] w-full border flex flex-row space-x-5 justify-between mt-4">
//         <div>Graph</div>
//         <div className="flex flex-row items-center space-x-2">
//           <span>Full Range</span>
//           <Edit className="cursor-pointer" onClick={() => setCurrentStep(2)} />
//         </div>
//       </section>

//       {/* Deposit Form */}
//       <section className="rounded-[15px] p-5 w-full border flex flex-col space-y-20 mt-4">
//         <div className="w-full flex flex-col justify-start">
//           <p className="text-lg font-semibold">Deposit Amount</p>
//           <span className="text-sm">
//             Specify the token amounts for your liquidity contribution.
//           </span>
//         </div>
//         <div className="flex flex-col space-y-2">
//           {/* Coin1 Deposit Card */}
//           <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
//             <div className="flex flex-row items-center justify-between gap-6">
//               <Input
//                 className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black disabled:opacity-50 disabled:cursor-not-allowed"
//                 type="number"
//                 placeholder="0.00"
//                 value={amount1}
//                 onChange={(e) => setAmount1(e.target.value)}
//               />
//               <span>{coin1.name}</span>
//             </div>
//             <div className="flex flex-row justify-between w-full items-center">
//               <span>$0</span>
//               <button onClick={handleMaxCoin1} className="text-xs underline">
//                 Max Button
//               </button>
//             </div>
//           </Card>
//           {/* Coin2 Deposit Card */}
//           <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
//             <div className="flex flex-row items-center justify-between gap-6">
//               <Input
//                 className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black disabled:opacity-50 disabled:cursor-not-allowed"
//                 type="number"
//                 placeholder="0.00"
//                 value={amount2}
//                 onChange={(e) => setAmount2(e.target.value)}
//               />
//               <span>{coin2.name}</span>
//             </div>
//             <div className="flex flex-row justify-between w-full items-center">
//               <span>$0</span>
//               <button onClick={handleMaxCoin2} className="text-xs underline">
//                 Max Button
//               </button>
//             </div>
//           </Card>
//           {/* Submit Button */}
//           <Button onClick={handleSubmit} className="red-btn">
//             Submit
//           </Button>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default DepositAmount;
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { useCoinStore } from "@/store";
import { useStepContext } from "@/context/StepContext";
import { Edit } from "lucide-react";
import { ethers, parseUnits } from "ethers";
import { Token, Percent } from "@uniswap/sdk-core";
import {
  Pool,
  Position,
  nearestUsableTick,
  FeeAmount,
  NonfungiblePositionManager as NFPMHelper,
} from "@uniswap/v3-sdk";

// Minimal ERC20 ABI
const ERC20ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

// Example constants; adjust as needed
const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  "0xa2bcBce9B2727CAd75ec42bFf76a6d85DA129B9C";
const chainId = 1;

// You can change this fee to match the one chosen in CreatePool (e.g., 3000)
const FEE_TIER = 3000;

const DepositAmount = () => {
  const { coin1, coin2 } = useCoinStore();
  const { setCurrentStep } = useStepContext();
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  // ------------------------
  // NEW: provider, signer, account
  // ------------------------
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        // Request accounts from MetaMask
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        await _provider.send("eth_requestAccounts", []);
        const _signer = await _provider.getSigner();
        setSigner(_signer);
        const address = await _signer.getAddress();
        setAccount(address);
      }
    }
    init();
  }, []);
  // ------------------------

  // Handler to simulate fetching max balance for coin1
  const handleMaxCoin1 = async () => {
    const simulatedMax = "100.00";
    setAmount1(simulatedMax);
  };

  // Handler to simulate fetching max balance for coin2
  const handleMaxCoin2 = async () => {
    const simulatedMax = "200.00";
    setAmount2(simulatedMax);
  };

  // Updated fetchPoolData function now accepts feeTier and filters correctly.
  const fetchPoolData = async (
    token0: string,
    token1: string,
    feeTier: number
  ) => {
    try {
      const response = await fetch(
        `/api/pools?token0=${token0}&token1=${token1}&feeTier=${feeTier}`
      );
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Pool data not found");
      }
      // Filter for the exact match (ignoring case)
      const matchedPool = data.find(
        (pool: any) =>
          pool.token0.toLowerCase() === token0.toLowerCase() &&
          pool.token1.toLowerCase() === token1.toLowerCase() &&
          Number(pool.feeTier) === feeTier
      );
      if (!matchedPool) {
        throw new Error(
          "Pool not found for the chosen token pair and fee tier"
        );
      }
      return matchedPool;
    } catch (error) {
      console.error("Error fetching pool data:", error);
      throw error;
    }
  };

  const addLiquidity = async () => {
    // Check if wallet is connected
    if (!provider || !signer || !account) {
      alert("Wallet not connected");
      return;
    }

    setLoading(true);
    try {
      // Convert user input (string) to BigInt using parseUnits.
      // Adjust decimals as needed for your tokens. Here we assume 6 decimals.
      const _amountCoin1 = parseUnits(amount1 || "0", 6);
      const _amountCoin2 = parseUnits(amount2 || "0", 6);

      // Approve tokens for the NonfungiblePositionManager
      const token0Contract = new ethers.Contract(
        coin1.address,
        ERC20ABI,
        signer
      );
      const token1Contract = new ethers.Contract(
        coin2.address,
        ERC20ABI,
        signer
      );

      console.log("Approving token transfers...");
      const tx0 = await token0Contract.approve(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        _amountCoin1
      );
      await tx0.wait();

      const tx1 = await token1Contract.approve(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        _amountCoin2
      );
      await tx1.wait();
      console.log("Token approvals complete.");

      // Create token instances using Uniswap SDK.
      // Adjust decimals and token symbols as needed.
      const TokenA = new Token(chainId, coin2.address, 6, "USDC", "USDC Token");
      const TokenB = new Token(chainId, coin1.address, 6, "ETH", "ETH Coin");

      // Fetch pool data using the same fee tier as in CreatePool.
      const data = await fetchPoolData(coin1.address, coin2.address, FEE_TIER);
      console.log("Using pool data:", data);

      // Convert tick from BigInt to number if necessary.
      const currentTick =
        typeof data.tick === "bigint" ? Number(data.tick) : data.tick;

      // Create a Pool instance using Uniswap SDK.
      const poolInstance = new Pool(
        TokenA,
        TokenB,
        FeeAmount.MEDIUM, // or adjust as needed
        data.sqrtPriceX96,
        data.liquidity,
        currentTick
      );
      console.log("Pool instance created:", poolInstance);

      // Determine tick spacing from pool instance.
      const tickSpacing = poolInstance.tickSpacing;
      let lowerTick: number;
      let upperTick: number;
      if (data.liquidity === "0") {
        // As the first liquidity provider, use a default narrow range.
        lowerTick = -60;
        upperTick = 60;
        console.log(
          "Pool has zero liquidity. Using default tick range: lowerTick = -60, upperTick = 60"
        );
      } else {
        lowerTick =
          nearestUsableTick(currentTick, tickSpacing) - 2 * tickSpacing;
        upperTick =
          nearestUsableTick(currentTick, tickSpacing) + 2 * tickSpacing;
        console.log("Pool has existing liquidity. Using computed tick range:");
      }
      console.log("Tick spacing:", tickSpacing);
      console.log("Lower tick:", lowerTick, "Upper tick:", upperTick);

      // Create a Position instance from the supplied amounts.
      const position = Position.fromAmounts({
        pool: poolInstance,
        tickLower: lowerTick,
        tickUpper: upperTick,
        amount0: _amountCoin1.toString(),
        amount1: _amountCoin2.toString(),
        useFullPrecision: true,
      });
      console.log("Position instance created:", position);

      // Define mint options (recipient, deadline, and slippage tolerance).
      const mintOptions = {
        recipient: account,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
        slippageTolerance: new Percent(50, 10_000), // 0.5% slippage tolerance
      };

      // Use the SDK helper to get calldata and value for the mint transaction.
      const { calldata, value } = NFPMHelper.addCallParameters(
        position,
        mintOptions
      );
      console.log("Calldata generated:", calldata, "Value:", value);

      // Build the transaction object.
      let tx: ethers.TransactionRequest = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        data: calldata,
        value: value, // typically "0" for ERC20-based positions.
      };

      // Estimate gas and add a 20% buffer.
      const gasEstimate: bigint = await signer.estimateGas(tx);
      const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);
      tx.gasLimit = gasLimit;
      console.log("Transaction object with gas limit:", tx);

      // Send the transaction.
      const response = await signer.sendTransaction(tx);
      console.log("Mint transaction sent:", response.hash);
      setTxHash(response.hash);
      const receipt = await response.wait();
      console.log("Mint transaction receipt:", receipt);

      alert("Liquidity position minted successfully!");
    } catch (error: any) {
      console.error("Error adding liquidity:", error);
      alert("Error adding liquidity. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await addLiquidity();
  };

  return (
    <main className="p-6">
      {/* Header with coin names and an Edit button */}
      <section className="p-5 rounded-[13px] flex flex-row items-center justify-between w-full border">
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
                className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black"
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
                className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black"
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
          <Button onClick={handleSubmit} className="red-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          {txHash && (
            <p className="text-sm text-gray-600">Liquidity Tx Hash: {txHash}</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default DepositAmount;
