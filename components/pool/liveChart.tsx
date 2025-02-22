"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function generatePrice() {
  return (1000 + Math.random() * 100).toFixed(2); // Simulated price range between 1000-1100
}

export default function LivePriceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [
          ...prevData,
          { time: new Date().toLocaleTimeString(), price: generatePrice() },
        ];
        return newData.slice(-20); // Keep only the last 20 data points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(value) => value.split(":").slice(1).join(":")}
          />
          <YAxis domain={[1000, 1100]} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </CardContent>
    </Card>
  );
}
