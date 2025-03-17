"use server";

import { BASE_URL } from "@/constants";

export const getCoinData = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/coingecko/fetchcoins`);
    console.log(res.ok);
    // Check if the response is OK (status code 200-299)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Parse the JSON data
    const data = await res.json();

    // Return the parsed data
    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    throw new Error(error);
  }
};

export const getCoinPrice = async (coinName: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/coingecko/currencyconvert?ids=${coinName}`
    );
    console.log("result is ", res);
    if (!res.ok) {
      throw new Error(`Failed to fetch  price for ${coinName}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching coin price for ${coinName}:`, error);
    throw error;
  }
};
