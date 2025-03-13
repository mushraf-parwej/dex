// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { ethers } from "ethers";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { getCoinData } from "@/actions/coingecko/getCoinData.action";
// import { Button } from "../button";
// import { ScrollArea } from "../scroll-area";
// import { Input } from "../input";
// import { useCoinStore } from "@/store";
// import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
// import Image from "next/image";
// import { Skeleton } from "@/components/ui/skeleton";
// import { SearchInput } from "@/components/common/SearchBar";
// import { filterCoins } from "@/lib/utils/utils";

// const ITEMS_PER_PAGE = 20;
// export interface Coin {
//   id: string;
//   name: string;
//   symbol: string;
//   image: string;
//   address: string;
// }

// interface CoinSelectProps {
//   coinType: "coin1" | "coin2";
// }
// const ERC20ABI = [
//   "function name() view returns (string)",
//   "function balanceOf(address) view returns (uint256)",
//   "function approve(address spender, uint256 amount) returns (bool)",
//   "function allowance(address owner, address spender) view returns (uint256)",
// ];

// const CoinLoadingSkeleton = () => (
//   <ScrollArea className="h-[60vh] rounded-md border p-2">
//     {Array.from({ length: 15 }).map((_, i) => (
//       <div key={i} className="p-2 border-b flex items-center space-x-2">
//         <Skeleton className="h-6 w-6 rounded-full" />
//         <div className="space-y-2">
//           <Skeleton className="h-4 w-[200px]" />
//         </div>
//       </div>
//     ))}
//   </ScrollArea>
// );

// const CoinSelect: React.FC<CoinSelectProps> = ({ coinType }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [coinData, setCoinData] = useState<Coin[]>([]);
//   const [customTokens, setCustomTokens] = useState<Coin[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [visibleCoins, setVisibleCoins] = useState(ITEMS_PER_PAGE);
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   const { coin1, coin2, setCoin1, setCoin2 } = useCoinStore();

//   useEffect(() => {
//     const fetchTokens = async () => {
//       if (!isOpen) return;

//       try {
//         setIsLoading(true);
//         setError(null);

//         // Fetch CoinGecko tokens
//         const coinGeckoData = await getCoinData();
//         console.log(coinGeckoData);
//         if (Array.isArray(coinGeckoData)) {
//           setCoinData(coinGeckoData);
//         } else {
//           setError("Invalid CoinGecko data format");
//         }

//         // Fetch Custom Tokens from MongoDB
//         const res = await fetch("/api/pools");
//         const poolData = await res.json();
//         if (Array.isArray(poolData)) {
//           // Collect unique token addresses from poolData
//           const uniqueTokenAddresses = new Set<string>();
//           poolData.forEach((pool) => {
//             uniqueTokenAddresses.add(pool.token0);
//             uniqueTokenAddresses.add(pool.token1);
//           });

//           // Set up the ethers provider. Replace NEXT_PUBLIC_RPC_URL with your RPC endpoint.
//           const provider = new ethers.BrowserProvider(window.ethereum);

//           // Fetch token names using the ERC20 ABI
//           const tokenPromises = Array.from(uniqueTokenAddresses).map(
//             async (tokenAddress) => {
//               try {
//                 const tokenContract = new ethers.Contract(
//                   tokenAddress,
//                   ERC20ABI,
//                   provider
//                 );
//                 const tokenName = await tokenContract.name();
//                 return {
//                   name: tokenName,
//                   symbol: "CUSTOM", // adjust if you need to fetch the actual symbol too
//                   address: tokenAddress,
//                   id: tokenAddress, // ensure each token has a unique id if needed
//                   image: "",
//                 };
//               } catch (e) {
//                 console.error(
//                   "Failed to fetch token name for",
//                   tokenAddress,
//                   e
//                 );
//                 // Fallback: use the token address as the name
//                 return {
//                   name: tokenAddress,
//                   symbol: "CUSTOM",
//                   address: tokenAddress,
//                   id: tokenAddress,
//                   image: "",
//                 };
//               }
//             }
//           );

//           const tokens = await Promise.all(tokenPromises);
//           setCustomTokens(tokens);
//         } else {
//           console.error("Error fetching pools");
//         }
//       } catch (err) {
//         setError("Failed to fetch token data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTokens();
//   }, [isOpen]);

//   const allTokens = [...customTokens, ...coinData];

//   const filteredCoins = filterCoins(allTokens, searchQuery);

//   const paginatedCoins = filteredCoins.slice(0, visibleCoins);

//   const lastCoinRef = useCallback(
//     (node: HTMLElement | null) => {
//       if (isLoading) return;
//       if (observerRef.current) observerRef.current.disconnect();

//       observerRef.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && visibleCoins < filteredCoins.length) {
//           setVisibleCoins((prev) => prev + ITEMS_PER_PAGE);
//         }
//       });

//       if (node) observerRef.current.observe(node);
//     },
//     [isLoading, visibleCoins, filteredCoins.length]
//   );

