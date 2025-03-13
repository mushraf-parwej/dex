"use client";
import React, { useEffect, useState } from "react";
import { getCoinData } from "@/actions/coingecko/getCoinData.action";

const TokensTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoinData();
        setCoins(data);
      } catch (error) {
        setError("Failed to fetch coin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-300 ">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Symbol</th>
            <th className="px-4 py-3 font-semibold">Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin: any) => (
            <tr
              key={coin.id}
              className="border-b last:border-0 hover:bg-gray-100 transition"
            >
              <td className="px-4 py-3">{coin.name}</td>
              <td className="px-4 py-3 uppercase">{coin.symbol}</td>
              <td className="px-4 py-3">${coin.current_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokensTable;
