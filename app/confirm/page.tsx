"use client";

import { useSearchParams } from "next/navigation";
import { SwapConfirmation } from "@/components/web3/swap/SwapConfirmation";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formData = {
    sellAmount: searchParams.get("sellAmount"),
    buyAmount: searchParams.get("buyAmount"),
    coin1: JSON.parse(searchParams.get("coin1") || "{}"),
    coin2: JSON.parse(searchParams.get("coin2") || "{}"),
  };

  return (
    <div className="w-[480px] min-h-[420px] z-30 mx-auto p-6">
      <SwapConfirmation
        data={formData}
        onBack={() => router.back()}
        onConfirm={() => console.log("Confirming swap:", formData)}
      />
    </div>
  );
}
