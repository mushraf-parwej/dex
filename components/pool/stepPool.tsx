"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStepContext } from "@/context/StepContext";
import CreatePool from "./createPool";
import priceRange from "./priceRange";
import PriceRange from "./priceRange";
import DepositAmount from "./DepositAmount";
export interface Step {
  label: string;
  description: string;
}

const steps: Step[] = [
  { label: "Step 1", description: "Select tokens pair and fees" },
  { label: "Step 2", description: "Set price range" },
  { label: "Step 3", description: "Enter deposit amounts" },
];

const stepVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

const StepPool = () => {
  const { currentStep, setCurrentStep } = useStepContext();
  console.log(currentStep);

  return (
    <div className="w-full flex flex-row items-start p-6 space-x-10 justify-between px-20">
      {/* Step indicator */}
      <div className="flex flex-col gap-6 rounded-lg w-1/2 border p-5">
        {steps.map((step, index) => (
          <motion.div
            onClick={() =>
              currentStep > index ? setCurrentStep(index + 1) : null
            }
            key={index}
            variants={stepVariants}
            initial="initial"
            animate={
              index === currentStep
                ? "animate"
                : { opacity: 0.6, x: 0, transition: { duration: 0.2 } }
            }
            exit="exit"
            className={`border-l-4 pl-4 transition-colors duration-300 ${
              index + 1 === currentStep ? "border-red" : "border-gray-300"
            }`}
          >
            <div className="text-xl font-semibold text-gray-800">
              {step.label}
            </div>
            <div className="text-base text-gray-500">{step.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Step content */}
      <div className="mt-8 w-full">
        {currentStep === 1 && <CreatePool />}
        {currentStep === 2 && <PriceRange />}
        {currentStep === 3 && <DepositAmount />}
      </div>
    </div>
  );
};

export default StepPool;
