"use client";

import React from "react";

import { poolData } from "@/constants/tvlData";

export interface TopPool {
  pool: string;
  fees:string;
  tvl: string;
  apr: string;
  vol1d: string;
  vol30d: string;
  vol1dTvl: string;
}

const TopPoolTable = () => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Pool</th>
            <th className="px-4 py-2 border">Fees</th>
            <th className="px-4 py-2 border">TVL</th>
            <th className="px-4 py-2 border">APR</th>
            <th className="px-4 py-2 border">1d vol</th>
            <th className="px-4 py-2 border">30d vol</th>
            <th className="px-4 py-2 border">1d vol/tvl</th>
          </tr>
        </thead>
        <tbody>
          {poolData.map((item: TopPool, idx: number) => (
            <tr key={idx} className="text-center">
              <td className="px-4 py-2 border">{item.pool}</td>
              <td className="px-4 py-2 border">{item.fees}</td>
              <td className="px-4 py-2 border">{item.tvl}</td>
              <td className="px-4 py-2 border">{item.apr}</td>
              <td className="px-4 py-2 border">{item.vol1d}</td>
              <td className="px-4 py-2 border">{item.vol30d}</td>
              <td className="px-4 py-2 border">{item.vol1dTvl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPoolTable;
