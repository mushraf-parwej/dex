"use client";

import { useSearchParams } from "next/navigation";
import { GearIcon } from "@radix-ui/react-icons";

export default function TabIcon() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  if (tab === "swap") {
    return <GearIcon className="w-[16.2px] h-[18px] text-[#706F6F]" />;
  }

  return null;
}
