"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../../lib/config/factoryabi.json";
const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";

const Pool = () => {
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [feeTier, setFeeTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

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
      // const poolCreatedEvent = receipt.logs.find((log: any) =>
      //   log.topics.includes(factory.interface.getEventTopic("PoolCreated"))
      // );
      const poolCreatedEvent = receipt.logs.find((log: any) =>
        log.topics.includes(factory.interface.getEvent("PoolCreated").topicHash)
      );

      if (poolCreatedEvent) {
        const poolAddress = ethers.getAddress(poolCreatedEvent.args[2]); // Extract pool address
        console.log("Pool Address:", poolAddress);
        setPoolAddress(poolAddress);

        // save to mongoDB
        await fetch("/api/pool", {
          method: "POST",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify({
            token0,
            token1,
            feeTier: fee,
            poolAddress,
          }),
      });
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
    </div>
  );
};

export default Pool;


// pool example: Sepolia network
// tokenA: 0x9047AC7FB3ceD349b3Da20D4b4f01e3e1652d1D4
// tokenB: 0x346Eebf5b9eFbFc92ac636563633f807688904Be