// "use client";

// import { useState, useCallback } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useAccount } from "wagmi";
// import toast from "react-hot-toast";
// import { ethers } from "ethers";
// import { NonceManager, DutchOrderBuilder } from "@uniswap/uniswapx-sdk";
// import { TokenInput } from "../web3/swap/TokenInput";
// import { SwapButton } from "../web3/swap/SwapButton";
// import { useSwap } from "@/hooks/swap/useSwap";
// import { useCoinStore } from "@/store";
// import { Card } from "@/components/ui/card";
// import { Input } from "../ui/input";

// import limitOrderReactorAbi from "../../lib/config/limitOrderReactorAbi.json";
// import swapRouter02ExecutorAbi from "../../lib/config/swapRouter02ExecutorAbi.json";

// // Deployed contract addresses (update these if needed)
// const LIMIT_ORDER_REACTOR_ADDRESS =
//   "0x69321E31b08b31E3D6453a3BaeC4013813d4b8A9";
// const SWAP_ROUTER02_EXECUTOR_ADDRESS =
//   "0xeD3e638A3B7Fdba6a290cB1bc2572913fe841d71";

// // Map expiry options to durations in seconds
// const expiryDurations: { [key: string]: number } = {
//   "1 day": 86400,
//   "1 week": 604800,
//   "1 Month": 2592000,
//   "1 Year": 31536000,
// };

// const buttons = ["Market", "+1%", "+5%", "+10%"];
// const expiryOptions = ["1 day", "1 week", "1 Month", "1 Year"];

// export default function LimitComponent() {
//   // UI states and wallet connection
//   const [expiry, setExpiry] = useState("1 day");
//   const [activeButton, setActiveButton] = useState(buttons[0]);
//   const { isConnected, address } = useAccount();
//   const { coin1, coin2 } = useCoinStore();

