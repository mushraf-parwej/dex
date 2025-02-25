import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const coinId = request.nextUrl.searchParams.get("ids");

    if (!coinId) {
      return new NextResponse(JSON.stringify({ error: "Missing coin ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY || "", // Provide a default value
      },
    };

    const response = await fetch(coingeckoUrl, options);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error: any) {
    console.error("API error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
