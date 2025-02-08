import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Card } from "../../ui/card";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { backButton } from "@/public/assets/common";

interface SwapConfirmationProps {
  data: {
    sellAmount: string;
    buyAmount: string;
    coin1: {
      image: string;
      name: string;
      symbol: string;
    };
    coin2: {
      image: string;
      name: string;
      symbol: string;
    };
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
      className="w-[480px] min-h-[420px] flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <button onClick={onBack} className=" rounded-full transition-colors">
          <Image src={backButton} alt="Back" width={18} height={18} />
        </button>
        <h2 className="text-sm">Back</h2>
      </div>

      {/* Token Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Sell Token */}
        <Card className="p-4 flex flex-col items-center gap-4">
          <span className="text-neutral-400">You Pay</span>
          <Image
            src={data.coin1.image}
            width={48}
            height={48}
            alt={data.coin1.name}
            className="rounded-full"
          />
          <div className="flex flex-row items-center gap-1 w-full ">
            <span className="text-lg font-medium">{data.sellAmount}</span>
            <span className="text-sm text-neutral-400">
              {data.coin1.symbol.toUpperCase()}
            </span>
          </div>
        </Card>

        {/* Buy Token */}
        <Card className="p-4 flex flex-col items-center gap-4">
          <span className="text-neutral-400">You Receive</span>
          <Image
            src={data.coin2.image}
            width={48}
            height={48}
            alt={data.coin2.name}
            className="rounded-full"
          />
          <div className="flex flex-row items-center gap-1 w-full">
            <span className="text-lg font-medium">{data.buyAmount}</span>
            <span className="text-sm text-neutral-400">
              {data.coin2.symbol.toUpperCase()}
            </span>
          </div>
        </Card>
      </div>

      {/* Transaction Details */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="details" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 text-neutral-400 hover:no-underline">
            1 {data.coin1.symbol.toUpperCase()} = {data.buyAmount}{" "}
            {data.coin2.symbol.toUpperCase()}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Platform fees</span>
              <span>0.3%</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="details" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 text-neutral-400 hover:no-underline">
            1 {data.coin1.symbol.toUpperCase()} = {data.buyAmount}{" "}
            {data.coin2.symbol.toUpperCase()}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Platform fees</span>
              <span>0.3%</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="w-full bg-red hover:bg-red/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Confirm Swap
      </button>
    </motion.div>
  );
};
