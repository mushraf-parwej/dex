import { ethers } from 'ethers';
import { poolabi } from "../../../../lib/config/poolabi.json";

const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia");
const privateKey = "your priv key please!";
const signer = new ethers.Wallet(privateKey, provider);

const poolAddress = 0x06ad811434afd10E597232B4513b70b3a8950a1e;
const token0 = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
const token1 = 0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0;

async function Swap() {
    const poolContract = new ethers.Contract(poolAddress, poolabi, signer);
    
    try {
        const recipient = await signer.getAddress(); // Get the address of the signer (your wallet)
        const zeroForOne = true; // Set this based on which token you are swapping (true for token0 to token1)
        const amountSpecified = ethers.parseUnits(sellAmount, 18); // Assuming token has 18 decimals
        const sqrtPriceLimitX96 = 0; // No price limit (set to 0 for no limit)
        const data = "0x"; // Any additional data needed for your swap; can be empty

        console.log("Swapping", amountSpecified.toString(), "tokens from", token0, "to", token1);

        // Call the swap function
        const tx = await poolContract.swap(recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data);
        console.log("Transaction sent:", tx.hash);

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
    } catch (error) {
        console.error("Error executing swap:", error);
    }
}

// Call the Swap function
Swap();
