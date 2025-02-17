"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../../lib/config/factoryabi.json";
import POOL_ABI from "../../lib/config/poolabi.json";
import ERC20_ABI from "../../lib/config/erc20abi.json";

const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";

const Pool = () => {
  // Pool Creation State
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [feeTier, setFeeTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

  // Liquidity Management State
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [liquidityState, setLiquidityState] = useState({
    amount0: "",
    amount1: "",
    minPrice: "",
    maxPrice: "",
    liquidityTxHash: "",
    error: "",
  });

  const createPool = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(factoryAddress, ABI, signer);

      const fee = parseInt(feeTier, 10);
      if (isNaN(fee)) {
        alert("Invalid fee tier");
        setLoading(false);
        return;
      }

      const tx = await factory.createPool(token0, token1, fee);
      console.log("Transaction sent:", tx.hash);
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      const poolCreatedEvent = receipt.logs.find((log) =>
        log.topics.includes(factory.interface.getEvent("PoolCreated").topicHash)
      );

      if (poolCreatedEvent) {
        const poolAddress = ethers.getAddress(poolCreatedEvent.args[2]);
        console.log("Pool Address:", poolAddress);
        setPoolAddress(poolAddress);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error creating pool:", error);
      setLoading(false);
    }
  };

  // Calculate ticks from price
  const calculateTicks = (price, isMin) => {
    const basePrice = parseFloat(price);
    if (isNaN(basePrice) || basePrice <= 0) return 0;

    const tick = Math.log(basePrice) / Math.log(1.0001);
    const tickSpacing = parseInt(feeTier, 10) / 50;
    return Math.round(tick / tickSpacing) * tickSpacing;
  };

  const approveTokens = async (signer, amount0, amount1) => {
    try {
      const token0Contract = new ethers.Contract(token0, ERC20_ABI, signer);
      const token1Contract = new ethers.Contract(token1, ERC20_ABI, signer);

      const tx0 = await token0Contract.approve(poolAddress, amount0);
      await tx0.wait();

      const tx1 = await token1Contract.approve(poolAddress, amount1);
      await tx1.wait();

      return true;
    } catch (error) {
      console.error("Error approving tokens:", error);
      throw new Error("Failed to approve tokens");
    }
  };

  const addLiquidity = async () => {
    if (!window.ethereum || !poolAddress) {
      alert("Please install MetaMask or create pool first!");
      return;
    }

    try {
      setIsAddingLiquidity(true);
      setLiquidityState((prev) => ({ ...prev, error: "" }));

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Parse amounts and calculate ticks
      const amount0Desired = ethers.parseUnits(liquidityState.amount0, 18); // Adjust decimals as needed
      const amount1Desired = ethers.parseUnits(liquidityState.amount1, 18); // Adjust decimals as needed
      const tickLower = calculateTicks(liquidityState.minPrice, true);
      const tickUpper = calculateTicks(liquidityState.maxPrice, false);

      // Approve tokens
      await approveTokens(signer, amount0Desired, amount1Desired);

      // Create pool contract instance
      const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);

      // Prepare mint parameters
      const recipient = await signer.getAddress();
      const params = {
        recipient,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        amount0Min: 0, // Add slippage protection in production
        amount1Min: 0, // Add slippage protection in production
      };

      // Add liquidity
      const tx = await poolContract.mint(params);
      setLiquidityState((prev) => ({ ...prev, liquidityTxHash: tx.hash }));

      await tx.wait();
      alert("Liquidity added successfully!");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      setLiquidityState((prev) => ({
        ...prev,
        error: error.message || "Failed to add liquidity",
      }));
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Pool Creation Section */}
      <h2 className="text-xl font-semibold mb-4 text-black">
        Create a New Pool
      </h2>

      <input
        type="text"
        placeholder="Token 0 Address"
        value={token0}
        onChange={(e) => setToken0(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Token 1 Address"
        value={token1}
        onChange={(e) => setToken1(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Fee Tier (e.g. 3000)"
        value={feeTier}
        onChange={(e) => setFeeTier(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={createPool}
        disabled={loading}
        className={`w-full p-2 text-white bg-blue-500 rounded ${
          loading && "opacity-50"
        }`}
      >
        {loading ? "Creating Pool..." : "Create Pool"}
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

      {poolAddress && (
        <p className="mt-2 text-sm">
          <strong>Pool Address:</strong> {poolAddress}
        </p>
      )}

      {/* Liquidity Management Section */}
      {poolAddress && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Add Liquidity
          </h2>

          <input
            type="number"
            placeholder="Token 0 Amount"
            value={liquidityState.amount0}
            onChange={(e) =>
              setLiquidityState((prev) => ({
                ...prev,
                amount0: e.target.value,
              }))
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Token 1 Amount"
            value={liquidityState.amount1}
            onChange={(e) =>
              setLiquidityState((prev) => ({
                ...prev,
                amount1: e.target.value,
              }))
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Minimum Price"
            value={liquidityState.minPrice}
            onChange={(e) =>
              setLiquidityState((prev) => ({
                ...prev,
                minPrice: e.target.value,
              }))
            }
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Maximum Price"
            value={liquidityState.maxPrice}
            onChange={(e) =>
              setLiquidityState((prev) => ({
                ...prev,
                maxPrice: e.target.value,
              }))
            }
            className="w-full p-2 mb-4 border rounded"
          />

          <button
            onClick={addLiquidity}
            disabled={isAddingLiquidity}
            className={`w-full p-2 text-white bg-green-500 rounded ${
              isAddingLiquidity && "opacity-50"
            }`}
          >
            {isAddingLiquidity ? "Adding Liquidity..." : "Add Liquidity"}
          </button>

          {liquidityState.liquidityTxHash && (
            <p className="mt-4 text-sm">
              <strong>Liquidity Transaction Hash:</strong>{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${liquidityState.liquidityTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {liquidityState.liquidityTxHash}
              </a>
            </p>
          )}

          {liquidityState.error && (
            <p className="mt-4 text-sm text-red-600">
              <strong>Error:</strong> {liquidityState.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Pool;
