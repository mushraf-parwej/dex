// 'use client';

// import { useState } from 'react';
// import { Card } from '@/components/ui/card';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { useCoinStore } from '@/store';
// import { TokenInput } from '../web3/swap/TokenInput';

// export default function SendComponent() {
//   const [amount, setAmount] = useState('');
//   const [walletAddress, setWalletAddress] = useState('');
//   const { coin1 } = useCoinStore();

//   const handleSend = () => {
//     // Add send logic here
//   };

//   return (
//     <main className="md:min-w-[480px] w-full min-h-[420px] z-30 mx-auto p-3">
//       <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
//         <div className="w-full rounded-xl p-4 space-y-6">
//           <div className="flex flex-col gap-1">
//             <div className="text-sm text-neutral-600 mb-1">You're sending</div>

//             <TokenInput
//                 label="Sell"
//                 //amount={sellAmount}
//                 //onChange={handleSellAmountChange}
//                 coinType="coin1"
//                 coinSelect={true} amount={''} onChange={function (value: string): void {
//                 console.log('Function not implemented.');
//                         } }
//                         />
//           </div>

//           <div className="space-y-2">
//             <div className="text-sm text-neutral-600">Wallet Address</div>
//             <Input
//               placeholder="0x93CECeFf829cE48A3cTAd0f25817COb6IBC07EA3"
//               value={walletAddress}
//               onChange={(e) => setWalletAddress(e.target.value)}
//               className="font-mono text-sm border-2 border-black-500 focus:border-black-500 focus:ring-0"
//             />
//           </div>

//           <Button
//             onClick={handleSend}
//             className="w-full bg-[#CE192D] hover:bg-red-600  h-12 rounded-xl text-lg font-semibold text-[#FFFF]"
//           >
//             Send
//           </Button>
//         </div>
//       </Card>
//     </main>
//   );
// }
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCoinStore } from "@/store";
import { TokenInput } from "../web3/swap/TokenInput";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export default function SendComponent() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const { coin1 } = useCoinStore();

  const handleSend = async () => {
    // Validate wallet address
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      toast.error("Please enter a valid wallet address.");
      return;
    }

    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Validate token selection (assumes coin1.tokenAddress exists)
    if (!coin1 || !coin1.address) {
      toast.error("No token selected for sending.");
      return;
    }

    // Ensure a web3 provider is available
    if (!window.ethereum) {
      toast.error(
        "Please install MetasMask or another Ethereum wallet provider"
      );
      return;
    }

    try {
      // Set up provider and signer from the wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Define a minimal ERC20 ABI
      const erc20Abi = [
        "function transfer(address to, uint256 amount) public returns (bool)",
        "function decimals() view returns (uint8)",
      ];

      // Create a contract instance with the token's address and ABI
      const tokenContract = new ethers.Contract(
        coin1.address,
        erc20Abi,
        signer
      );

      // Retrieve token decimals and convert the input amount accordingly
      const decimals = await tokenContract.decimals();
      const amountInUnits = ethers.parseUnits(amount, decimals);

      // Initiate the token transfer
      const tx = await tokenContract.transfer(walletAddress, amountInUnits);
      console.log("Transaction submitted:", tx.hash);

      // Wait for the transaction to be confirmed
      await tx.wait();
      toast.error(`Transaction successful! Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast.error(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px] z-30 mx-auto p-3">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <div className="w-full rounded-xl p-4 space-y-6">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-neutral-600 mb-1">You're sending</div>
            <TokenInput
              label="Sell"
              amount={amount}
              onChange={setAmount}
              coinType="coin1"
              coinSelect={true}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-neutral-600">Wallet Address</div>
            <Input
              placeholder="0x93CECeFf829cE48A3cTAd0f25817COb6IBC07EA3"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono text-sm border-2 border-black-500 focus:border-black-500 focus:ring-0"
            />
          </div>

          <Button
            onClick={handleSend}
            className="w-full bg-[#CE192D] hover:bg-red-600 h-12 rounded-xl text-lg font-semibold text-[#FFFF]"
          >
            Send
          </Button>
        </div>
      </Card>
    </main>
  );
}
