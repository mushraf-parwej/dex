// "use client";

// import { ChevronDown } from "lucide-react";
// import { FC, useState, useCallback } from "react";
// import Image from "next/image";
// import eth from "@/public/assets/icons/eth.png";
// import group from "@/public/assets/icons/Group 1321316732.png";
// import newImage from "@/public/assets/icons/Shape.png";
// import { TokenInput } from "../web3/swap/TokenInput";
// import { SwapButton } from "../web3/swap/SwapButton";
// import { useAccount } from "wagmi";
// import { useSwap } from "@/hooks/swap/useSwap";
// import { useCoinStore } from "@/store";

// const options = ["1 day", "1 week", "1 Month", "1 Year"];
// const buttons = ["Market", "+1%", "+5%", "+10%"];

// export default function LimitComponent() {
//   const [expiry, setExpiry] = useState("1 day");
//   const [activeButton, setActiveButton] = useState(buttons[0]);

//   const { isConnected } = useAccount();
//   const { coin1, coin2 } = useCoinStore();

//   // Local component state
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
//   const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
//   const [formData, setFormData] = useState<{
//     sellAmount: string;
//     buyAmount: string;
//     coin1: string;
//     coin2: string;
//   } | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const {
//     sellAmount,
//     buyAmount,
//     handleSellAmountChange,
//     handleBuyAmountChange,
//     handleSwap,
//   } = useSwap();

//   // Validate the form data
//   const isFormValid = Boolean(
//     sellAmount &&
//       buyAmount &&
//       coin1 &&
//       coin2 &&
//       Number(sellAmount) > 0 &&
//       Number(buyAmount) > 0
//   );

//   // Use useCallback to memoize the submit handler
//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault();
//       if (!isFormValid) {
//         setError("Please ensure all fields are filled correctly.");
//         return;
//       }
//       setError(null);
//       setFormData({
//         sellAmount,
//         buyAmount,
//         coin1: String(coin1),
//         coin2: String(coin2),
//       });
//       setShowConfirmation(true);
//     },
//     [isFormValid, sellAmount, buyAmount, coin1, coin2]
//   );

//   return (
//     <div className="font-urbanist absolute top-[75%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-[512px] max-w-[512px] rounded-[10px] border border-white/[0.1] shadow-lg p-4 flex flex-col gap-4 text-justify">
//       {" "}
//       <div className="w-[480px] h-[381px] rounded-[10px] flex flex-col gap-4 bg-[#F8F9FA]">
//         <div className="w-[480px] h-[133px] rounded-[10px] p-4 bg-[#E0E0E04D]">
//           <div className="flex flex-col gap-[10px]">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-1">
//                 <span className="text-gray-500 text-sm">When 1</span>
//                 <Image
//                   src={eth}
//                   width={10}
//                   height={10}
//                   alt="ETH Icon"
//                   className="w-4 h-4"
//                 />
//                 <span className="text-gray-500 text-sm font-bold">ETH</span>
//                 <span className="text-gray-500 text-sm">is worth</span>
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-gray-900">3191.21</h2>
//               <div className="flex items-center space-x-2 p-1 cursor-pointer">
//                 <Image
//                   src={group}
//                   width={20}
//                   height={20}
//                   alt="vector"
//                   className="w-5 h-5"
//                 />
//                 <span className="font-semibold px-2">QRN</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-2 mt-3 w-[219px] h-[28px]">
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
//         <div className="space-y-4 relative">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="flex flex-col relative gap-2">
//               <TokenInput
//                 label="Sell"
//                 amount={sellAmount}
//                 onChange={handleSellAmountChange}
//                 coinType="coin1"
//                 coinSelect={false}
//               />
//               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 z-20">
//                 <SwapButton onSwap={handleSwap} />
//               </div>
//               <TokenInput
//                 label="Buy"
//                 amount={buyAmount}
//                 onChange={handleBuyAmountChange}
//                 coinType="coin2"
//                 coinSelect={false}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//       <div className="w-[480px] flex justify-between p-3 rounded-lg mt-10">
//         <p className="text-gray-500 text-md">Expiry</p>
//         <div className="flex gap-1">
//           {options.map((option) => (
//             <button
//               key={option}
//               className={`px-3 py-1 rounded-lg text-sm font-semibold ${
//                 expiry === option
//                   ? "bg-[#FFF7F7] text-red-500 border border-[#CE192D66]"
//                   : "text-gray-900"
//               }`}
//               onClick={() => setExpiry(option)}
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//       </div>
//       <button className="w-[480px] text-gray-600 py-2 rounded-lg cursor-not-allowed bg-gray-300">
//         Confirm
//       </button>
//     </div>
//   );
// }
"use client";

import { ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import eth from "@/public/assets/icons/eth.png";
import group from "@/public/assets/icons/Group 1321316732.png";
import { TokenInput } from "../web3/swap/TokenInput";
import { SwapButton } from "../web3/swap/SwapButton";
import { useAccount } from "wagmi";
import { useSwap } from "@/hooks/swap/useSwap";
import { useCoinStore } from "@/store";
import { Card } from "@/components/ui/card"; // Adjust path as needed
import { Input } from "../ui/input";
import dutchOrderReactorAbi from "../../lib/config/dutchOrderReactorAbi.json";
// Import ethers and the UniswapX SDK components
import { ethers } from "ethers";
import { DutchOrderBuilder, NonceManager } from "@uniswap/uniswapx-sdk";
import toast from "react-hot-toast";

const options = ["1 day", "1 week", "1 Month", "1 Year"];
const buttons = ["Market", "+1%", "+5%", "+10%"];

// Your deployed contract address for Dutch orders
const DUTCH_ORDER_REACTOR_ADDRESS =
  "0x453C0545a2B8AA9DEb8A552b33A74b75f4DFD8D2";

// Map expiry options to durations in seconds
const expiryDurations: Record<string, number> = {
  "1 day": 86400,
  "1 week": 604800,
  "1 Month": 2592000,
  "1 Year": 31536000,
};

export default function LimitComponent() {
  const [expiry, setExpiry] = useState("1 day");
  const [activeButton, setActiveButton] = useState(buttons[0]);
  const { isConnected, address } = useAccount();
  const { coin1, coin2 } = useCoinStore();

  // Local component states for transitioning views
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    sellAmount: string;
    buyAmount: string;
    coin1: string;
    coin2: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    sellAmount,
    buyAmount,
    handleSellAmountChange,
    handleBuyAmountChange,
    handleSwap,
  } = useSwap();

  const isFormValid = Boolean(
    sellAmount &&
      buyAmount &&
      coin1 &&
      coin2 &&
      Number(sellAmount) > 0 &&
      Number(buyAmount) > 0 &&
      address
  );

  // Handle order creation and submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
        setError("Please ensure all fields are filled correctly.");
        toast.error("Please ensure all fields are filled correctly.");
        return;
      }
      setError(null);

      try {
        // Check for window.ethereum (MetaMask)
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }
        // Fetch provider and signer as in your CreatePool component
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Calculate deadline based on expiry option
        const now = Math.floor(Date.now() / 1000);
        const expirySeconds = expiryDurations[expiry];
        const deadline = now + expirySeconds;

        const chainId = 11155111;
        const nonceMgr = new NonceManager(provider, 1);
        const nonce = await nonceMgr.useNonce(address);

        // Build the Dutch order using the SDK
        const builder = new DutchOrderBuilder(chainId);
        const order = builder
          .deadline(deadline)
          .decayStartTime(deadline - 100) // example value; adjust as needed
          .decayEndTime(deadline)
          .nonce(nonce)
          .input({
            token: String(coin1),
            amount: BigInt(sellAmount),
          })
          .output({
            token: String(coin2),
            startAmount: BigInt(buyAmount),
            endAmount: BigInt(buyAmount),
            recipient: address,
          })
          .build();

        // Get EIP-712 permit data for signing
        const { domain, types, values } = order.permitData();
        const signature = await signer._signTypedData(domain, types, values);

        // Serialize the order into an ABI-encoded string
        const serializedOrder = order.serialize();

        // Create an instance of the DutchOrderReactor contract
        const dutchOrderReactor = new ethers.Contract(
          DUTCH_ORDER_REACTOR_ADDRESS,
          dutchOrderReactorAbi,
          signer
        );
        // const tx = await dutchOrderReactor.(
        //   serializedOrder,
        //   signature
        // );
        // await tx.wait();

        setFormData({
          sellAmount,
          buyAmount,
          coin1: String(coin1),
          coin2: String(coin2),
        });
        setShowConfirmation(true);
        setIsSubmitted(true);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Order submission failed");
        toast.error("Order submission Failed");
      }
    },
    [isFormValid, expiry, sellAmount, buyAmount, coin1, coin2, address]
  );

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px]  z-30 mx-auto p-6">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <div className="w-full rounded-xl p-4 bg-[#E0E0E04D]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              {/* <div>Limit Price</div> */}
              {coin1 && coin2 ? (
                <div>
                  <span className="text-sm text-neutral-700">When 1 </span>
                  <span className="font-semibold text-neutral-800">
                    {coin1.symbol}{" "}
                    <span className="font-normal "> is worth</span>
                  </span>
                </div>
              ) : (
                <div>Limit Price</div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <Input
                disabled={!(coin1 && coin2)}
                className="focus:outline-none  text-lg"
                placeholder="0.00"
              />
              <div className="flex items-center space-x-2 p-1 cursor-pointer"></div>
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
              {/* Limit Order Progress State */}
              <div className="p-4 text-center">
                <p className="text-lg font-semibold">Limit Order Submitted</p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setShowConfirmation(false);
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
                    onClick={() => setIsSubmitted(true)}
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
                  <div className="text-red-500 text-sm mt-2" role="toast.error">
                    {error}
                  </div>
                )}
              </form>
              <div className="flex justify-between p-3 rounded-lg mt-10">
                <p className="text-gray-500 text-md">Expiry</p>
                <div className="flex gap-1">
                  {options.map((option) => (
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
              {/* Confirm Button */}
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
