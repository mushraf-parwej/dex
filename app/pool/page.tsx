// "use client";

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import ABI from "../../lib/config/factoryabi.json";

// const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773";
// const tokenA = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
// const tokenB = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
// const feeTier = 3000;

// const Pool = () => {
//   const [token0, setToken0] = useState("");
//   const [token1, setToken1] = useState("");
//   const [feeTierInput, setFeeTierInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");
//   const [poolAddress, setPoolAddress] = useState("");
//   const [existingPool, setExistingPool] = useState("");

//   useEffect(() => {
//     const fetchPoolAddress = async () => {
//       if (!window.ethereum) return;
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const factory = new ethers.Contract(factoryAddress, ABI, provider);
//         const pool = await factory.getPool(tokenA, tokenB, feeTier);
//         const pool2 = await factory.getPool(
//           "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
//           "0x92f3B59a79bFf5dc60c0d59eA13a44D082B2bdFC",
//           3000
//         );
//         console.log("pool 2", pool2);
//         if (pool !== ethers.ZeroAddress) {
//           setExistingPool(pool);
//         } else {
//           setExistingPool("No pool found");
//         }
//       } catch (error) {
//         console.error("Error fetching pool address:", error);
//       }
//     };
//     fetchPoolAddress();
//   }, []);

//   const createPool = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const factory = new ethers.Contract(factoryAddress, ABI, signer);

//       const fee = parseInt(feeTierInput, 10);
//       if (isNaN(fee)) {
//         alert("Invalid fee tier");
//         setLoading(false);
//         return;
//       }

//       const tx = await factory.createPool(token0, token1, fee);
//       console.log("Transaction sent:", tx.hash);
//       setTxHash(tx.hash);

//       const receipt = await tx.wait();
//       const poolCreatedEvent = receipt.logs.find((log) =>
//         log.topics.includes(factory.interface.getEvent("PoolCreated").topicHash)
//       );

//       if (poolCreatedEvent) {
//         const newPoolAddress = ethers.getAddress(poolCreatedEvent.args[2]);
//         console.log("Pool Address:", newPoolAddress);
//         setPoolAddress(newPoolAddress);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("Error creating pool:", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-semibold mb-4 text-black">
//         Create a New Pool
//       </h2>

//       <input
//         type="text"
//         placeholder="Token 0 Address"
//         value={token0}
//         onChange={(e) => setToken0(e.target.value)}
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <input
//         type="text"
//         placeholder="Token 1 Address"
//         value={token1}
//         onChange={(e) => setToken1(e.target.value)}
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <input
//         type="text"
//         placeholder="Fee Tier (e.g. 3000)"
//         value={feeTierInput}
//         onChange={(e) => setFeeTierInput(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       />

//       <button
//         onClick={createPool}
//         disabled={loading}
//         className={`w-full p-2 text-white bg-blue-500 rounded ${
//           loading && "opacity-50"
//         }`}
//       >
//         {loading ? "Creating Pool..." : "Create Pool"}
//       </button>

//       {txHash && (
//         <p className="mt-4 text-sm">
//           <strong>Transaction Hash:</strong>{" "}
//           <a
//             href={`https://sepolia.etherscan.io/tx/${txHash}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline"
//           >
//             {txHash}
//           </a>
//         </p>
//       )}

//       {poolAddress && (
//         <p className="mt-2 text-sm">
//           <strong>Pool Address:</strong> {poolAddress}
//         </p>
//       )}

//       <div className="mt-8 p-4 bg-gray-100 rounded">
//         <h3 className="text-lg font-semibold">Existing Pool</h3>
//         <p className="text-sm">
//           <strong>Token A:</strong> {tokenA}
//         </p>
//         <p className="text-sm">
//           <strong>Token B:</strong> {tokenB}
//         </p>
//         <p className="text-sm">
//           <strong>Fee Tier:</strong> {feeTier}
//         </p>
//         <p className="text-sm">
//           <strong>Pool Address:</strong> {existingPool || "Fetching..."}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Pool;

/////////////////////////////////////////////////////////////////////////////////////
// "use client";

// import React, { useState } from "react";
// import { ethers } from "ethers";
// import PoolABI from "../../lib/config/poolabi.json"; // Uniswap V3 Pool ABI

// const poolAddress = "0x391246C0873ff6a14aba382bB6bc7eC3fE9Bd083"; // Pool Address
// const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // USDC Token
// const eurcAddress = "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4"; // EURC Token

