import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const filterCoins = (coins: Coin[], searchQuery: string) => {
  const query = searchQuery.toLowerCase().trim();

  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  );
};
