import { create } from "zustand";
import zukeeper from "zukeeper"; // Ensure this is the correct import

interface Coin {
  image: string;
  id: string;
  name: string;
  symbol: string;
}

interface CoinStore {
  coin1: Coin | null;
  coin2: Coin | null;
  setCoin1: (coin: Coin) => void;
  setCoin2: (coin: Coin) => void;
  clearCoin1: () => void;
  clearCoin2: () => void;
}

export const useCoinStore = create<CoinStore>()(
  zukeeper(
    (set) => ({
      coin1: null,
      coin2: null,
      setCoin1: (coin) => set({ coin1: coin }),
      setCoin2: (coin) => set({ coin2: coin }),
      clearCoin1: () => set({ coin1: null }),
      clearCoin2: () => set({ coin2: null }),
    }),
    { name: "coin-storage" } // LocalStorage key for persistence
  )
);
