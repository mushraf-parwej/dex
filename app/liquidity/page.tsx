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
// "use client";

// import React, { useState } from "react";
// import { ethers } from "ethers";

// import NonfungiblePositionManagerABI from "../../lib/config/positionmanagerabi.json";
// import PoolABI from "../../lib/config/poolabi.json";

// const nonfungiblePositionManagerAddress =
//   "0xa2bcBce9B2727CAd75ec42bFf76a6d85DA129B9C";

// const eurcAddress = "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4"; //token0
// const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; //token1

// const ERC20ABI = [
//   "function balanceOf(address) view returns (uint256)",
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function allowance(address owner, address spender) view returns (uint256)",
// ];

// const Pool = () => {
//   const [loading, setLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");
//   const [usdcBalance, setUsdcBalance] = useState("0");
//   const [eurcBalance, setEurcBalance] = useState("0");

//   // Check Token Balances
//   const checkBalances = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       const usdc = new ethers.Contract(usdcAddress, ERC20ABI, provider);
//       const eurc = new ethers.Contract(eurcAddress, ERC20ABI, provider);

//       const usdcBal = await usdc.balanceOf(userAddress);
//       const eurcBal = await eurc.balanceOf(userAddress);

//       setUsdcBalance(ethers.formatUnits(usdcBal, 6));
//       setEurcBalance(ethers.formatUnits(eurcBal, 6));

//       console.log(`USDC Balance: ${ethers.formatUnits(usdcBal, 6)}`);
//       console.log(`EURC Balance: ${ethers.formatUnits(eurcBal, 6)}`);
//     } catch (error) {
//       console.error("Error checking balances:", error);
//     }
//   };

//   //  Approve USDC for the NonfungiblePositionManager
//   const approveUSDC = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const usdc = new ethers.Contract(usdcAddress, ERC20ABI, signer);

//       const amountToApprove = ethers.parseUnits("20", 6);
//       const tx = await usdc.approve(
//         nonfungiblePositionManagerAddress,
//         amountToApprove
//       );
//       console.log("Approving USDC, tx hash:", tx.hash);
//       await tx.wait();
//       alert("USDC approved successfully!");
//     } catch (error) {
//       console.error("Error approving USDC:", error);
//     }
//   };

//   //  Approve EURC for the NonfungiblePositionManager
//   const approveEURC = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const eurc = new ethers.Contract(eurcAddress, ERC20ABI, signer);
//       const amountToApprove = ethers.parseUnits("20", 6);
//       const tx = await eurc.approve(
//         nonfungiblePositionManagerAddress,
//         amountToApprove
//       );
//       console.log("Approving EURC, tx hash:", tx.hash);
//       await tx.wait();
//       alert("EURC approved successfully!");
//     } catch (error) {
//       console.error("Error approving EURC:", error);
//     }
//   };
//   const poolAddress = "0x391246c0873ff6a14aba382bb6bc7ec3fe9bd083";
//   const checkPoolInfo = async () => {
//     try {
//       if (!poolAddress) {
//         console.error("Pool address not set.");
//         return;
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);

//       // 1. Fetch the slot0 data, which includes tick
//       const slot0Data = await poolContract.slot0();
//       const sqrtPriceX96 = slot0Data[0];
//       // const currentTick = slot0Data[1];
//       const currentTickBigInt = slot0Data[1];
//       // Convert BigInt to number (safe for typical Uniswap ticks)
//       const currentTick = Number(currentTickBigInt);

//       const tickSpacing = await poolContract.tickSpacing();

//       // 3. Compute raw price from tick => 1.0001^tick
//       //    This gives price of token1 in terms of token0 (assuming the pool is set up that way).
//       const rawPrice = Math.pow(1.0001, currentTick);

//       // 4. Adjust for decimals if you want a real-world price
//       //    Because both EURC and USDC have 6 decimals, you might do something like:
//       //    realPrice = rawPrice * (10^6 / 10^6) = rawPrice
//       //    So in this case, they might cancel out. If token decimals differ, you adjust accordingly.

//       console.log("----- POOL INFO -----");
//       console.log("Current Tick:", currentTick.toString());
//       console.log("Tick Spacing:", tickSpacing.toString());
//       console.log("Raw Price (token1 per token0):", rawPrice);
//       console.log("SqrtPriceX96:", sqrtPriceX96.toString());
//       console.log("---------------------");

