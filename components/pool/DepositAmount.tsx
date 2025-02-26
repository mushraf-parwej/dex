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
  NonfungiblePositionManager as NFPMHelper,
  FeeAmount,
} from "@uniswap/v3-sdk";
import POOLABI from "../../lib/config/poolabi.json";

// Minimal ERC20 ABI
const ERC20ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  "0xa2bcBce9B2727CAd75ec42bFf76a6d85DA129B9C";
const chainId = 11155111;

const DepositAmount = () => {
  // Now assume fee is stored in the coin store along with coin1 and coin2.
  const { coin1, coin2, fee } = useCoinStore();
  const { setCurrentStep } = useStepContext();
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolData, setPoolData] = useState<any>(null);

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>("");

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
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

  const handleMaxCoin1 = async () => {
    const simulatedMax = "100.00";
    setAmount1(simulatedMax);
  };

  const handleMaxCoin2 = async () => {
    const simulatedMax = "200.00";
    setAmount2(simulatedMax);
  };

  const fetchPoolData = async (): Promise<any> => {
    if (!provider) return null;
    try {
      // const poolContract = new ethers.Contract(
      //   "0x391246c0873ff6a14aba382bb6bc7ec3fe9bd083",
      //   POOLABI,
      //   provider
      // );
      const storedPoolAddress = localStorage.getItem("poolAddress");
      if (!storedPoolAddress) {
        throw new Error("Pool address not found in local storage");
      }
      const poolContract = new ethers.Contract(
        storedPoolAddress,
        POOLABI,
        provider
      );
      const [liquidity, slot0, token0, token1] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
        poolContract.token0(),
        poolContract.token1(),
      ]);
      const poolInfo = {
        liquidity: liquidity.toString(),
        sqrtPriceX96: slot0.sqrtPriceX96.toString(),
        tick: slot0.tick, // raw tick from the pool (might be a BigInt)
        token0,
        token1,
      };
      console.log("Fetched pool data:", poolInfo);
      setPoolData(poolInfo);
      return poolInfo;
    } catch (error) {
      console.error("Error fetching pool data:", error);
      return null;
    }
  };

  const addLiquidity = async () => {
    if (!provider || !signer || !account) {
      alert("Wallet not connected");
      return;
    }

    setLoading(true);
    try {
      const _amountCoin1 = parseUnits(amount1 || "0", 6);
      const _amountCoin2 = parseUnits(amount2 || "0", 6);

      // Approve tokens for the NonfungiblePositionManager.
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

      // Create token instances.
      const TokenA = new Token(chainId, coin1.address, 6, "USDC", "USDC Token");
      const TokenB = new Token(chainId, coin2.address, 6, "ETH", "ETH Coin");

      // Fetch pool data (which now includes the poolAddress from the API).
      const data = await fetchPoolData();
      if (!data) throw new Error("Pool data could not be fetched.");
      console.log("Using pool data:", data);

      // Convert tick from BigInt to number if necessary.
      const currentTick =
        typeof data.tick === "bigint" ? Number(data.tick) : data.tick;

      // Create a Pool instance using the fee returned on-chain.
      const poolInstance = new Pool(
        TokenA,
        TokenB,
        FeeAmount.MEDIUM, // Alternatively, you can use data.fee if you prefer.
        data.sqrtPriceX96,
        data.liquidity,
        currentTick
      );
      console.log("Pool instance created:", poolInstance);

      // Determine tick spacing.
      const tickSpacing = poolInstance.tickSpacing;
      let lowerTick: number;
      let upperTick: number;
      if (data.liquidity === "0") {
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

      // Create a Position instance from the provided amounts.
      const position = Position.fromAmounts({
        pool: poolInstance,
        tickLower: lowerTick,
        tickUpper: upperTick,
        amount0: _amountCoin1.toString(),
        amount1: _amountCoin2.toString(),
        useFullPrecision: true,
      });
      console.log("Position instance created:", position);

      const mintOptions = {
        recipient: account,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        slippageTolerance: new Percent(50, 10_000),
      };
      const { calldata, value } = NFPMHelper.addCallParameters(
        position,
        mintOptions
      );
      console.log("Calldata generated:", calldata, "Value:", value);

      let tx: ethers.TransactionRequest = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        data: calldata,
        value: value,
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

      <section className="p-5 rounded-[13px] w-full border flex flex-row space-x-5 justify-between mt-4">
        <div>Graph</div>
        <div className="flex flex-row items-center space-x-2">
          <span>Full Range</span>
          <Edit className="cursor-pointer" onClick={() => setCurrentStep(2)} />
        </div>
      </section>

      <section className="rounded-[15px] p-5 w-full border flex flex-col space-y-20 mt-4">
        <div className="w-full flex flex-col justify-start">
          <p className="text-lg font-semibold">Deposit Amount</p>
          <span className="text-sm">
            Specify the token amounts for your liquidity contribution.
          </span>
        </div>
        <div className="flex flex-col space-y-2">
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