// const Pool = () => {
//   const [loading, setLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");
//   const [tickLower, setTickLower] = useState("");
//   const [tickUpper, setTickUpper] = useState("");
//   const [liquidityAmount, setLiquidityAmount] = useState("");
//   const [usdcBalance, setUsdcBalance] = useState("0");
//   const [eurcBalance, setEurcBalance] = useState("0");
//   const [tickSpacing, setTickSpacing] = useState(0);

//   // 📌 Check Token Balances & Allowances
//   const checkBalances = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       const usdc = new ethers.Contract(
//         usdcAddress,
//         [
//           "function balanceOf(address) view returns (uint256)",
//           "function allowance(address,address) view returns (uint256)",
//         ],
//         provider
//       );
//       const eurc = new ethers.Contract(
//         eurcAddress,
//         [
//           "function balanceOf(address) view returns (uint256)",
//           "function allowance(address,address) view returns (uint256)",
//         ],
//         provider
//       );

//       const usdcBal = await usdc.balanceOf(userAddress);
//       const eurcBal = await eurc.balanceOf(userAddress);
//       const usdcAllowance = await usdc.allowance(userAddress, poolAddress);
//       const eurcAllowance = await eurc.allowance(userAddress, poolAddress);

//       setUsdcBalance(ethers.formatUnits(usdcBal, 6));
//       setEurcBalance(ethers.formatUnits(eurcBal, 6));

//       console.log(`USDC Balance: ${ethers.formatUnits(usdcBal, 6)}`);
//       console.log(`EURC Balance: ${ethers.formatUnits(eurcBal, 6)}`);
//       console.log(`USDC Allowance: ${ethers.formatUnits(usdcAllowance, 6)}`);
//       console.log(`EURC Allowance: ${ethers.formatUnits(eurcAllowance, 6)}`);
//     } catch (error) {
//       console.error("Error checking balances:", error);
//     }
//   };

//   // 📌 Fetch Pool Tick Spacing
//   const fetchTickSpacing = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const pool = new ethers.Contract(poolAddress, PoolABI, provider);
//       const spacing = await pool.tickSpacing();
//       setTickSpacing(Number(spacing));
//       console.log("Pool Tick Spacing:", Number(spacing));
//     } catch (error) {
//       console.error("Error fetching tick spacing:", error);
//     }
//   };

//   // 📌 Convert Liquidity Input
//   const calculateLiquidity = async () => {
//     try {
//       return ethers.parseUnits(liquidityAmount, 6);
//     } catch (error) {
//       console.error("Error calculating liquidity:", error);
//       return BigInt(0);
//     }
//   };

//   // 📌 Add Liquidity with Debugging
//   const addLiquidity = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }

//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const pool = new ethers.Contract(poolAddress, PoolABI, signer);
//       const userAddress = await signer.getAddress();

//       // Validate Inputs
//       if (!tickLower || !tickUpper || !liquidityAmount) {
//         alert("Enter Tick Lower, Tick Upper, and Liquidity Amount.");
//         setLoading(false);
//         return;
//       }

//       if (parseFloat(liquidityAmount) <= 0) {
//         alert("Liquidity amount must be greater than zero.");
//         setLoading(false);
//         return;
//       }

//       // Convert liquidity to BigInt
//       const liquidity = await calculateLiquidity();
//       if (liquidity === BigInt(0)) {
//         alert("Invalid liquidity amount.");
//         setLoading(false);
//         return;
//       }

//       // Ensure Tick Values are Valid Multiples of Tick Spacing
//       if (
//         BigInt(parseInt(tickLower)) % BigInt(tickSpacing) !== BigInt(0) ||
//         BigInt(parseInt(tickUpper)) % BigInt(tickSpacing) !== BigInt(0)
//       ) {
//         alert(`Ticks must be multiples of ${tickSpacing}`);
//         return;
//       }

//       // Check Balances & Allowances
//       const usdc = new ethers.Contract(
//         usdcAddress,
//         [
//           "function balanceOf(address) view returns (uint256)",
//           "function allowance(address, address) view returns (uint256)",
//         ],
//         provider
//       );
//       const eurc = new ethers.Contract(
//         eurcAddress,
//         [
//           "function balanceOf(address) view returns (uint256)",
//           "function allowance(address, address) view returns (uint256)",
//         ],
//         provider
//       );

//       const usdcBal = await usdc.balanceOf(userAddress);
//       const eurcBal = await eurc.balanceOf(userAddress);
//       const usdcAllowance = await usdc.allowance(userAddress, poolAddress);
//       const eurcAllowance = await eurc.allowance(userAddress, poolAddress);

