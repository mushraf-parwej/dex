import React, { useEffect, useState, useRef, useCallback } from "react";
import { ethers } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCoinData } from "@/actions/coingecko/getCoinData.action";
import { getPools } from "@/actions/pool/getPoolData.action"; // Moved API call to action
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";
import { useCoinStore } from "@/store";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/common/SearchBar";
import { filterCoins } from "@/lib/utils/utils";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 20;

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  address: string;
}

interface CoinSelectProps {
  coinType: "coin1" | "coin2";
}

const ERC20ABI = ["function name() view returns (string)"];

const CoinLoadingSkeleton = () => (
  <ScrollArea className="h-[60vh] rounded-md border p-2">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="p-2 border-b flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ))}
  </ScrollArea>
);

const CoinSelect: React.FC<CoinSelectProps> = ({ coinType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coinData, setCoinData] = useState<Coin[]>([]);
  const [customTokens, setCustomTokens] = useState<Coin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const { coin1, coin2, setCoin1, setCoin2 } = useCoinStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visibleCoins, setVisibleCoins] = useState(ITEMS_PER_PAGE);

  // **Check if MetaMask is installed and wallet is connected**

  // **Fetch Coins & Custom Tokens**
  const fetchTokens = useCallback(async () => {
    if (!isOpen) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch CoinGecko data
      const coinGeckoData = await getCoinData();
      if (Array.isArray(coinGeckoData)) {
        setCoinData(coinGeckoData);
      } else {
        setError("Invalid CoinGecko data format");
        toast.error("Invalid CoinGecko Data");
      }

      // Fetch Custom Tokens only if wallet is connected

      const poolData = await getPools();
      if (Array.isArray(poolData)) {
        const uniqueTokenAddresses = new Set<string>();
        poolData.forEach((pool) => {
          uniqueTokenAddresses.add(pool.token0);
          uniqueTokenAddresses.add(pool.token1);
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log("pointer");
        console.log(provider);
        const tokenPromises = Array.from(uniqueTokenAddresses).map(
          async (tokenAddress) => {
            try {
              const tokenContract = new ethers.Contract(
                tokenAddress,
                ERC20ABI,
                provider
              );
              const tokenName = await tokenContract.name();
              return {
                name: tokenName,
                symbol: "CUSTOM",
                address: tokenAddress,
                id: tokenAddress,
                image: "",
              };
            } catch (e) {
              return {
                name: tokenAddress,
                symbol: "CUSTOM",
                address: tokenAddress,
                id: tokenAddress,
                image: "",
              };
            }
          }
        );

        const tokens = await Promise.all(tokenPromises);
        setCustomTokens(tokens);
      } else {
        setError("Failed to fetch pools");
        toast.error("Failed to fetch pools");
      }
    } catch (err) {
      setError("Failed to fetch token data");
      toast.error("Failed to fetch token data");
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, walletConnected]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const allTokens = [...customTokens, ...coinData];
  const filteredCoins = filterCoins(allTokens, searchQuery);
  const paginatedCoins = filteredCoins.slice(0, visibleCoins);

  const lastCoinRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCoins < filteredCoins.length) {
          setVisibleCoins((prev) => prev + ITEMS_PER_PAGE);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, visibleCoins, filteredCoins.length]
  );

  const handleSelectCoin = (coin: Coin) => {
    coinType === "coin1" ? setCoin1(coin) : setCoin2(coin);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="border border-red hover:bg-red/10 transition-colors p-2.5 rounded-lg w-[160px] h-[44px]">
          <div className="flex items-center justify-between w-full">
            {coinType === "coin1"
              ? coin1?.symbol || "Select Token"
              : coin2?.symbol || "Select Token"}
            <ChevronDownIcon className="h-4 w-4 shrink-0" />
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[20px]">Select Tokens</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 bg-[#E0E0E04D] p-[20px]">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
          />

          {isLoading && <CoinLoadingSkeleton />}
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}
          {!walletConnected && (
            <div className="text-red-500 text-center py-4">
              Wallet not connected. Connect your wallet to load custom tokens.
            </div>
          )}

          {!isLoading && !error && filteredCoins.length > 0 && (
            <ScrollArea className="h-[60vh] rounded-md border p-2">
              {paginatedCoins.map((coin, index) => (
                <div
                  key={coin.id || index}
                  className="p-2 border-b cursor-pointer flex flex-row items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() => handleSelectCoin(coin)}
                  ref={index === paginatedCoins.length - 1 ? lastCoinRef : null}
                >
                  <p>{coin.name}</p>
                  <span className="text-sm text-neutral-500 ml-auto">
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoinSelect;
