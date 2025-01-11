import React from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import CoinSelect from "../ui/coinSelect/CoinSelect";
const SwapComponent = () => {
  return (
    <main className="w-2/3 z-30">
      <Card className="flex flex-col bg-neutral-800/70 justify-center items-center gap-10 w-full p-2">
        <Card className="p-2 w-full">
          <h1>Sell</h1>
          <div className="flex flex-row items-center justify-between">
            <Input
              className="outline-none w-full border-none mx-0 p-0"
              type="number"
              placeholder="Amount"
            />
            <CoinSelect />
          </div>
        </Card>
        <Card className="p-2 w-full">
          <h1>Buy</h1>
          <div className="flex flex-row items-center justify-between">
            <Input
              className="outline-none w-full border-none mx-0 p-0"
              type="number"
              placeholder="Amount"
            />
            <CoinSelect />
          </div>
        </Card>
      </Card>
    </main>
  );
};
export default SwapComponent;
