"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { poolData } from "@/constants/tvlData";

// Define interfaces for API response
interface ApiPool {
  address: string;
  token0: string;
  token1: string;
  // other fields from API
}

// Define interface for display
interface DisplayPool {
  poolName: string; // This will be token0Symbol/token1Symbol
  fees: string;
  tvl: string;
  apr: string;
  vol1d: string;
  vol30d: string;
  vol1dTvl: string;
}

const ERC20ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
];

const TopPoolTable = () => {
  const [displayPools, setDisplayPools] = useState<DisplayPool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolTokenNames = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/pools");
        const apiPools: ApiPool[] = await response.json();

        if (!Array.isArray(apiPools)) {
          throw new Error("Invalid pool data format");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenSymbolMap = new Map<string, string>();
        const uniqueTokenAddresses = new Set<string>();
        apiPools.forEach((pool) => {
          uniqueTokenAddresses.add(pool.token0);
          uniqueTokenAddresses.add(pool.token1);
        });
        await Promise.all(
          Array.from(uniqueTokenAddresses).map(async (address) => {
            try {
              const tokenContract = new ethers.Contract(
                address,
                ERC20ABI,
                provider
              );

              const symbol = await tokenContract.symbol();
              tokenSymbolMap.set(address, symbol);
            } catch (err) {
              console.error("Error fetching token symbol:", address, err);
              tokenSymbolMap.set(address, shortenAddress(address));
            }
          })
        );

        const combinedPools = poolData.map((staticData, index) => {
         
          if (index >= apiPools.length) {
            return {
              ...staticData,
              poolName: staticData.pool, // Keep using static pool name as fallback
            };
          }

          const apiPool = apiPools[index];
          const token0Symbol =
            tokenSymbolMap.get(apiPool.token0) ||
            shortenAddress(apiPool.token0);
          const token1Symbol =
            tokenSymbolMap.get(apiPool.token1) ||
            shortenAddress(apiPool.token1);

          return {
            ...staticData,
            poolName: `${token0Symbol}/${token1Symbol}`,
          };
        });

        setDisplayPools(combinedPools);
      } catch (err) {
        console.error("Failed to fetch pools data:", err);
        setError("Failed to load pool data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolTokenNames();
  }, []);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading pool data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

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
          {displayPools.map((pool, idx) => (
            <tr key={idx} className="text-center">
              <td className="px-4 py-2 border">{pool.poolName}</td>
              <td className="px-4 py-2 border">{pool.fees}</td>
              <td className="px-4 py-2 border">{pool.tvl}</td>
              <td className="px-4 py-2 border">{pool.apr}</td>
              <td className="px-4 py-2 border">{pool.vol1d}</td>
              <td className="px-4 py-2 border">{pool.vol30d}</td>
              <td className="px-4 py-2 border">{pool.vol1dTvl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPoolTable;