//       alert(
//         `Check console:\nTick=${currentTick}, Spacing=${tickSpacing}, Price≈${rawPrice.toFixed(
//           4
//         )}`
//       );
//     } catch (error) {
//       console.error("Error fetching pool info:", error);
//     }
//   };

//   //  Add Liquidity using the NonfungiblePositionManager’s mint Function
//   const addLiquidity = async () => {
//     if (!window.ethereum) {
//       alert("Please install MetaMask!");
//       return;
//     }
//     try {
//       setLoading(true);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       // Create a contract instance for the NonfungiblePositionManager
//       const npm = new ethers.Contract(
//         nonfungiblePositionManagerAddress,
//         NonfungiblePositionManagerABI,
//         signer
//       );

//       // Hardcoded parameters (ensure token ordering is correct: token0 should be lower than token1 by address)
//       const token0 = eurcAddress; // token0 is assumed to be EURC
//       const token1 = usdcAddress; // token1 is assumed to be USDC
//       const fee = 3000; // 0.3%
//       const tickLower = -120;
//       const tickUpper = 120;
//       // Desired amounts: 1 token each (using 6 decimals)
//       const amount0Desired = ethers.parseUnits("20", 6);
//       const amount1Desired = ethers.parseUnits("20", 6);
//       // Minimum amounts (set to 0 for testing slippage issues)
//       const amount0Min = ethers.parseUnits("10", 6);
//       const amount1Min = ethers.parseUnits("10", 6);
//       // Deadline: 10 minutes from now
//       const deadline = Math.floor(Date.now() / 1000) + 600;

//       // Build mint parameters object as required by the NonfungiblePositionManager's mint function.
//       const mintParams = {
//         token0: token0,
//         token1: token1,
//         fee: fee,
//         tickLower: tickLower,
//         tickUpper: tickUpper,
//         amount0Desired: amount0Desired.toString(),
//         amount1Desired: amount1Desired.toString(),
//         amount0Min: amount0Min.toString(),
//         amount1Min: amount1Min.toString(),
//         recipient: userAddress,
//         deadline: deadline,
//       };

//       console.log(
//         "Minting with NonfungiblePositionManager, params:",
//         mintParams
//       );

//       // Call the mint function. (Ensure you've approved the NPM to spend your tokens.)
//       const tx = await npm.mint(mintParams, { gasLimit: 3000000 });
//       console.log("Minting liquidity, tx hash:", tx.hash);
//       setTxHash(tx.hash);

//       await tx.wait();
//       alert("Liquidity position minted successfully!");
//     } catch (error) {
//       console.error("Error adding liquidity:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-semibold mb-4 text-black">
//         Add Liquidity via NonfungiblePositionManager
//       </h2>
//       <button
//         onClick={checkBalances}
//         className="w-full mt-2 p-2 bg-gray-500 text-white rounded"
//       >
//         Check Balances
//       </button>
//       <div className="flex flex-col gap-2 mt-2">
//         <button
//           onClick={approveUSDC}
//           className="w-full p-2 bg-blue-500 text-white rounded"
//         >
//           Approve USDC
//         </button>
//         <button
//           onClick={approveEURC}
//           className="w-full p-2 bg-blue-500 text-white rounded"
//         >
//           Approve EURC
//         </button>
//       </div>
//       <button
//         onClick={checkPoolInfo}
//         className="w-full mt-2 p-2 bg-green-500 text-white rounded"
//       >
//         Check Pool Info
//       </button>
//       <button
//         onClick={addLiquidity}
//         className="w-full mt-2 p-2 bg-purple-500 text-white rounded"
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

////////////////////////////////////////////////////////////////
// "use client";

// import React, { useState, useEffect } from "react";
// import { ethers, parseUnits } from "ethers";
// // Uniswap SDK imports
// import { Token, Percent } from "@uniswap/sdk-core";
// import {
//   Pool,
//   Position,
//   nearestUsableTick,
//   FeeAmount,
//   NonfungiblePositionManager as NFPMHelper,
//   computePoolAddress,
// } from "@uniswap/v3-sdk";

// // Import ABIs
// import NonfungiblePositionManagerABI from "../../lib/config/positionmanagerabi.json";
// import PoolABI from "../../lib/config/poolabi.json";

