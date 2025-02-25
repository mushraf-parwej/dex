"use server";

export const getCoinData = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/coingecko/fetchcoins");

    // Check if the response is OK (status code 200-299)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Parse the JSON data
    const data = await res.json();
    console.log(data);
    // Return the parsed data
    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    throw new Error(error);
  }
};

export const getCoinPrice = async (coinName: string) => {
  console.log("coin name is ", coinName);
  try {
    const res = await fetch(
      `http://localhost:3000/api/coingecko/currencyconvert?ids=${coinName}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch coin price for ${coinName}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching coin price for ${coinName}:`, error);
    throw error;
  }
};
