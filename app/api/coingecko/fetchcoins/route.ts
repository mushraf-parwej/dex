import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward query parameters
    const url = new URL(request.url);
    const queryParams = url.searchParams.toString();

    const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr`;
    const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
    if (!COINGECKO_API_KEY) throw new Error("Invalid API Key");
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": COINGECKO_API_KEY,
      },
      next: { revalidate: 60 },
    };

    const response = await fetch(coingeckoUrl, options);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
