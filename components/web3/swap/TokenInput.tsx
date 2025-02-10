import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import CoinSelect from "../../ui/coinSelect/CoinSelect";
import { useCoinStore } from "@/store";
import Image from "next/image";
import { wallet } from "@/public/assets/swap";

interface TokenInputProps {
  label: string;
  amount: string;
  onChange: (value: string) => void;
  coinType: "coin1" | "coin2";
}

export const TokenInput = ({
  label,
  amount,
  onChange,
  coinType,
}: TokenInputProps) => {
  const { coin1, coin2 } = useCoinStore();
  const isDisabled = coinType === "coin1" ? !coin1 : !coin2;

  return (
    <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
      <div className="flex flex-row items-center justify-between gap-6">
        <Input
          className="outline-none text-[20px] w-full border-none py-4 rounded-lg placeholder:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
        />
        <CoinSelect coinType={coinType} />
      </div>

      <div className="flex flex-row justify-between items-center w-full text-[14px] text-[#6F6F6F]">
        {/* //calculate the value of the coin */}
        ≈$0.00
        <div className="flex flex-row items-center gap-2">
          0.00
          <Image src={wallet} alt="wallet" width={24} height={24} />
        </div>
      </div>
    </Card>
  );
};