//       if (usdcBal < liquidity || eurcBal < liquidity) {
//         alert("Insufficient token balance");
//         return;
//       }

//       if (usdcAllowance < liquidity || eurcAllowance < liquidity) {
//         alert("Insufficient token allowance");
//         return;
//       }

//       // Debug Logs
//       console.log("Minting with:");
//       console.log("Tick Lower:", tickLower);
//       console.log("Tick Upper:", tickUpper);
//       console.log("Liquidity Amount:", liquidity.toString());

//       // Mint Liquidity
//       const tx = await pool.mint(
//         userAddress,
//         parseInt(tickLower),
//         parseInt(tickUpper),
//         liquidity.toString(),
//         "0x",
//         { gasLimit: 20000000 }
//       );

//       console.log("Adding liquidity, tx hash:", tx.hash);
//       setTxHash(tx.hash);

//       await tx.wait();
//       alert("Liquidity Added Successfully!");
//     } catch (error) {
//       console.error("Error adding liquidity:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-semibold mb-4 text-black">
//         Manage Your Pool
//       </h2>

//       {/* Check Balances */}
//       <button
//         onClick={checkBalances}
//         className="w-full mt-2 p-2 bg-gray-500 text-white rounded"
//       >
//         Check Balances
//       </button>

//       {/* Fetch Tick Spacing */}
//       <button
//         onClick={fetchTickSpacing}
//         className="w-full mt-2 p-2 bg-gray-500 text-white rounded"
//       >
//         Fetch Tick Spacing
//       </button>

//       {/* Add Liquidity */}
//       <input
//         type="text"
//         placeholder="Tick Lower"
//         onChange={(e) => setTickLower(e.target.value)}
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <input
//         type="text"
//         placeholder="Tick Upper"
//         onChange={(e) => setTickUpper(e.target.value)}
//         className="w-full p-2 mb-2 border rounded"
//       />
//       <input
//         type="text"
//         placeholder="Liquidity Amount"
//         onChange={(e) => setLiquidityAmount(e.target.value)}
//         className="w-full p-2 mb-4 border rounded"
//       />
//       <button
//         onClick={addLiquidity}
//         className="w-full p-2 bg-purple-500 text-white rounded"
//       >
//         Add Liquidity
//       </button>

//       {txHash && (
//         <p className="mt-4 text-sm">
//           <strong>Transaction Hash:</strong> {txHash}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Pool;
"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

import NonfungiblePositionManagerABI from "../../lib/config/positionmanagerabi.json";
import PoolABI from "../../lib/config/poolabi.json";

const nonfungiblePositionManagerAddress =
  "0xa2bcBce9B2727CAd75ec42bFf76a6d85DA129B9C";

const eurcAddress = "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4"; //token0
const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; //token1

