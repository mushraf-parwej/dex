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
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const { currentStep, setCurrentStep } = useStepContext();

  const createPool = async () => {
    const data = {
      coin1,
      coin2,
      fee,
    };

    try {
      console.log(data);

      if (coin1 && coin2 && fee) {
        setCurrentStep(2);
      }
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
