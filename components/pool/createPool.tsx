// "use client";

// import React, { useState } from "react";
// import { ethers } from "ethers";
// import ABI from "../../lib/config/factoryabi.json";
// import { useStepContext } from "@/context/StepContext";
// import { TokenInput } from "../web3/swap/TokenInput";
// import CoinSelect from "../ui/coinSelect/CoinSelect";
// import { useCoinStore } from "@/store";

// const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";

// const CreatePool = () => {
//   const { coin1, coin2 } = useCoinStore();
//   const [token0, setToken0] = useState("");
//   const [token1, setToken1] = useState("");
//   const [fee, setFee] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");
//   const [poolAddress, setPoolAddress] = useState("");
//   const { currentStep, setCurrentStep } = useStepContext();

//   const createPool = async () => {
//     const data = {
//       coin1,
//       coin2,
//       fee,
//     };

//     try {
//       console.log(data);

//       if (coin1 && coin2 && fee) {
//         setCurrentStep(2);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Error creating pool:", error);
//       setLoading(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto  p-6   rounded-lg border">
//       {currentStep === 1 && (
//         <div className="flex flex-col space-y-5">
//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-black">
//               Select Pair
//             </h2>
//             <p>
//               Choose the tokens you want to provide liquidity for. You can
//               select tokens on all supported networks.
//             </p>
//           </div>

//           <div className="flex flex-row items-center justify-between w-full">
//             <CoinSelect coinType="coin1" />
//             <CoinSelect coinType="coin2" />
//           </div>
//           <input
//             type="text"
//             placeholder="Fee Tier"
//             value={fee}
//             onChange={(e) => setFee(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <button
//             onClick={createPool}
//             disabled={loading}
//             className={`w-full p-2 text-white bg-red rounded ${
//               loading && "opacity-50 cursor-not-allowed"
//             }`}
//           >
//             {loading ? "Creating Pool..." : "Create Pool"}
//           </button>
//         </div>
//       )}
//       {currentStep === 2 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Pool Created Successfully
//           </h2>
//           <p className="mb-4">
//             Your pool has been created with address:{" "}
//             <strong>{poolAddress}</strong>
//           </p>
//           <button
//             onClick={() => setCurrentStep(3)}
//             className="w-full p-2 text-white bg-blue-500 rounded"
//           >
//             Next Step
//           </button>
//         </div>
//       )}
//       {currentStep === 3 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Next Component
//           </h2>
//           <p>This is the next step of your process.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreatePool;
// "use client";

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import ABI from "../../lib/config/factoryabi.json";
// import POOLABI from "../../lib/config/poolabi.json";
// import { useStepContext } from "@/context/StepContext";
// import { useCoinStore } from "@/store";
// import CoinSelect from "../ui/coinSelect/CoinSelect";

// const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";

// const CreatePool = () => {
//   const { coin1, coin2 } = useCoinStore();
//   const { currentStep, setCurrentStep } = useStepContext();
//   const [fee, setFee] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");
//   const [poolAddress, setPoolAddress] = useState("");

//   // Check if pool exists whenever coin pair or fee changes.
//   useEffect(() => {
//     async function checkPool() {
//       if (coin1 && coin2 && fee) {
//         try {
//           const response = await fetch(
//             `/api/pools?token0=${coin1.address}&token1=${coin2.address}&feeTier=${fee}`
//           );
//           const result = await response.json();

//           if (Array.isArray(result) && result.length > 0) {
//             // Filter the array to find the exact match
//             const feeInt = parseInt(fee, 10);
//             const matchedPool = result.find(
//               (pool) =>
//                 pool.token0.toLowerCase() === coin1.address.toLowerCase() &&
//                 pool.token1.toLowerCase() === coin2.address.toLowerCase() &&
//                 pool.feeTier === feeInt
//             );

//             if (matchedPool) {
//               setPoolAddress(matchedPool.poolAddress);
//             } else {
//               setPoolAddress("");
//             }
//           } else {
//             setPoolAddress("");
//           }
//         } catch (error) {
//           console.error("Error checking pool:", error);
//         }
//       }
//     }
//     checkPool();
//   }, [coin1, coin2, fee]);

//   // Smart contract call to create a pool.
//   const createPoolOnChain = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const factory = new ethers.Contract(factoryAddress, ABI, signer);

//       const feeInt = parseInt(fee, 10);
//       if (isNaN(feeInt)) {
//         alert("Invalid fee tier");
//         setLoading(false);
//         return;
//       }

//       // Create pool on-chain.
//       const tx = await factory.createPool(coin1.address, coin2.address, feeInt);
//       console.log("CreatePool transaction sent:", tx.hash);
//       setTxHash(tx.hash);

//       // Wait for transaction to complete and get the event.
//       const receipt = await tx.wait();
//       const poolCreatedEventTopic =
//         factory.interface.getEvent("PoolCreated").topicHash;
//       const poolCreatedEvent = receipt.logs.find((log) =>
//         log.topics.includes(poolCreatedEventTopic)
//       );

