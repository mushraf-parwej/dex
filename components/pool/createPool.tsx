"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "../../lib/config/factoryabi.json";
import { useStepContext } from "@/context/StepContext";
import { TokenInput } from "../web3/swap/TokenInput";
import CoinSelect from "../ui/coinSelect/CoinSelect";
import { useCoinStore } from "@/store";

const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";

const CreatePool = () => {
  const { coin1, coin2 } = useCoinStore();
  // console.log(coin1.address, coin2.address);
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const { currentStep, setCurrentStep } = useStepContext();

  const createPool = async () => {
    // if (!window.ethereum) {
    //   alert("Please install MetaMask!");
    //   return;
    // }

    try {
      //   console.log(coin1.address, coin2.address);
      //   setLoading(true);
      //   const provider = new ethers.BrowserProvider(window.ethereum);
      //   const signer = await provider.getSigner();
      //   const factory = new ethers.Contract(factoryAddress, ABI, signer);

      //   const feeTier = parseInt(fee, 10);
      //   if (isNaN(feeTier)) {
      //     alert("Invalid fee tier");
      //     setLoading(false);
      //     return;
      //   }

      //   const tx = await factory.createPool(
      //     coin1.address,
      //     coin2.address,
      //     feeTier
      //   );
      //   console.log("Transaction sent:", tx.hash);
      //   setTxHash(tx.hash);

      //   const receipt = await tx.wait();
      //   const poolCreatedEvent = receipt.logs.find((log: any) =>
      //     log.topics.includes(factory.interface.getEvent("PoolCreated").topicHash)
      //   );

      //   if (poolCreatedEvent) {
      //     // Decode the event data to obtain poolAddress
      //     const decodedData = factory.interface.decodeEventLog(
      //       "PoolCreated",
      //       poolCreatedEvent.data,
      //       poolCreatedEvent.topics
      //     );
      //     console.log("Pool Created Decoded Data:", decodedData);
      //     setPoolAddress(decodedData.poolAddress);
      setCurrentStep(2);
      // Move to next step (confirmation)
    } catch (error) {
      setLoading(false);
      console.error("Error creating pool:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto  p-6   rounded-lg border">
      {currentStep === 1 && (
        <div className="flex flex-col space-y-5">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Select Pair
            </h2>
            <p>
              Choose the tokens you want to provide liquidity for. You can
              select tokens on all supported networks.
            </p>
          </div>
          {/* <input
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
          /> */}
          <div className="flex flex-row items-center justify-between w-full">
            <CoinSelect coinType="coin1" />
            <CoinSelect coinType="coin2" />
          </div>
          <input
            type="text"
            placeholder="Fee Tier"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={createPool}
            disabled={loading}
            className={`w-full p-2 text-white bg-red rounded ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating Pool..." : "Create Pool"}
          </button>
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">
            Pool Created Successfully
          </h2>
          <p className="mb-4">
            Your pool has been created with address:{" "}
            <strong>{poolAddress}</strong>
          </p>
          <button
            onClick={() => setCurrentStep(3)}
            className="w-full p-2 text-white bg-blue-500 rounded"
          >
            Next Step
          </button>
        </div>
      )}
      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">
            Next Component
          </h2>
          <p>This is the next step of your process.</p>
        </div>
      )}
    </div>
  );
};

export default CreatePool;
