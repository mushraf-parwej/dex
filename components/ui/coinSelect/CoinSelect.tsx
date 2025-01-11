import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { fetchCoinData } from "@/actions/coinActions";
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";

const CoinSelect = () => {
  //   const [coinData, setCoinData] = useState([]);

  // Memoized function to fetch coin data
  //   const getCoinData = useCallback(async () => {
  //     try {
  //       const res = await fetchCoinData();
  //       setCoinData(res);
  //     } catch (error) {
  //       console.error("Failed to fetch coin data:", error);
  //     }
  //   }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {/* <Button onClick={getCoinData}>Get coin data</Button> */}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea>
          {/* {coinData.map((coin) => (
            <DialogDescription key={coin.id}>
              <Button>{coin.name}</Button>
            </DialogDescription>
          ))} */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CoinSelect;
