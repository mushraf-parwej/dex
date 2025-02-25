import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import CoinSelect from "../../ui/coinSelect/CoinSelect";
import { useCoinStore } from "@/store";
import Image from "next/image";
import { wallet } from "@/public/assets/swap";
import { useEffect, useState, useCallback } from "react";
import { getCoinPrice } from "@/actions/coingecko/getCoinData.action";

interface TokenInputProps {
  label: string;
  amount: string;
  onChange: (value: string) => void;
  coinType: "coin1" | "coin2";
  coinSelect: boolean;
}

export const TokenInput = ({
  label,
  amount,
  onChange,
  coinType,
  coinSelect,
}: TokenInputProps) => {
  const { coin1, coin2 } = useCoinStore();
  const [coinPrice, setCoinPrice] = useState(0);
  const [coinValue, setCoinValue] = useState("0.00");

  const selectedCoin = coinType === "coin1" ? coin1 : coin2;
  const isDisabled = !selectedCoin;

  // Fetch coin price only when coinType changes
  const fetchCoinPrice = useCallback(async () => {
    if (selectedCoin && selectedCoin.name) {
      try {
        const priceData = await getCoinPrice(selectedCoin.id || "tether");
        setCoinPrice(priceData[selectedCoin.id || "tether"]?.usd || 0);
      } catch (error) {
        console.error("Failed to fetch coin price:", error);
        setCoinPrice(0);
      }
    }
  }, [selectedCoin]);

  useEffect(() => {
    fetchCoinPrice();
  }, [fetchCoinPrice]);

  useEffect(() => {
    if (amount && coinPrice) {
      setCoinValue(`$${(parseFloat(amount) * coinPrice).toFixed(2)}`);
    } else {
      setCoinValue("$0.00");
    }
  }, [amount, coinPrice]);

  return (
    <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
      <span className="text-[10px] font-urbanist text-md">{label}</span>
      <div className="flex flex-row items-center justify-between gap-6 mt-[-16px]">
        <Input
          className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
        />
        {coinSelect && <CoinSelect coinType={coinType} />}
      </div>

      <div className="flex flex-row justify-between items-center w-full text-[14px] text-[#6F6F6F]">
        ≈{coinValue}
        <div className="flex flex-row items-center gap-2">
          0.00
          <Image src={wallet} alt="wallet" width={24} height={24} />
        </div>
      </div>
    </Card>
  );
};
