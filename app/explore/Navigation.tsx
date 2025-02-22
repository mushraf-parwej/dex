"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  const getLinkClass = (path: string) =>
    pathname === path ? "opacity-100" : "opacity-50 hover:opacity-100";

  return (
    <nav className="flex flex-row items-center justify-between font-semibold w-full ">
      <div className="flex flex-row items-center space-x-5 text-lg">
        <Link href="/explore/tokens">
          <span className={getLinkClass("/explore/tokens")}>Tokens</span>
        </Link>
        <Link href="/explore/pool">
          <span className={getLinkClass("/explore/pool")}>Pools</span>
        </Link>
        <Link href="/explore/transaction">
          <span className={getLinkClass("/explore/transaction")}>
            Transactions
          </span>
        </Link>
      </div>
      <div>
        <button className="red-btn">Add Liquidity</button>
      </div>
    </nav>
  );
};

export default Navigation;
