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

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { DutchOrderBuilder, NonceManager } from "@uniswap/uniswapx-sdk";
import dutchOrderReactorAbi from "../../lib/config/dutchOrderReactorAbi.json";
import { useSwap } from "@/hooks/swap/useSwap";
import { useCoinStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Input } from "../ui/input";
import { TokenInput } from "../web3/swap/TokenInput";
import { SwapButton } from "../web3/swap/SwapButton";

const options = ["1 day", "1 week", "1 Month", "1 Year"];
const buttons = ["Market", "+1%", "+5%", "+10%"];

  const DUTCH_ORDER_REACTOR_ADDRESS ="0x453C0545a2B8AA9DEb8A552b33A74b75f4DFD8D2";
  const PERMIT2_ADDRESS = "0xC348b507B1f826f7A020a0709545566508D40fc4";

const expiryDurations: Record<string, number> = {
  "1 day": 86400,
  "1 week": 604800,
  "1 Month": 2592000,
  "1 Year": 31536000,
};

export default function LimitComponent() {
  const [expiry, setExpiry] = useState("1 day");
  const [activeButton, setActiveButton] = useState(buttons[0]);
  const [limitPrice, setLimitPrice] = useState("");
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { address } = useAccount();
  const { coin1, coin2 } = useCoinStore();
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

  // Approve tokens using Permit2
  const approveTokensForPermit2 = async (tokenAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ["function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );
      const tx = await tokenContract.approve(
        PERMIT2_ADDRESS,
        ethers.MaxUint256
      );
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Approval error:", error);
      setError("Token approval failed.");
      return false;
    }
  };

  // Fetch user orders
  const fetchUserOrders = useCallback(async () => {
    if (!address) return;
    try {
      const res = await fetch(`/api/orders?address=${address}`); // Fetch user orders
      const data = await res.json();
      setUserOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  }, [address]);

  useEffect(() => {
    if (address) fetchUserOrders();
  }, [address, fetchUserOrders]);

  // Broadcast order to backend
  const broadcastOrder = async (orderData: string, signature: string) => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encodedOrder: orderData,
        signature,
        chainId: 11155111,
        orderType: "Limit",
        maker: address,
      }),
    });
  };

  // Submit limit order
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return setError("Invalid form data.");
      setError(null);

      try {
        if (!window.ethereum) throw new Error("Install MetaMask!");

        if (!(await approveTokensForPermit2(String(coin1)))) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const now = Math.floor(Date.now() / 1000);
        const deadline = now + expiryDurations[expiry];
        const nonceMgr = new NonceManager(provider, 1);
        const nonce = await nonceMgr.useNonce(address!);

        const builder = new DutchOrderBuilder(11155111);
        const order = builder
          .deadline(deadline)
          .decayStartTime(deadline - 100)
          .decayEndTime(deadline)
          .nonce(nonce)
          .input({ token: String(coin1), amount: BigInt(sellAmount) })
          .output({
            token: String(coin2),
            startAmount: BigInt(buyAmount),
            endAmount: BigInt(buyAmount),
            recipient: address!,
          })
          .build();

        const { domain, types, values } = order.permitData();
        const signature = await signer._signTypedData(domain, types, values);
        const serializedOrder = order.serialize();

        // Execute on-chain transaction
        const dutchOrderReactor = new ethers.Contract(
          DUTCH_ORDER_REACTOR_ADDRESS,
          dutchOrderReactorAbi,
          signer
        );
        await (
          await dutchOrderReactor.execute(serializedOrder, signature)
        ).wait();

        await broadcastOrder(serializedOrder, signature);

        setShowConfirmation(true);
        setIsSubmitted(true);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Submission failed");
      }
    },
    [isFormValid, expiry, sellAmount, buyAmount, coin1, coin2, address]
  );

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px] mx-auto p-6">
      <Card className="p-4">
        <form onSubmit={handleSubmit}>
          <TokenInput
            label="Sell"
            amount={sellAmount}
            onChange={handleSellAmountChange}
            coinType="coin1"
            coinSelect
          />
          <SwapButton onSwap={handleSwap} />
          <TokenInput
            label="Buy"
            amount={buyAmount}
            onChange={handleBuyAmountChange}
            coinType="coin2"
            coinSelect
          />

          <Input
            placeholder="Limit Price"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
          />

          <div>
            {buttons.map((label) => (
              <button key={label} onClick={() => setActiveButton(label)}>
                {label}
              </button>
            ))}
          </div>

          <div>
            Expiry:
            {options.map((opt) => (
              <button key={opt} onClick={() => setExpiry(opt)}>
                {opt}
              </button>
            ))}
          </div>

          {error && <div className="text-red-500">{error}</div>}
          <button type="submit">Confirm</button>
        </form>

        {!isSubmitted && !showConfirmation && (
          <div>
            <h3>Your Orders</h3>
            {userOrders.map((order) => (
              <div key={order.id}>
                {order.inputToken}/{order.outputToken} - Amount:{" "}
                {order.inputAmount}
              </div>
            ))}
          </div>
        )}

        {isSubmitted && <div>Order Submitted!</div>}
        {showConfirmation && <div>Confirming...</div>}
      </Card>
    </main>
  );
}