//       if (poolCreatedEvent) {
//         // Assume the pool address is the third argument (index 2).
//         const newPoolAddress = ethers.getAddress(poolCreatedEvent.args[2]);
//         console.log("New Pool Address:", newPoolAddress);
//         setPoolAddress(newPoolAddress);

//         // Immediately initialize the pool.
//         await initializePool(newPoolAddress);

//         // Add new pool details to backend DB.
//         await addPoolToDB({
//           token0: coin1.address,
//           token1: coin2.address,
//           feeTier: feeInt,
//           poolAddress: newPoolAddress,
//         });
//       } else {
//         console.error("PoolCreated event not found in receipt.");
//       }

//       // All on-chain actions complete. Update the UI.
//       setLoading(false);
//       setCurrentStep(2);
//     } catch (error) {
//       console.error("Error creating pool:", error);
//       setLoading(false);
//     }
//   };

//   // Function to initialize the pool on-chain.
//   const initializePool = async (poolAddr: string) => {
//     const sqrtPriceX96Str = "79228162514264337593543950336";
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }
//     if (!poolAddr) {
//       alert("Pool address is not set. Create a pool first.");
//       return;
//     }
//     if (!sqrtPriceX96Str) {
//       alert("Please enter a valid sqrtPriceX96 value.");
//       return;
//     }
//     try {
//       // Do not set loading here to avoid conflict with createPoolOnChain loading state.
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const poolContract = new ethers.Contract(poolAddr, POOLABI, signer);
//       const sqrtPriceX96 = BigInt(sqrtPriceX96Str);
//       console.log("pool contract", poolContract);
//       const tx = await poolContract.initialize(sqrtPriceX96);
//       console.log("InitializePool transaction sent:", tx.hash);
//       setTxHash(tx.hash);

//       await tx.wait();
//       console.log("Pool initialized successfully");
//     } catch (error) {
//       console.error("Error initializing pool:", error);
//     }
//   };

//   // Send new pool details to backend DB.
//   const addPoolToDB = async (poolData: {
//     token0: string;
//     token1: string;
//     feeTier: number;
//     poolAddress: string;
//   }) => {
//     try {
//       const response = await fetch("/api/pools", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(poolData),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to add pool to DB");
//       }
//       console.log("New pool added to database");
//     } catch (error) {
//       console.error("Error adding pool to DB:", error);
//     }
//   };

//   // Handler for button click – either create pool or simply go to next step if pool exists.
//   const handleButtonClick = async () => {
//     // If pool already exists (verified via API), move to next step.
//     if (poolAddress) {
//       console.log("Pool already exists. Moving to next step.");
//       setCurrentStep(2);
//       return;
//     }
//     // Otherwise, attempt to create the pool on-chain.
//     await createPoolOnChain();
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 rounded-lg border">
//       {currentStep === 1 && (
//         <div className="flex flex-col space-y-5">
//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-black">
//               Select Pair
//             </h2>
//             <p>
//               Choose the tokens you want to provide liquidity for. You can
//               select tokens on all supported networks.
//             </p>
//           </div>

//           <div className="flex flex-row items-center justify-between w-full">
//             <CoinSelect coinType="coin1" />
//             <CoinSelect coinType="coin2" />
//           </div>

//           <input
//             type="text"
//             placeholder="Fee Tier"
//             value={fee}
//             onChange={(e) => setFee(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <button
//             onClick={handleButtonClick}
//             disabled={loading || !coin1 || !coin2 || !fee}
//             className={`w-full p-2 text-white bg-red rounded ${
//               loading && "opacity-50 cursor-not-allowed"
//             }`}
//           >
//             {loading ? "Processing..." : poolAddress ? "Next" : "Create Pool"}
//           </button>
//           {txHash && (
//             <p className="text-sm text-gray-600">Transaction Hash: {txHash}</p>
//           )}
//           {poolAddress && (
//             <p className="text-sm text-gray-600">Pool Address: {poolAddress}</p>
//           )}
//         </div>
//       )}
//       {/* Step 2: Confirmation of pool creation */}
//       {currentStep === 2 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Pool Created Successfully
//           </h2>
//           <p className="mb-4">
//             Your pool has been created with address:{" "}
//             <strong>{poolAddress}</strong>
//           </p>
//           <button
//             onClick={() => setCurrentStep(3)}
//             className="w-full p-2 text-white bg-blue-500 rounded"
//           >
//             Next Step
//           </button>
//         </div>
//       )}
//       {/* Step 3: Next component */}
//       {currentStep === 3 && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Next Component
//           </h2>
//           <p>This is the next step of your process.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreatePool;
"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../../lib/config/factoryabi.json";
import POOLABI from "../../lib/config/poolabi.json";
import { useStepContext } from "@/context/StepContext";
import { useCoinStore } from "@/store";
import CoinSelect from "../ui/coinSelect/CoinSelect";

const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";

