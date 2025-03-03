"use client";
import React, { useEffect, useState } from "react";
import { getPools } from "@/actions/pool/getPoolData.action";

const TokensTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPools();
        setCoins(data);
        console.log(data);
      } catch (error) {
        setError("Failed to fetch coin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Symbol</th>
            <th className="px-4 py-2 border">Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin: any) => (
            <tr key={coin.id} className="text-center">
              <td className="px-4 py-2 border">{coin.name}</td>
              <td className="px-4 py-2 border">{coin.symbol.toUpperCase()}</td>
              <td className="px-4 py-2 border">${coin.current_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokensTable;