// // Define constants
// const poolAddress = "0x391246c0873ff6a14aba382bb6bc7ec3fe9bd083";
// const eurcAddress = "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4"; // token0
// const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // token1

// // Uniswap protocol constants
// const chainId = 11155111; // Sepolia testnet
// const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773"; // Uniswap V3 factory on Sepolia
// const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
//   "0xa2bcBce9B2727CAd75ec42bFf76a6d85DA129B9C";

// // Minimal ERC20 ABI
// const ERC20ABI = [
//   "function balanceOf(address) view returns (uint256)",
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function allowance(address owner, address spender) view returns (uint256)",
// ];

// const AddLiquidity = () => {
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [signer, setSigner] = useState<ethers.Signer | null>(null);
//   const [account, setAccount] = useState<string>("");
//   const [poolData, setPoolData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [txHash, setTxHash] = useState<string>("");

//   // Initialize provider and signer
//   useEffect(() => {
//     async function init() {
//       if (window.ethereum) {
//         const _provider = new ethers.BrowserProvider(window.ethereum);
//         setProvider(_provider);
//         await _provider.send("eth_requestAccounts", []);
//         const _signer = await _provider.getSigner();
//         setSigner(_signer);
//         const address = await _signer.getAddress();
//         setAccount(address);
//       }
//     }
//     init();
//   }, []);

//   // Fetch pool data from on-chain and return it locally
//   const fetchPoolData = async (): Promise<any> => {
//     if (!provider) return null;
//     try {
//       // Create a minimal pool contract interface
//       const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
//       const [liquidity, slot0, token0, token1] = await Promise.all([
//         poolContract.liquidity(),
//         poolContract.slot0(),
//         poolContract.token0(),
//         poolContract.token1(),
//       ]);
//       const poolInfo = {
//         liquidity: liquidity.toString(),
//         sqrtPriceX96: slot0.sqrtPriceX96.toString(),
//         tick: slot0.tick, // raw tick from the pool (might be a BigInt)
//         token0,
//         token1,
//       };
//       console.log("Fetched pool data:", poolInfo);
//       setPoolData(poolInfo);
//       return poolInfo;
//     } catch (error) {
//       console.error("Error fetching pool data:", error);
//       return null;
//     }
//   };

//   // Add liquidity and mint a position
//   const addLiquidity = async () => {
//     if (!provider || !signer || !account) {
//       alert("Wallet not connected");
//       return;
//     }
//     setLoading(true);
//     try {
//       // Approve tokens for the NonfungiblePositionManager
//       const token0Contract = new ethers.Contract(eurcAddress, ERC20ABI, signer);
//       const token1Contract = new ethers.Contract(usdcAddress, ERC20ABI, signer);
//       const amount0 = parseUnits("1", 6);
//       const amount1 = parseUnits("5000", 6);
//       console.log("Approving token transfers...");
//       const tx0 = await token0Contract.approve(
//         NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
//         amount0
//       );
//       await tx0.wait();
//       const tx1 = await token1Contract.approve(
//         NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
//         amount1
//       );
//       await tx1.wait();
//       console.log("Token approvals complete.");

//       // Create token instances using Uniswap SDK
//       const TokenA = new Token(chainId, eurcAddress, 6, "EURC", "EURC Token");
//       const TokenB = new Token(chainId, usdcAddress, 6, "USDC", "USD Coin");

//       // Use local pool data (if already in state) or fetch new data
//       const data = poolData || (await fetchPoolData());
//       if (!data) throw new Error("Pool data not available");
//       console.log("Using pool data:", data);

//       // Convert tick from BigInt to number if necessary
//       const currentTick =
//         typeof data.tick === "bigint" ? Number(data.tick) : data.tick;

//       // Create a Pool instance using Uniswap SDK.
//       const poolInstance = new Pool(
//         TokenA,
//         TokenB,
//         FeeAmount.MEDIUM,
//         data.sqrtPriceX96,
//         data.liquidity,
//         currentTick
//       );
//       console.log("Pool instance created:", poolInstance);