//   // State for order submission/execution flow
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [orderReady, setOrderReady] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [orderData, setOrderData] = useState({
//     serializedOrder: null,
//     signature: null,
//   });
//   const [error, setError] = useState<string | null>(null);

//   // Swap hook to manage amounts
//   const {
//     sellAmount,
//     buyAmount,
//     handleSellAmountChange,
//     handleBuyAmountChange,
//     handleSwap,
//   } = useSwap();

//   // Ensure required fields are present
//   const isFormValid =
//     sellAmount &&
//     buyAmount &&
//     coin1 &&
//     coin2 &&
//     coin1.address &&
//     coin2.address &&
//     Number(sellAmount) > 0 &&
//     Number(buyAmount) > 0 &&
//     address;

//   // STEP 1: Create, sign, and broadcast the order
//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!isFormValid) {
//         setError("Please ensure all fields are filled correctly.");
//         toast.error("Please ensure all fields are filled correctly.");
//         return;
//       }
//       setError(null);

//       // Debug logs to ensure all values are defined
//       console.log("coin1:", coin1);
//       console.log("coin2:", coin2);
//       console.log("sellAmount:", sellAmount);
//       console.log("buyAmount:", buyAmount);
//       console.log("address:", address);

//       try {
//         if (!window.ethereum) {
//           throw new Error("Please install MetaMask!");
//         }

//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const token0Contract = new ethers.Contract(
//           coin1.address,
//           ["function decimals() view returns (uint8)"],
//           provider
//         );
//         const token1Contract = new ethers.Contract(
//           coin2.address,
//           ["function decimals() view returns (uint8)"],
//           provider
//         );

//         const decimals0 = await token0Contract.decimals();
//         const decimals1 = await token1Contract.decimals();

//         console.log(
//           `Decimals: ${coin1.symbol} = ${decimals0}, ${coin2.symbol} = ${decimals1}`
//         );
//         // Calculate deadline from expiry selection
//         const now = Math.floor(Date.now() / 1000);
//         const expirySeconds = expiryDurations[expiry];
//         const deadline = now + expirySeconds;

//         // Use the NonceManager from the SDK to fetch a nonce
//         const chainId = 11155111; // update to your network's chainId if necessary
//         const nonceMgr = new NonceManager(provider, 1);
//         const nonce = await nonceMgr.useNonce(address);

//         // Log the nonce to verify it's defined
//         console.log("nonce:", nonce);
//         if (nonce === undefined || nonce === null) {
//           throw new Error("Nonce is undefined");
//         }

//         // Build the order using the DutchOrderBuilder
//         const builder = new DutchOrderBuilder(chainId);
//         const order = builder
//           .deadline(deadline)
//           .decayStartTime(deadline - 100)
//           .decayEndTime(deadline)
//           .nonce(nonce)
//           .input({
//             token: coin1.address,
//             amount: ethers.utils.parseUnits(sellAmount || "0", decimals0),
//           })
//           .output({
//             token: coin2.address,
//             startAmount: ethers.utils.parseUnits(buyAmount || "0", decimals1),
//             endAmount: ethers.utils.parseUnits(buyAmount || "0", decimals1),
//             recipient: address,
//           })
//           .swapper(LIMIT_ORDER_REACTOR_ADDRESS)
//           .build();
//         order.permit2Address = "0xC348b507B1f826f7A020a0709545566508D40fc4";

//         console.log("Order built:", order);

//         // Get the EIP-712 data for signing the order
//         const { domain, types, values } = order.permitData();
//         console.log("Permit data:", { domain, types, values });
//         const signature = await signer._signTypedData(domain, types, values);

//         // Serialize the order so that it can be broadcast or sent on-chain
//         const serializedOrder = order.serialize();

//         console.log("Serialized Order:", serializedOrder);
//         console.log("Signature:", signature);

//         setOrderData({
//           serializedOrder,
//           signature,
//         });
//         setShowConfirmation(true);
//         setIsSubmitted(true);
//         setOrderReady(true);
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Order submission failed");
//         toast.error("Order submission failed");
//       }
//     },
//     [isFormValid, expiry, sellAmount, buyAmount, coin1, coin2, address]
//   );

//   // STEP 2: Execute the order via the executor contract (simulate filler action)
//   const handleExecute = useCallback(async () => {
//     try {
//       if (!orderData.serializedOrder || !orderData.signature) {
//         throw new Error("No order data available for execution");
//       }
//       if (!window.ethereum) {
//         throw new Error("Please install MetaMask!");
//       }
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();

//       // Create a signedOrder object that matches the expected struct:
//       // { order: bytes, sig: bytes }
//       const signedOrder = {
//         order: orderData.serializedOrder,
//         sig: orderData.signature,
//       };

//       // Build dummy callback data.
//       const callbackData = ethers.AbiCoder.defaultAbiCoder().encode(
//         ["address[]", "address[]", "bytes[]"],
//         [[], [], []]
//       );

//       // Create an instance of the SwapRouter02Executor contract
//       const executor = new ethers.Contract(
//         SWAP_ROUTER02_EXECUTOR_ADDRESS,
//         swapRouter02ExecutorAbi,
//         signer
//       );

//       // Execute the order
//       const tx = await executor.execute(signedOrder, callbackData);
//       await tx.wait();
//       toast.success("Order executed successfully");
//       console.log("Execution transaction:", tx);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Order execution failed");
//       toast.error("Order execution failed");
//     }
//   }, [orderData]);

//   return (
//     <main className="md:min-w-[480px] w-full min-h-[420px] z-30 mx-auto p-6">
//       <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
//         <div className="w-full rounded-xl p-4 bg-[#E0E0E04D]">
//           <div className="flex flex-col gap-2">
//             <div className="flex justify-between items-center">
//               {coin1 && coin2 ? (
//                 <div>
//                   <span className="text-sm text-neutral-700">When 1 </span>
//                   <span className="font-semibold text-neutral-800">
//                     {coin1.symbol}{" "}
//                     <span className="font-normal"> is worth</span>
//                   </span>
//                 </div>
//               ) : (
//                 <div>Limit Price</div>
//               )}
//             </div>
//             <div className="flex justify-between items-center">
//               <Input
//                 disabled={!(coin1 && coin2)}
//                 className="focus:outline-none text-lg"
//                 placeholder="0.00"
//               />
//             </div>
//           </div>
//           <div className="flex gap-2 mt-3">
//             {buttons.map((label) => (
//               <button
//                 key={label}
//                 onClick={() => setActiveButton(label)}
//                 className={`w-[69px] h-[28px] rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
//                   activeButton === label
//                     ? "text-red-500 bg-[#FFF7F7] border-[#CE192D66]"
//                     : "text-gray-900 bg-transparent border-none"
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <AnimatePresence mode="wait">
//           {isSubmitted ? (
//             <motion.div
//               key="progress"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="p-4 text-center">
//                 <p className="text-lg font-semibold">Limit Order Submitted</p>
//                 {orderReady && (
//                   <button
//                     onClick={handleExecute}
//                     className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//                   >
//                     Execute Order (simulate filler)
//                   </button>
//                 )}
//                 <button
//                   onClick={() => {
//                     setIsSubmitted(false);
//                     setShowConfirmation(false);
//                     setOrderReady(false);
//                   }}
//                   className="mt-2 text-blue-500 underline"
//                 >
//                   Go Back
//                 </button>
//               </div>
//             </motion.div>
//           ) : showConfirmation ? (
//             <motion.div
//               key="confirmation"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="p-4 text-center">
//                 <p className="text-lg font-semibold">Confirm Limit Order</p>
//                 <div className="flex justify-center gap-4 mt-2">
//                   <button
//                     onClick={() => setShowConfirmation(false)}
//                     className="text-red-500 underline"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     className="text-green-500 underline"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="form"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               transition={{ duration: 0.2 }}
//             >
//               <form onSubmit={handleSubmit} className="space-y-5 relative">
//                 <div className="flex flex-col relative gap-2">
//                   <TokenInput
//                     label="Sell"
//                     amount={sellAmount}
//                     onChange={handleSellAmountChange}
//                     coinType="coin1"
//                     coinSelect={true}
//                   />
//                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 z-20">
//                     <SwapButton onSwap={handleSwap} />
//                   </div>
//                   <TokenInput
//                     label="Buy"
//                     amount={buyAmount}
//                     onChange={handleBuyAmountChange}
//                     coinType="coin2"
//                     coinSelect={true}
//                   />
//                 </div>
//                 {error && (
//                   <div className="text-red-500 text-sm mt-2">{error}</div>
//                 )}
//               </form>
//               <div className="flex justify-between p-3 rounded-lg mt-10">
//                 <p className="text-gray-500 text-md">Expiry</p>
//                 <div className="flex gap-1">
//                   {expiryOptions.map((option) => (
//                     <button
//                       key={option}
//                       onClick={() => setExpiry(option)}
//                       className={`px-3 py-1 rounded-lg text-sm font-semibold ${
//                         expiry === option
//                           ? "bg-[#FFF7F7] text-red-500 border border-[#CE192D66]"
//                           : "text-gray-900"
//                       }`}
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <button
//                 onClick={handleSubmit}
//                 className="w-full text-gray-600 py-2 rounded-lg cursor-pointer bg-gray-300"
//               >
//                 Confirm
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Card>
//     </main>
//   );
// }
"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { TokenInput } from "../web3/swap/TokenInput";
import { SwapButton } from "../web3/swap/SwapButton";
import { useSwap } from "@/hooks/swap/useSwap";
import { useCoinStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Input } from "../ui/input";

import swapRouter02ExecutorAbi from "../../lib/config/swapRouter02ExecutorAbi.json";

// Deployed contract addresses (update these if needed)
const LIMIT_ORDER_REACTOR_ADDRESS =
  "0x69321E31b08b31E3D6453a3BaeC4013813d4b8A9";
const SWAP_ROUTER02_EXECUTOR_ADDRESS =
  "0xeD3e638A3B7Fdba6a290cB1bc2572913fe841d71";

// Map expiry options to durations in seconds
const expiryDurations = {
  "1 day": 86400,
  "1 week": 604800,
  "1 Month": 2592000,
  "1 Year": 31536000,
};

const buttons = ["Market", "+1%", "+5%", "+10%"];
const expiryOptions = ["1 day", "1 week", "1 Month", "1 Year"];

export default function LimitComponent() {
  // UI states and wallet connection
  const [expiry, setExpiry] = useState("1 day");
  const [activeButton, setActiveButton] = useState(buttons[0]);
  const { isConnected, address } = useAccount();
  const { coin1, coin2 } = useCoinStore();

  // State for order submission/execution flow
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderReady, setOrderReady] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState({
    serializedOrder: null,
    signature: null,
  });
  const [error, setError] = useState(null);

  // Swap hook to manage amounts
  const {
    sellAmount,
    buyAmount,
    handleSellAmountChange,
    handleBuyAmountChange,
    handleSwap,
  } = useSwap();

  // Ensure required fields are present
  const isFormValid =
    sellAmount &&
    buyAmount &&
    coin1 &&
    coin2 &&
    coin1.address &&
    coin2.address &&
    Number(sellAmount) > 0 &&
    Number(buyAmount) > 0 &&
    address;

  // STEP 1: Create, sign, and broadcast the order using direct contract interaction
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isFormValid) {
        setError("Please ensure all fields are filled correctly.");
        toast.error("Please ensure all fields are filled correctly.");
        return;
      }
      setError(null);

      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Fetch token decimals
        const token0Contract = new ethers.Contract(
          coin1.address,
          ["function decimals() view returns (uint8)"],
          provider
        );
        const token1Contract = new ethers.Contract(
          coin2.address,
          ["function decimals() view returns (uint8)"],
          provider
        );
        const decimals0 = await token0Contract.decimals();
        const decimals1 = await token1Contract.decimals();

        console.log(
          `Decimals: ${coin1.symbol} = ${decimals0}, ${coin2.symbol} = ${decimals1}`
        );

        // Calculate deadline, decay times
        const now = Math.floor(Date.now() / 1000);
        const expirySeconds = expiryDurations[expiry];
        const deadline = now + expirySeconds;
        const decayStartTime = deadline - 100;
        const decayEndTime = deadline;

        // For demonstration, we'll use 0 (you should replace this with a proper nonce).
        const nonce = 0;

        // --- MANUALLY CONSTRUCT THE ORDER OBJECT ---
        // Adjust the fields and order according to your smart contract's struct definition.
        const order = {
          nonce: nonce,
          tokenIn: coin1.address,
          amountIn: ethers.utils.parseUnits(sellAmount, decimals0).toString(),
          tokenOut: coin2.address,
          startAmountOut: ethers.utils
            .parseUnits(buyAmount, decimals1)
            .toString(),
          endAmountOut: ethers.utils
            .parseUnits(buyAmount, decimals1)
            .toString(),
          deadline: deadline,
          decayStartTime: decayStartTime,
          decayEndTime: decayEndTime,
          swapper: LIMIT_ORDER_REACTOR_ADDRESS,
          permit2Address: "0xC348b507B1f826f7A020a0709545566508D40fc4",
        };
        console.log("order", order);
        // --- DEFINE EIP-712 DOMAIN AND TYPES ---
        // Make sure these match what your smart contract expects.
        const chainId = 11155111;
        const domain = {
          name: "LimitOrder", //  the name your contract or protocol uses
          version: "1",
          chainId,
          verifyingContract: LIMIT_ORDER_REACTOR_ADDRESS,
        };

        const types = {
          Order: [
            { name: "nonce", type: "uint256" },
            { name: "tokenIn", type: "address" },
            { name: "amountIn", type: "uint256" },
            { name: "tokenOut", type: "address" },
            { name: "startAmountOut", type: "uint256" },
            { name: "endAmountOut", type: "uint256" },
            { name: "deadline", type: "uint256" },
            { name: "decayStartTime", type: "uint256" },
            { name: "decayEndTime", type: "uint256" },
            { name: "swapper", type: "address" },
            { name: "permit2Address", type: "address" },
          ],
        };

        // --- SIGN THE ORDER USING EIP-712 ---
        const signature = await signer._signTypedData(domain, types, order);
        console.log("Signature:", signature);

        // --- SERIALIZE THE ORDER ---
        // Here we encode the order using ABI encoding. This must match the struct layout your contract uses.
        const serializedOrder = ethers.utils.defaultAbiCoder.encode(
          [
            "uint256", // nonce
            "address", // tokenIn
            "uint256", // amountIn
            "address", // tokenOut
            "uint256", // startAmountOut
            "uint256", // endAmountOut
            "uint256", // deadline
            "uint256", // decayStartTime
            "uint256", // decayEndTime
            "address", // swapper
            "address", // permit2Address
          ],
          [
            order.nonce,
            order.tokenIn,
            order.amountIn,
            order.tokenOut,
            order.startAmountOut,
            order.endAmountOut,
            order.deadline,
            order.decayStartTime,
            order.decayEndTime,
            order.swapper,
            order.permit2Address,
          ]
        );

        console.log("Serialized Order:", serializedOrder);

        // You can now use the serialized order and signature to broadcast the order on-chain.
        // For example, if your executor contract has a function like:
        // function execute(bytes order, bytes signature) external { ... }
        setOrderData({
          serializedOrder,
          signature,
        });
        setShowConfirmation(true);
        setIsSubmitted(true);
        setOrderReady(true);
      } catch (err) {
        console.error(err);
        setError(err.message || "Order submission failed");
        toast.error("Order submission failed");
      }
    },
    [isFormValid, expiry, sellAmount, buyAmount, coin1, coin2, address]
  );

  // STEP 2: Execute the order via the executor contract (simulate filler action)
  const handleExecute = useCallback(async () => {
    try {
      if (!orderData.serializedOrder || !orderData.signature) {
        throw new Error("No order data available for execution");
      }
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a SignedOrder object that includes both the serialized order and signature.
      const signedOrder = {
        order: orderData.serializedOrder,
        sig: orderData.signature,
      };

      // Create an instance of the SwapRouter02Executor contract
      const executor = new ethers.Contract(
        SWAP_ROUTER02_EXECUTOR_ADDRESS,
        swapRouter02ExecutorAbi,
        signer
      );

      // Build dummy callback data (adjust if needed)
      const callbackData = ethers.utils.defaultAbiCoder.encode(
        ["address[]", "address[]", "bytes[]"],
        [[], [], []]
      );

      // Execute the order by passing the signedOrder and callbackData.
      const tx = await executor.execute(signedOrder, callbackData);
      await tx.wait();
      toast.success("Order executed successfully");
      console.log("Execution transaction:", tx);
    } catch (err) {
      console.error(err);
      setError(err.message || "Order execution failed");
      toast.error("Order execution failed");
    }
  }, [orderData]);

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px] z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <div className="w-full rounded-xl p-4 bg-[#E0E0E04D]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              {coin1 && coin2 ? (
                <div>
                  <span className="text-sm text-neutral-700">When 1 </span>
                  <span className="font-semibold text-neutral-800">
                    {coin1.symbol}{" "}
                    <span className="font-normal"> is worth</span>
                  </span>
                </div>
              ) : (
                <div>Limit Price</div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <Input
                disabled={!(coin1 && coin2)}
                className="focus:outline-none text-lg"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {buttons.map((label) => (
              <button
                key={label}
                onClick={() => setActiveButton(label)}
                className={`w-[69px] h-[28px] rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                  activeButton === label
                    ? "text-red-500 bg-[#FFF7F7] border-[#CE192D66]"
                    : "text-gray-900 bg-transparent border-none"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 text-center">
                <p className="text-lg font-semibold">Limit Order Submitted</p>
                {orderReady && (
                  <button
                    onClick={handleExecute}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Execute Order (simulate filler)
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setShowConfirmation(false);
                    setOrderReady(false);
                  }}
                  className="mt-2 text-blue-500 underline"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          ) : showConfirmation ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 text-center">
                <p className="text-lg font-semibold">Confirm Limit Order</p>
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="text-red-500 underline"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="text-green-500 underline"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5 relative">
                <div className="flex flex-col relative gap-2">
                  <TokenInput
                    label="Sell"
                    amount={sellAmount}
                    onChange={handleSellAmountChange}
                    coinType="coin1"
                    coinSelect={true}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 z-20">
                    <SwapButton onSwap={handleSwap} />
                  </div>
                  <TokenInput
                    label="Buy"
                    amount={buyAmount}
                    onChange={handleBuyAmountChange}
                    coinType="coin2"
                    coinSelect={true}
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
              </form>
              <div className="flex justify-between p-3 rounded-lg mt-10">
                <p className="text-gray-500 text-md">Expiry</p>
                <div className="flex gap-1">
                  {expiryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setExpiry(option)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        expiry === option
                          ? "bg-[#FFF7F7] text-red-500 border border-[#CE192D66]"
                          : "text-gray-900"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full text-gray-600 py-2 rounded-lg cursor-pointer bg-gray-300"
              >
                Confirm
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </main>
  );
}
