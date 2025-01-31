import { useState } from "react";
import { useCoinStore } from "@/store";

export const useSwap = () => {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const { coin1, coin2, setCoin1, setCoin2 } = useCoinStore();

  const handleSellAmountChange = (value: string) => setSellAmount(value);
  const handleBuyAmountChange = (value: string) => setBuyAmount(value);

  const handleSwap = () => {
    setBuyAmount(sellAmount);
    setSellAmount(buyAmount);
    const tempCoin = coin1;
    setCoin1(coin2);
    setCoin2(tempCoin);
  };

  return {
    sellAmount,
    buyAmount,
    handleSellAmountChange,
    handleBuyAmountChange,
    handleSwap,
  };
};