//       // Determine tick spacing from pool instance
//       const tickSpacing = poolInstance.tickSpacing;
//       let lowerTick: number;
//       let upperTick: number;
//       if (data.liquidity === "0") {
//         // As the first liquidity provider, use a narrower range around the current tick (0)
//         lowerTick = -60;
//         upperTick = 60;
//         console.log(
//           "Pool has zero liquidity. Using default tick range: lowerTick = -60, upperTick = 60"
//         );
//       } else {
//         lowerTick =
//           nearestUsableTick(currentTick, tickSpacing) - 2 * tickSpacing;
//         upperTick =
//           nearestUsableTick(currentTick, tickSpacing) + 2 * tickSpacing;
//         console.log("Pool has existing liquidity. Using computed tick range:");
//       }
//       console.log("Tick spacing:", tickSpacing);
//       console.log("Lower tick:", lowerTick, "Upper tick:", upperTick);

//       // Create a Position instance from amounts
//       const position = Position.fromAmounts({
//         pool: poolInstance,
//         tickLower: lowerTick,
//         tickUpper: upperTick,
//         amount0: amount0.toString(),
//         amount1: amount1.toString(),
//         useFullPrecision: true,
//       });
//       console.log("Position instance created:", position);

//       // Define mint options (recipient, deadline, and slippage tolerance)
//       const mintOptions = {
//         recipient: account,
//         deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
//         slippageTolerance: new Percent(50, 10_000), // 0.5% slippage tolerance
//       };

//       // Use the SDK helper to get calldata and value for the mint transaction
//       const { calldata, value } = NFPMHelper.addCallParameters(
//         position,
//         mintOptions
//       );
//       console.log("Calldata generated:", calldata, "Value:", value);

//       // Build the transaction object
//       const tx = {
//         to: NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
//         data: calldata,
//         value: value, // typically 0 for ERC20-based positions
//       };

//       // Send the transaction
//       const response = await signer.sendTransaction(tx);
//       console.log("Mint transaction sent:", response.hash);
//       setTxHash(response.hash);
//       const receipt = await response.wait();
//       console.log("Mint transaction receipt:", receipt);
//       alert("Liquidity position minted successfully!");
//     } catch (error: any) {
//       console.error("Error adding liquidity:", error);
//       alert("Error adding liquidity. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">Add Liquidity</h2>
//       <p>
//         <strong>Pool Address:</strong> {poolAddress}
//       </p>
//       <p>
//         <strong>Token0 (EURC):</strong> {eurcAddress}
//       </p>
//       <p>
//         <strong>Token1 (USDC):</strong> {usdcAddress}
//       </p>
//       <button
//         onClick={fetchPoolData}
//         className="w-full mt-2 p-2 bg-green-500 text-white rounded"
//       >
//         Fetch Pool Data
//       </button>
//       <button
//         onClick={addLiquidity}
//         disabled={loading}
//         className="w-full mt-2 p-2 bg-purple-500 text-white rounded"
//       >
//         {loading ? "Processing..." : "Add Liquidity"}
//       </button>
//       {txHash && (
//         <p className="mt-4 text-sm">
//           <strong>Transaction Hash:</strong> {txHash}
//         </p>
//       )}
//     </div>
//   );
// };

// export default AddLiquidity;
///////////////////////////////////////////////////
"use client";

import React, { useState, useEffect } from "react";
import { ethers, parseUnits } from "ethers";
// Uniswap SDK imports
import { Token, Percent } from "@uniswap/sdk-core";
import {
  Pool,
  Position,
  nearestUsableTick,
  FeeAmount,
  NonfungiblePositionManager as NFPMHelper,
  computePoolAddress,
} from "@uniswap/v3-sdk";

// Import ABIs
import NonfungiblePositionManagerABI from "../../lib/config/positionmanagerabi.json";
import PoolABI from "../../lib/config/poolabi.json";

// Define constants
// const poolAddress = "0x391246c0873ff6a14aba382bb6bc7ec3fe9bd083";
const poolAddress = "0x3ECDb2e215357c5C186fFC734B45277a831377b3";

// const eurcAddress = "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4"; // token0
// const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // token1
const token0 = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const token1 = "0x7daf26D64a62e2e1dB838C84bCAc5bdDb3b5D926";
// Uniswap protocol constants
const chainId = 11155111; // Sepolia testnet
const factoryAddress = "0x32e175A35150847cFe9172cca3810e1d7E48f773"; // Uniswap V3 factory on Sepolia
const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  "0xa2bcBce9B2727CAd75ec42bFf76a6d85DA129B9C";