//   const handleSelectCoin = (coin: Coin) => {
//     if (coinType === "coin1") {
//       setCoin1(coin);
//     } else {
//       setCoin2(coin);
//     }
//     setIsOpen(false);
//   };

//   const selectedCoin = coinType === "coin1" ? coin1 : coin2;

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="border border-red hover:bg-red/10 transition-colors p-2.5 rounded-lg w-[160px] h-[44px]"
//           onClick={() => setIsOpen(true)}
//         >
//           <div className="flex items-center justify-between w-full">
//             {selectedCoin ? (
//               <div className="flex items-center flex-1 min-w-0">
//                 {selectedCoin.image ? (
//                   <Image
//                     src={selectedCoin.image}
//                     alt={selectedCoin.name}
//                     width={24}
//                     height={24}
//                     className="rounded-full shrink-0"
//                   />
//                 ) : (
//                   <div className="w-6 h-6 bg-gray-300 rounded-full shrink-0" />
//                 )}
//                 <span className="font-medium truncate">
//                   {selectedCoin.symbol.toUpperCase()}
//                 </span>
//               </div>
//             ) : (
//               <span>Select Token</span>
//             )}
//             <ChevronDownIcon className="h-4 w-4 shrink-0" />
//           </div>
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-[20px]">Select Tokens</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 bg-[#E0E0E04D] p-[20px]">
//           <SearchInput
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search tokens..."
//           />

//           {isLoading && <CoinLoadingSkeleton />}

//           {error && (
//             <div className="text-red-500 text-center py-4">{error}</div>
//           )}

//           {!isLoading && !error && filteredCoins.length === 0 && (
//             <div className="text-center py-4">No coins found</div>
//           )}

//           {!isLoading && !error && filteredCoins.length > 0 && (
//             <ScrollArea className="h-[60vh] rounded-md border p-2">
//               {paginatedCoins.map((coin, index) => (
//                 <div
//                   key={coin.id || index}
//                   className="p-2 border-b cursor-pointer flex flex-row items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
//                   onClick={() => handleSelectCoin(coin)}
//                   ref={index === paginatedCoins.length - 1 ? lastCoinRef : null}
//                 >
//                   <p>{coin.name}</p>
//                   <span className="text-sm text-neutral-500 ml-auto">
//                     {coin.symbol.toUpperCase()}
//                   </span>
//                 </div>
//               ))}
//             </ScrollArea>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
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

// Updated interface: address is required.
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

const ERC20ABI = [
  "function name() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

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

interface CoinSelectProps {
  coinType: "coin1" | "coin2";
}

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

      // Fetch tokens from CoinGecko
      const coinGeckoData = await getCoinData();
      let coinsArray: Coin[] = [];
      if (Array.isArray(coinGeckoData)) {
        coinsArray = coinGeckoData.map((coin: any) => ({
          ...coin,
          // Use coin.address if present, otherwise fallback to coin.id.
          address: coin.address ? coin.address : coin.id,
        }));
      } else if (coinGeckoData?.coins && Array.isArray(coinGeckoData.coins)) {
        coinsArray = coinGeckoData.coins.map((coin: any) => ({
          ...coin,
          address: coin.address ? coin.address : coin.id,
        }));
      } else {
        setError("Invalid CoinGecko data format");
        toast.error("Invalid CoinGecko Data");
      }
      setCoinData(coinsArray);

      // Fetch custom tokens from MongoDB
      const res = await fetch("/api/pools");
      const poolData = await res.json();
      if (Array.isArray(poolData)) {
        const uniqueTokenAddresses = new Set<string>();
        poolData.forEach((pool: any) => {
          if (pool.token0) uniqueTokenAddresses.add(pool.token0);
          if (pool.token1) uniqueTokenAddresses.add(pool.token1);
        });

        if (typeof window !== "undefined" && window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);

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
                  image: "", // You may set a custom icon URL here if available
                };
              } catch (e) {
                console.error(
                  "Failed to fetch token name for",
                  tokenAddress,
                  e
                );
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
          console.error("No ethereum provider found.");
        }
      } else {
        setError("Failed to fetch pools");
        toast.error("Failed to fetch pools");
      }
    } catch (err) {
      console.error("Failed to fetch token data:", err);
      setError("Failed to fetch token data");
      toast.error("Failed to fetch token data");
    } finally {
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Merge custom tokens and CoinGecko data.
  const allTokens = [...customTokens, ...coinData];
  // Simple filtering based on search query.
  const filteredCoins = allTokens.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
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

          {!isLoading && !error && filteredCoins.length > 0 && (
            <ScrollArea className="h-[60vh] rounded-md border p-2">
              {paginatedCoins.map((coin, index) => (
                <div
                  key={coin.id || index}
                  className="p-2 border-b cursor-pointer flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() => handleSelectCoin(coin)}
                  ref={index === paginatedCoins.length - 1 ? lastCoinRef : null}
                >
                  {/* Render the coin's icon if available */}
                  {coin.image ? (
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={24}
                      height={24}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full shrink-0" />
                  )}
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