const CreatePool = () => {
  const { coin1, coin2 } = useCoinStore();
  const { currentStep, setCurrentStep } = useStepContext();
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

  // Check if pool exists whenever coin pair or fee changes.
  useEffect(() => {
    async function checkPool() {
      if (coin1 && coin2 && fee) {
        try {
          const response = await fetch(
            `/api/pools?token0=${coin1.address}&token1=${coin2.address}&feeTier=${fee}`
          );
          const result = await response.json();

          if (Array.isArray(result) && result.length > 0) {
            // Filter the array to find the exact match
            const feeInt = parseInt(fee, 10);
            const matchedPool = result.find(
              (pool) =>
                pool.token0.toLowerCase() === coin1.address.toLowerCase() &&
                pool.token1.toLowerCase() === coin2.address.toLowerCase() &&
                pool.feeTier === feeInt
            );

            if (matchedPool) {
              setPoolAddress(matchedPool.poolAddress);
            } else {
              setPoolAddress("");
            }
          } else {
            setPoolAddress("");
          }
        } catch (error) {
          console.error("Error checking pool:", error);
        }
      }
    }
    checkPool();
  }, [coin1, coin2, fee]);

  // Smart contract call to create a pool.
  const createPoolOnChain = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(factoryAddress, ABI, signer);

      const feeInt = parseInt(fee, 10);
      if (isNaN(feeInt)) {
        alert("Invalid fee tier");
        setLoading(false);
        return;
      }

      // Create pool on-chain.
      const tx = await factory.createPool(coin1.address, coin2.address, feeInt);
      console.log("CreatePool transaction sent:", tx.hash);
      setTxHash(tx.hash);

      // Wait for transaction to complete.
      await tx.wait();

      // Instead of parsing event logs, retrieve the pool address using getPool.
      const newPoolAddress = await factory.getPool(
        coin1.address,
        coin2.address,
        feeInt
      );
      if (newPoolAddress === ethers.ZeroAddress) {
        console.error("Pool not found in factory.getPool");
        setLoading(false);
        return;
      }
      console.log("New Pool Address from getPool:", newPoolAddress);
      setPoolAddress(newPoolAddress);

      // Immediately initialize the pool.
      await initializePool(newPoolAddress);

      // Add new pool details to backend DB.
      await addPoolToDB({
        token0: coin1.address,
        token1: coin2.address,
        feeTier: feeInt,
        poolAddress: newPoolAddress,
      });

      // All on-chain actions complete. Update the UI.
      setLoading(false);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating pool:", error);
      setLoading(false);
    }
  };

  // Function to initialize the pool on-chain.
  const initializePool = async (poolAddr: string) => {
    const sqrtPriceX96Str = "79228162514264337593543950336"; // example value
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    if (!poolAddr) {
      alert("Pool address is not set. Create a pool first.");
      return;
    }
    if (!sqrtPriceX96Str) {
      alert("Please enter a valid sqrtPriceX96 value.");
      return;
    }
    try {
      // Do not set loading here to avoid conflict with createPoolOnChain loading state.
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new ethers.Contract(poolAddr, POOLABI, signer);
      const sqrtPriceX96 = BigInt(sqrtPriceX96Str);
      console.log("Pool contract:", poolContract);
      const tx = await poolContract.initialize(sqrtPriceX96);
      console.log("InitializePool transaction sent:", tx.hash);
      setTxHash(tx.hash);

      await tx.wait();
      console.log("Pool initialized successfully");
    } catch (error) {
      console.error("Error initializing pool:", error);
    }
  };

  // Send new pool details to backend DB.
  const addPoolToDB = async (poolData: {
    token0: string;
    token1: string;
    feeTier: number;
    poolAddress: string;
  }) => {
    try {
      const response = await fetch("/api/pools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poolData),
      });
      if (!response.ok) {
        throw new Error("Failed to add pool to DB");
      }
      console.log("New pool added to database");
    } catch (error) {
      console.error("Error adding pool to DB:", error);
    }
  };

  // Handler for button click – either create pool or simply go to next step if pool exists.
  const handleButtonClick = async () => {
    // If pool already exists (verified via API), move to next step.
    if (poolAddress) {
      console.log("Pool already exists. Moving to next step.");
      setCurrentStep(2);
      return;
    }
    // Otherwise, attempt to create the pool on-chain.
    await createPoolOnChain();
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg border">
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
            onClick={handleButtonClick}
            disabled={loading || !coin1 || !coin2 || !fee}
            className={`w-full p-2 text-white bg-red rounded ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : poolAddress ? "Next" : "Create Pool"}
          </button>
          {txHash && (
            <p className="text-sm text-gray-600">Transaction Hash: {txHash}</p>
          )}
          {poolAddress && (
            <p className="text-sm text-gray-600">Pool Address: {poolAddress}</p>
          )}
        </div>
      )}
      {/* Step 2: Confirmation of pool creation */}
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
      {/* Step 3: Next component */}
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
