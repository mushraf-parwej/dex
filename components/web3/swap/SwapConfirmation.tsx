import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

interface SwapConfirmationProps {
  data: {
    sellAmount: string;
    buyAmount: string;
    coin1: any;
    coin2: any;
  };
  onBack: () => void;
  onConfirm: () => void;
}

export const SwapConfirmation = ({
  data,
  onBack,
  onConfirm,
}: SwapConfirmationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-6 min-w-[480px] min-h-[420px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2  rounded-full">
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold">Confirm Swap</h2>
      </div>

      {/* <div className="space-y-4  p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src={data.coin1.image}
              width={24}
              height={24}
              alt={data.coin1.name}
              className="rounded-full"
            />
            <span>{data.sellAmount}</span>
          </div>
          <span>{data.coin1.symbol.toUpperCase()}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src={data.coin2.image}
              width={24}
              height={24}
              alt={data.coin2.name}
              className="rounded-full"
            />
            <span>{data.buyAmount}</span>
          </div>
          <span>{data.coin2.symbol.toUpperCase()}</span>
        </div>
      </div>

      <button onClick={onConfirm} className="red-btn w-full">
        Confirm Swap
      </button> */}
      <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
        <div className="flex flex-row w-full justify-center items-center space-x-4">
          <Card>
            <CardContent>
              <CardDescription>
                <Image
                  alt="data"
                  src={data.coin1.image}
                  width={24}
                  height={24}
                />
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