const ERC20ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const Pool = () => {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [eurcBalance, setEurcBalance] = useState("0");

  // Check Token Balances
  const checkBalances = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const usdc = new ethers.Contract(usdcAddress, ERC20ABI, provider);
      const eurc = new ethers.Contract(eurcAddress, ERC20ABI, provider);

      const usdcBal = await usdc.balanceOf(userAddress);
      const eurcBal = await eurc.balanceOf(userAddress);

      setUsdcBalance(ethers.formatUnits(usdcBal, 6));
      setEurcBalance(ethers.formatUnits(eurcBal, 6));

      console.log(`USDC Balance: ${ethers.formatUnits(usdcBal, 6)}`);
      console.log(`EURC Balance: ${ethers.formatUnits(eurcBal, 6)}`);
    } catch (error) {
      console.error("Error checking balances:", error);
    }
  };

  //  Approve USDC for the NonfungiblePositionManager
  const approveUSDC = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const usdc = new ethers.Contract(usdcAddress, ERC20ABI, signer);

      const amountToApprove = ethers.parseUnits("20", 6);
      const tx = await usdc.approve(
        nonfungiblePositionManagerAddress,
        amountToApprove
      );
      console.log("Approving USDC, tx hash:", tx.hash);
      await tx.wait();
      alert("USDC approved successfully!");
    } catch (error) {
      console.error("Error approving USDC:", error);
    }
  };

  //  Approve EURC for the NonfungiblePositionManager
  const approveEURC = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const eurc = new ethers.Contract(eurcAddress, ERC20ABI, signer);
      const amountToApprove = ethers.parseUnits("20", 6);
      const tx = await eurc.approve(
        nonfungiblePositionManagerAddress,
        amountToApprove
      );
      console.log("Approving EURC, tx hash:", tx.hash);
      await tx.wait();
      alert("EURC approved successfully!");
    } catch (error) {
      console.error("Error approving EURC:", error);
    }
  };
  const poolAddress = "0x391246c0873ff6a14aba382bb6bc7ec3fe9bd083";
  const checkPoolInfo = async () => {
    try {
      if (!poolAddress) {
        console.error("Pool address not set.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);

      // 1. Fetch the slot0 data, which includes tick
      const slot0Data = await poolContract.slot0();
      const sqrtPriceX96 = slot0Data[0];
      // const currentTick = slot0Data[1];
      const currentTickBigInt = slot0Data[1];
      // Convert BigInt to number (safe for typical Uniswap ticks)
      const currentTick = Number(currentTickBigInt);

      const tickSpacing = await poolContract.tickSpacing();

      // 3. Compute raw price from tick => 1.0001^tick
      //    This gives price of token1 in terms of token0 (assuming the pool is set up that way).
      const rawPrice = Math.pow(1.0001, currentTick);

      // 4. Adjust for decimals if you want a real-world price
      //    Because both EURC and USDC have 6 decimals, you might do something like:
      //    realPrice = rawPrice * (10^6 / 10^6) = rawPrice
      //    So in this case, they might cancel out. If token decimals differ, you adjust accordingly.

      console.log("----- POOL INFO -----");
      console.log("Current Tick:", currentTick.toString());
      console.log("Tick Spacing:", tickSpacing.toString());
      console.log("Raw Price (token1 per token0):", rawPrice);
      console.log("SqrtPriceX96:", sqrtPriceX96.toString());
      console.log("---------------------");

      alert(
        `Check console:\nTick=${currentTick}, Spacing=${tickSpacing}, Price≈${rawPrice.toFixed(
          4
        )}`
      );
    } catch (error) {
      console.error("Error fetching pool info:", error);
    }
  };

  //  Add Liquidity using the NonfungiblePositionManager’s mint Function
  const addLiquidity = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Create a contract instance for the NonfungiblePositionManager
      const npm = new ethers.Contract(
        nonfungiblePositionManagerAddress,
        NonfungiblePositionManagerABI,
        signer
      );

      // Hardcoded parameters (ensure token ordering is correct: token0 should be lower than token1 by address)
      const token0 = eurcAddress; // token0 is assumed to be EURC
      const token1 = usdcAddress; // token1 is assumed to be USDC
      const fee = 3000; // 0.3%
      const tickLower = -120;
      const tickUpper = 120;
      // Desired amounts: 1 token each (using 6 decimals)
      const amount0Desired = ethers.parseUnits("20", 6);
      const amount1Desired = ethers.parseUnits("20", 6);
      // Minimum amounts (set to 0 for testing slippage issues)
      const amount0Min = ethers.parseUnits("10", 6);
      const amount1Min = ethers.parseUnits("10", 6);
      // Deadline: 10 minutes from now
      const deadline = Math.floor(Date.now() / 1000) + 600;

      // Build mint parameters object as required by the NonfungiblePositionManager's mint function.
      const mintParams = {
        token0: token0,
        token1: token1,
        fee: fee,
        tickLower: tickLower,
        tickUpper: tickUpper,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: amount0Min.toString(),
        amount1Min: amount1Min.toString(),
        recipient: userAddress,
        deadline: deadline,
      };

      console.log(
        "Minting with NonfungiblePositionManager, params:",
        mintParams
      );

      // Call the mint function. (Ensure you've approved the NPM to spend your tokens.)
      const tx = await npm.mint(mintParams, { gasLimit: 3000000 });
      console.log("Minting liquidity, tx hash:", tx.hash);
      setTxHash(tx.hash);

      await tx.wait();
      alert("Liquidity position minted successfully!");
    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Add Liquidity via NonfungiblePositionManager
      </h2>
      <button
        onClick={checkBalances}
        className="w-full mt-2 p-2 bg-gray-500 text-white rounded"
      >
        Check Balances
      </button>
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={approveUSDC}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Approve USDC
        </button>
        <button
          onClick={approveEURC}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Approve EURC
        </button>
      </div>
      <button
        onClick={checkPoolInfo}
        className="w-full mt-2 p-2 bg-green-500 text-white rounded"
      >
        Check Pool Info
      </button>
      <button
        onClick={addLiquidity}
        className="w-full mt-2 p-2 bg-purple-500 text-white rounded"
      >
        Add Liquidity
      </button>
      {txHash && (
        <p className="mt-4 text-sm">
          <strong>Transaction Hash:</strong> {txHash}
        </p>
      )}
    </div>
  );
};

export default Pool;
