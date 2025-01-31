import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import CoinSelect from "../../ui/coinSelect/CoinSelect";

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
}: TokenInputProps) => (
  <Card className="p-4 w-full flex flex-col gap-4 rounded-xl bg-[#E0E0E04D]">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <Input
        className="outline-none text-lg w-full border-none  p-4 rounded-lg  placeholder:text-neutral-500"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
      />
      <CoinSelect coinType={coinType} />
    </div>
  </Card>
);
