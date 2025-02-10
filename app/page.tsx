import { Dock } from "@/components/ui/dock";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SwapComponent from "@/components/web3/swap/swap-component";
import { TabsContent } from "@radix-ui/react-tabs";
import Link from "next/link";
import Pool from "./pool/page";
import TabIcon from "@/components/web3/swap/SettingsButton";

interface HomeProps {
  searchParams: { tab?: string };
}

export default function Home({ searchParams }: HomeProps) {
  const currentTab = searchParams.tab || "swap";

  return (
    <div className="flex flex-col h-[calc(100vh)] items-center justify-start py-32">
      <Tabs className="bg-transparent " value={currentTab} defaultValue="swap">
        <div className="flex items-center justify-between  px-8">
          <TabsList className="flex flex-row max-w-xl">
            {[
              { value: "swap", label: "Swap" },
              { value: "limit", label: "Limit" },
              { value: "send", label: "Send" },
              { value: "buy", label: "Buy" },
            ].map((tab) => (
              <Link key={tab.value} href={`/?tab=${tab.value}`}>
                <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
              </Link>
            ))}
          </TabsList>
          <TabIcon />
        </div>
        <TabsContent value="swap">
          <SwapComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
