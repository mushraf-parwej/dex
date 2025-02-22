"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCoinStore } from "@/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useStepContext } from "@/context/StepContext";

function generatePrice() {
  return (1000 + Math.random() * 100).toFixed(2); // Simulated price range between 1000-1100
}

export default function PriceRange() {
  const { coin1, coin2 } = useCoinStore();
  const { setCurrentStep } = useStepContext();
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [
          ...prevData,
          { time: new Date().toLocaleTimeString(), price: generatePrice() },
        ];
        return newData.slice(-20); // Keep only the last 20 data points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col w-full space-y-10">
      <section className="p-5 rounded-[13px] w-full border flex flex-row space-x-5 justify-between">
        <div>
          <span>{coin1.name}</span>
          <span>/</span>
          <span>{coin2.name}</span>
        </div>
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

              <TabsTrigger className="p-2" value="Custom Range">
                Custom Range
              </TabsTrigger>
              <TabsContent value="Custom Range">Custom</TabsContent>
              <TabsContent value="Full Range">
                {/* <span>
                  Providing full range liquidity ensures continuous market
                  participation across all possible prices, offering simplicity
                  but with potential for higher impermanent loss.
                </span> */}
              </TabsContent>
            </TabsList>
          </Tabs>
        </div>
        <Button onClick={() => setCurrentStep(3)} className="red-btn">
          Continue
        </Button>
      </section>
    </main>
  );
}