// Minimal ERC20 ABI
const ERC20ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const AddLiquidity = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>("");
  const [poolData, setPoolData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  // Initialize provider and signer
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

  // Fetch pool data from on-chain and return it locally
  const fetchPoolData = async (): Promise<any> => {
    if (!provider) return null;
    try {
      // Create a minimal pool contract interface
      const poolContract = new ethers.Contract(poolAddress, PoolABI, provider);
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

  // Add liquidity and mint a position
  const addLiquidity = async () => {
    if (!provider || !signer || !account) {
      alert("Wallet not connected");
      return;
    }
    setLoading(true);
    try {
      // Approve tokens for the NonfungiblePositionManager
      const token0Contract = new ethers.Contract(token0, ERC20ABI, signer);
      const token1Contract = new ethers.Contract(token1, ERC20ABI, signer);
      const amount0 = parseUnits("1", 6);
      const amount1 = parseUnits("5000", 6);
      console.log("Approving token transfers...");
      const tx0 = await token0Contract.approve(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        amount1
      );
      await tx0.wait();
      const tx1 = await token1Contract.approve(
        NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        amount0
      );
      await tx1.wait();
      console.log("Token approvals complete.");

      // Create token instances using Uniswap SDK
      const TokenA = new Token(chainId, token1, 6, "USDC", "USDC Token");
      const TokenB = new Token(chainId, token0, 18, "ETH", "ETH Coin");

      // Use local pool data (if already in state) or fetch new data
      const data = poolData || (await fetchPoolData());
      if (!data) throw new Error("Pool data not available");
      console.log("Using pool data:", data);

      // Convert tick from BigInt to number if necessary
      const currentTick =
        typeof data.tick === "bigint" ? Number(data.tick) : data.tick;

      // Create a Pool instance using Uniswap SDK.
      const poolInstance = new Pool(
        TokenA,
        TokenB,
        FeeAmount.MEDIUM,
        data.sqrtPriceX96,
        data.liquidity,
        currentTick
      );
      console.log("Pool instance created:", poolInstance);

      // Determine tick spacing from pool instance
      const tickSpacing = poolInstance.tickSpacing;
      let lowerTick: number;
      let upperTick: number;
      if (data.liquidity === "0") {
        // As the first liquidity provider, use a narrower range around the current tick (0)
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

      // Create a Position instance from amounts
      const position = Position.fromAmounts({
        pool: poolInstance,
        tickLower: lowerTick,
        tickUpper: upperTick,
        amount0: amount0.toString(),
        amount1: amount1.toString(),
        useFullPrecision: true,
      });
      console.log("Position instance created:", position);

      // Define mint options (recipient, deadline, and slippage tolerance)
      const mintOptions = {
        recipient: account,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
        slippageTolerance: new Percent(50, 10_000), // 0.5% slippage tolerance
      };

      // Use the SDK helper to get calldata and value for the mint transaction
      const { calldata, value } = NFPMHelper.addCallParameters(
        position,
        mintOptions
      );
      console.log("Calldata generated:", calldata, "Value:", value);

      // Build the transaction object
      let tx: ethers.TransactionRequest = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESS, // must be a string address
        data: calldata,
        value: value, // typically "0" for ERC20-based positions
      };

      // Estimate gas and add a 20% buffer using native BigInt arithmetic without literals
      const gasEstimate: bigint = await signer.estimateGas(tx);
      const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);
      tx.gasLimit = gasLimit;

      console.log("Transaction object with gas limit:", tx);
      // Send the transaction
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Liquidity</h2>
      <p>
        <strong>Pool Address:</strong> {poolAddress}
      </p>
      <p>
        <strong>Token0 (EURC):</strong> {token0}
      </p>
      <p>
        <strong>Token1 (USDC):</strong> {token1}
      </p>
      <button
        onClick={fetchPoolData}
        className="w-full mt-2 p-2 bg-green-500 text-white rounded"
      >
        Fetch Pool Data
      </button>
      <button
        onClick={addLiquidity}
        disabled={loading}
        className="w-full mt-2 p-2 bg-purple-500 text-white rounded"
      >
        {loading ? "Processing..." : "Add Liquidity"}
      </button>
      {txHash && (
        <p className="mt-4 text-sm">
          <strong>Transaction Hash:</strong> {txHash}
        </p>
      )}
    </div>
  );
};

export default AddLiquidity;
