import { useCoinStore } from "@/store";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Edit2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useStepContext } from "@/context/StepContext";

const PriceRange = () => {
  const { coin1, coin2 } = useCoinStore();
  const { currentStep, setCurrentStep } = useStepContext();

  return (
    <main className="flex flex-col w-full space-y-10 ">
      <section className="p-5 rounded-[13px] w-full border flex flex-row space-x-5 justify-between ">
        <div>
          <span>{coin1.name}</span>
          <span>/</span>
          <span>{coin2.name}</span>
        </div>
        <Edit className="cursor-pointer" onClick={() => setCurrentStep(1)} />
      </section>

      <section className="w-full flex flex-col space-y-10 p-5 border rounded-[13px]">
        <div className="flex flex-row justify-between items-center">
          <div>
            <span>Set Price Range</span>
          </div>
          <div>
            <Tabs defaultValue={coin1.name}>
              <TabsList className="grid w-full grid-cols-2 space-x-5">
                <TabsTrigger value={coin1.name}>{coin1.name}</TabsTrigger>
                <TabsTrigger value={coin2.name}>{coin2.name}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div>
          <Tabs defaultValue="Full Range">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="p-2" value="Full Range">
                Full Range
              </TabsTrigger>
              <TabsTrigger className="p-2" value={coin2.name}>
                Custom Range
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button onClick={() => setCurrentStep(3)} className="red-btn">
          Continue
        </Button>
      </section>
    </main>
  );
};

export default PriceRange;
