export const getPools = async () => {
  try {
    const response = await fetch("/api/pools", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Failed to fetch pools");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pools:", error);
    return [];
  }
};
