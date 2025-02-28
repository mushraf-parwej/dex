import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LivePriceChart from "./liveChart";
import { useCoinStore } from "@/store";
import { useState } from "react";

export function RangeTabs({ minPrice, maxPrice, setMinPrice, setMaxPrice }) {
  const { coin1, coin2 } = useCoinStore();
  const [tabData, setTabData] = useState("");
  console.log(tabData);
  return (
    //range tabs
    <Tabs defaultValue="fullRange" className="w-full">
      <TabsList className="grid w-full grid-cols-2 ">
        <TabsTrigger value="fullRange">Full Range</TabsTrigger>
        <TabsTrigger value="customRange">Custom Range</TabsTrigger>
      </TabsList>
      <TabsContent value="fullRange">
        <Card>
          <CardHeader>
            <CardDescription>
              Providing full range liquidity ensures continuous market
              participation across all possible prices, offering simplicity but
              with potential for higher impermanent loss.{" "}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <LivePriceChart />
            <section className="flex flex-col md:flex-row items-center justify-between w-full gap-5">
              <div className="p-5 border rounded-[13px] flex-1  ">
                <label>Min Price</label>
                <Input
                  className="outline-none focus:outline-none"
                  type="number"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-xs font-semibold text-neutral-500">
                  {coin1.name} {"/"} {coin2.name}
                </span>
              </div>
              <div className="p-5 border rounded-[13px] flex-1">
                <label>Max Price</label>
                <Input
                  className="outline-none focus:outline-none"
                  type="number"
                  placeholder="0.00"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <span className="text-xs font-semibold text-neutral-500">
                  {coin1.name} {"/"} {coin2.name}
                </span>
              </div>
            </section>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
