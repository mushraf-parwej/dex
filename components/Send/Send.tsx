'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCoinStore } from '@/store';
import { TokenInput } from '../web3/swap/TokenInput';

export default function SendComponent() {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const { coin1 } = useCoinStore();

  const handleSend = () => {
    // Add send logic here
  };

  return (
    <main className="md:min-w-[480px] w-full min-h-[420px] z-30 mx-auto p-3">
      <Card className="flex flex-col border backdrop-blur-lg rounded-xl p-4 gap-6 shadow-lg">
        <div className="w-full rounded-xl p-4 space-y-6">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-neutral-600 mb-1">You're sending</div>
            
            <TokenInput
                label="Sell"
                //amount={sellAmount}
                //onChange={handleSellAmountChange}
                coinType="coin1"
                coinSelect={true} amount={''} onChange={function (value: string): void {
                console.log('Function not implemented.');
                        } }
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
            className="w-full bg-[#CE192D] hover:bg-red-600  h-12 rounded-xl text-lg font-semibold text-[#FFFF]"
          >
            Send
          </Button>
        </div>
      </Card>
    </main>
  );
}