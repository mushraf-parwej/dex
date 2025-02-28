import React from "react";
import Link from "next/link";
import Image from "next/image";
import { logo } from "@/public/assets/common";
import NavLink from "./NavLink";
const LeftSection = () => {
  return (
    <div className="flex items-center gap-8">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-semibold">QDEX</span>
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <NavLink href="/" label="Trade" />
        <NavLink href="/pool" label="Pool" />
        <NavLink href="/explore/tokens" label="Explore" />
      </div>
    </div>
  );
};

export default LeftSection;
