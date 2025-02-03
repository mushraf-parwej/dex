"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../../lib/config/factoryabi.json";

const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";
const tokenA = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const tokenB = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
const feeTier = 3000;

const Pool = () => {
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [feeTierInput, setFeeTierInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const [existingPool, setExistingPool] = useState("");

  useEffect(() => {
    const fetchPoolAddress = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factory = new ethers.Contract(factoryAddress, ABI, provider);
        const pool = await factory.getPool(tokenA, tokenB, feeTier);
        if (pool !== ethers.ZeroAddress) {
          setExistingPool(pool);
        } else {
          setExistingPool("No pool found");
        }
      } catch (error) {
        console.error("Error fetching pool address:", error);
      }
    };
    fetchPoolAddress();
  }, []);

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

      const fee = parseInt(feeTierInput, 10);
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
        const newPoolAddress = ethers.getAddress(poolCreatedEvent.args[2]);
        console.log("Pool Address:", newPoolAddress);
        setPoolAddress(newPoolAddress);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error creating pool:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
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
        value={feeTierInput}
        onChange={(e) => setFeeTierInput(e.target.value)}
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

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold">Existing Pool</h3>
        <p className="text-sm">
          <strong>Token A:</strong> {tokenA}
        </p>
        <p className="text-sm">
          <strong>Token B:</strong> {tokenB}
        </p>
        <p className="text-sm">
          <strong>Fee Tier:</strong> {feeTier}
        </p>
        <p className="text-sm">
          <strong>Pool Address:</strong> {existingPool || "Fetching..."}
        </p>
      </div>
    </div>
  );
};

export default Pool;
