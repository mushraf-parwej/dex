import { motion } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { backButton } from "@/public/assets/common";
import Image from "next/image";
interface SwapProgressProps {
  steps: {
    label: string;
    description: string;
  }[];
  onback: () => void;
  currentStep: number;
  isCompleted: boolean;
}

export const SwapProgress = ({
  steps,
  onback,
  currentStep,
  isCompleted,
}: SwapProgressProps) => {
  // useEffect(() => {
  //   const timeouts: NodeJS.Timeout[] = [];

  //   steps.forEach((_, index) => {
  //     const timeout = setTimeout(() => {
  //       setCurrentStep(index);
  //       if (index === steps.length - 1) {
  //         setIsCompleted(true);
  //       }
  //     }, index * 2000); // 2 seconds between each step

  //     timeouts.push(timeout);
  //   });

  //   return () => timeouts.forEach(clearTimeout);
  // }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[480px] min-h-[420px] p-6"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-row space-x-2">
          <button onClick={onback} className=" rounded-full transition-colors">
            <Image src={backButton} alt="Back" width={18} height={18} />
          </button>
          <h2 className="text-xl font-semibold">
            {isCompleted ? "Back" : "Transaction in Progress"}
          </h2>
        </div>

        <div className="relative flex flex-col gap-8">
          <div className="absolute left-3 top-4 bottom-4 w-[2px] bg-neutral-800" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { delay: index * 0.3 },
              }}
              className="flex items-start gap-4"
            >
              <div
                className={`
                w-[24px] h-[24px] rounded-full flex items-center justify-center z-10
                transition-colors duration-200
                ${index <= currentStep ? "bg-red" : "bg-neutral-800"}
              `}
              >
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <CheckIcon className="w-4 h-4 text-white" />
                  </motion.div>
                ) : index === currentStep ? (
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={`font-medium transition-colors  "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-sm text-neutral-400">
                  {step.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {isCompleted && <Button className="red-btn">View Transactions</Button>}
      </div>
    </motion.div>
  );
};
