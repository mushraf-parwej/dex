import { swapIcon } from "@/public/assets/swap";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";

interface SwapButtonProps {
  onSwap: () => void;
}

export const SwapButton = ({ onSwap }: SwapButtonProps) => (
  <div className="flex justify-center w-full">
    <button
      className="w-fit  shadow-md p-2 bg-white rounded-full font-semibold"
      onClick={onSwap}
    >
      <Image src={swapIcon} alt="swap" />
    </button>
  </div>
);
