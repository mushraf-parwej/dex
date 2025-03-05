import { ethers } from 'ethers';
import poolabi from './poolabi.json' with { type: 'json' };

const erc20abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia");
const privateKey = "";
const signer = new ethers.Wallet(privateKey, provider);

const poolAddress = "0x07a9c6b321e507ad6eb853a313afb06286b60b8c";
const token0 = "0xbc60de5fdec277c909eb1763f9996ca1ab496567";
const token1 = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";

async function checkBalances() {
    const signerAddress = await signer.getAddress();
    
    // Check ETH balance
    const ethBalance = await provider.getBalance(signerAddress);
    console.log(`ETH Balance: ${ethers.formatEther(ethBalance)} ETH`);
    
    // Check Token0 (UNI) balance
    const token0Contract = new ethers.Contract(token0, erc20abi, provider);
    const token0Symbol = await token0Contract.symbol();
    const token0Decimals = await token0Contract.decimals();
    const token0Balance = await token0Contract.balanceOf(signerAddress);
    console.log(`${token0Symbol} Balance: ${ethers.formatUnits(token0Balance, token0Decimals)} ${token0Symbol}`);
    
    // Check Token1 balance
    const token1Contract = new ethers.Contract(token1, erc20abi, provider);
    const token1Symbol = await token1Contract.symbol();
    const token1Decimals = await token1Contract.decimals();
    const token1Balance = await token1Contract.balanceOf(signerAddress);
    console.log(`${token1Symbol} Balance: ${ethers.formatUnits(token1Balance, token1Decimals)} ${token1Symbol}`);
    
    return {
        eth: ethBalance,
        token0: token0Balance,
        token1: token1Balance
    };
}

// Function to check pool liquidity
async function checkPoolLiquidity(poolAddress) {
    const poolContract = new ethers.Contract(poolAddress, poolabi, provider);
    try {
        // Get pool slot0 data (includes liquidity info)
        const slot0 = await poolContract.slot0();
        // Get pool liquidity
        const liquidity = await poolContract.liquidity();
        console.log("Pool liquidity:", liquidity.toString());
        console.log("Current sqrt price:", slot0.sqrtPriceX96.toString());
        return liquidity > 0;
    } catch (error) {
        console.error("Error checking liquidity:", error);
        return false;
    }
}

async function checkAndApproveToken(tokenAddress, amount) {
    const tokenContract = new ethers.Contract(tokenAddress, erc20abi, signer);
    const signerAddress = await signer.getAddress();
    
    try {
        const currentAllowance = await tokenContract.allowance(signerAddress, poolAddress);
        
        if (currentAllowance < amount) {
            console.log("Approving tokens...");
            const approveTx = await tokenContract.approve(poolAddress, ethers.MaxUint256);
            console.log("Approval transaction sent:", approveTx.hash);
            await approveTx.wait();
            console.log("Approval confirmed");
        } else {
            console.log("Token already approved");
        }
    } catch (error) {
        console.error("Error in token approval:", error);
        throw error;
    }
}

async function getTokenBalance(tokenAddress) {
    const tokenContract = new ethers.Contract(tokenAddress, erc20abi, signer);
    const signerAddress = await signer.getAddress();
    const balance = await tokenContract.balanceOf(signerAddress);
    const decimals = await tokenContract.decimals();
    return { balance, decimals };
}

async function Swap(sellAmount, slippagePercent = 0.5) {
      try {
        console.log("Checking balances...");
        await checkBalances();
        
        // console.log("\nTo get test UNI tokens on Sepolia:");
        // console.log("1. Visit the Sepolia UNI faucet: Check Uniswap Discord or community");
        // console.log("2. Or use the Uniswap Sepolia interface to get test tokens");
        console.log("3. Your wallet address:", await signer.getAddress());
        console.log("checking liquidity...");
        const hasLiquidity = await checkPoolLiquidity(poolAddress);
        if (!hasLiquidity) {
            throw new Error("Pool has no liquidity. Add liquidity first.");
        }
        
    } catch (error) {
        console.error("Error:", error);
    }
    if (!ethers.isAddress(poolAddress)) {
        throw new Error("Invalid pool address");
    }
    
    const poolContract = new ethers.Contract(poolAddress, poolabi, signer);
    
    try {
        // Check token balance first
        const { balance, decimals } = await getTokenBalance(token0);
        const amountSpecified = ethers.parseUnits(sellAmount.toString(), decimals);
        
        if (balance < amountSpecified) {
            throw new Error(`Insufficient token balance. Have: ${ethers.formatUnits(balance, decimals)}, Need: ${sellAmount}`);
        }

        // Check and approve tokens before swap
        await checkAndApproveToken(token0, amountSpecified);
        
        const recipient = await signer.getAddress();
        const zeroForOne = true; // true for token0 to token1

        // Calculate price limit based on slippage
        // For this example, we're using a simple calculation
        // You might want to get the current pool price first
        const slippageFactor = 1 - (slippagePercent / 100);
        const sqrtPriceLimitX96 = ethers.toBigInt('79228162514264337593543950336'); // A conservative price limit
        
        console.log("Swapping with slippage protection:", slippagePercent, "%");
        console.log("Amount:", ethers.formatUnits(amountSpecified, decimals), "tokens");

        // First try to get a quote
        try {
            const quoteParams = {
                zeroForOne,
                amountSpecified,
                sqrtPriceLimitX96
            };
            
            // You might need to adjust this based on your pool's interface
            const quote = await poolContract.quote(quoteParams);
            console.log("Quote received:", quote);
        } catch (error) {
            console.log("Quote check failed, proceeding with swap anyway:", error.message);
        }

        // Proceed with swap
        // const swapParams = {
        //     recipient,
        //     zeroForOne,
        //     amountSpecified,
        //     sqrtPriceLimitX96,
        //     data: "0x"
        // };

        // Add gas estimation with higher buffer for complex swap
        const gasEstimate = await poolContract.swap.estimateGas(
            recipient,
            zeroForOne,
            amountSpecified,
            sqrtPriceLimitX96,
            "0x",
            { gasLimit: 500000 } // Start with a higher gas limit for estimation
        );

        const gasLimit = Math.floor(gasEstimate * 1.5); // 50% buffer for safety

        const tx = await poolContract.swap(
            recipient,
            zeroForOne,
            amountSpecified,
            sqrtPriceLimitX96,
            "0x",
            { 
                gasLimit,
                maxFeePerGas: ethers.parseUnits("50", "gwei"), // Adjust based on network conditions
                maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
            }
        );
        
        console.log("Swap transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Swap transaction confirmed:", receipt);
        
        return receipt;
    } catch (error) {
        if (error.message.includes("SPL")) {
            console.error("Swap failed due to price impact or slippage. Try adjusting the slippage tolerance or amount.");
        } else {
            console.error("Error executing swap:", error);
        }
        throw error;
    }
}

// Example usage with 0.5% slippage tolerance
const sellAmount = "0.01"; // Reduced amount for testing
Swap(sellAmount, 0.5).catch(console.error);

export default Swap;

