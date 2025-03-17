# All Features

1. **SWAPPING OF TOKENS:**

Users can select the token pairs that they wish to swap and receive the outcome tokens based on slippage tolerance. Here we have used the Swaprouter contract from Uniswap V3 periphery.

2. **CREATING LIQUIDITY POOLS:**

Users can create pools of tokens by supplying liquidity for both tokens. It will check if the same pool already exists or not. Here we have used the Uniswap v3 factory contract.

3. **MINTING POSITION:**

On the pool page, after selecting the token pair, the program will check if the pool exists for that pool. If it does, it will ask the user to mint the position in the existing pool. If it doesn’t, it will first create the pool, initialize it with the base price, and then mint the position in that newly created pool.

4. **CONNECT WALLET:**

Allows users to interact with the QDEX by connecting their cryptocurrency wallets. It forms the basis for all user interactions with the DEX, such as trading, managing tokens, and providing liquidity

5. **ANALYTICS PAGE:**

Users can view details about the ERC 20 tokens like their Name, Symbol, and current price in USD.

# All Contracts:

1. Uniswap V3 Factory (Verified): https://sepolia.etherscan.io/address/0x32e175a35150847cfe9172cca3810e1d7e48f773
2. Non Fungible Position Manager (Verified): [sepolia.etherscan.io/](https://sepolia.etherscan.io/address/0x5610EDc4FFf83CD27005C8fac3cFAc41396A759B)
3. Swap Router (Verified): [sepolia.etherscan.io](https://sepolia.etherscan.io/address/0x217eE4295fcFDedF740080fA12b6ec82c60A973a)
4. Limit Order Contracts (Not Verified):
    
    LimitOrderReactor: https://sepolia.etherscan.io/address/0x69321E31b08b31E3D6453a3BaeC4013813d4b8A9
   
    DutchOrderReactor: https://sepolia.etherscan.io/address/0x453C0545a2B8AA9DEb8A552b33A74b75f4DFD8D2
   
    SwapRouter02Executor: https://sepolia.etherscan.io/address/0xeD3e638A3B7Fdba6a290cB1bc2572913fe841d71
   
    MultiFillerSwapRouter02Executor: https://sepolia.etherscan.io/address/0x4a2599190fdB5c90bF068c91C2ec87D05942E4F3
    
6. EURC/USDC Pool (Not Verified): [sepolia.etherscan.io](https://sepolia.etherscan.io/address/0x391246C0873ff6a14aba382bB6bc7eC3fE9Bd083)

# Demo Videos:

**Mint position:** https://www.loom.com/share/e64418a972ea4086b0b907cec98596e7  

**Create New Pool:** https://drive.google.com/file/d/1w22ls7DdwRj23kIfO7DUkSUx5sys48EO/view?usp=sharing

**Send Funds:** https://www.loom.com/share/19241907bc25496dba2c8ff3514f84ea?sid=dcf9f1d7-8487-4cdf-8ce8-da264e059254

**Swap:** https://www.loom.com/share/84d03f06d7b54e0289302460c9acf8cb?sid=1a5cc4d8-c45e-497c-999c-76694425ce5b


# Deployed URL: https://q-dex.vercel.app/
