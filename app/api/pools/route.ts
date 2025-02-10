import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Pool from "@/models/Pool";

export async function POST(req: Request) {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("MongoDB Connected!");

    const body = await req.json();
    console.log("Received data:", body);

    const { token0, token1, feeTier, poolAddress } = body;

    if (!token0 || !token1 || !feeTier || !poolAddress) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newPool = new Pool({ token0, token1, feeTier, poolAddress });
    await newPool.save();
    console.log("Pool saved:", newPool);

    return NextResponse.json(
      { message: "Pool saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving pool:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Fetching pools from MongoDB...");
    await connectMongoDB();
    console.log("MongoDB Connected!");

    const pools = await Pool.find({});
    console.log("Pools fetched:", pools);

    return NextResponse.json(pools, { status: 200 });
  } catch (error) {
    console.error("Error fetching pools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("MongoDB Connected!");

    const { poolAddress } = await req.json();
    console.log("Deleting pool with address:", poolAddress);

    if (!poolAddress) {
      return NextResponse.json(
        { error: "Pool address is required" },
        { status: 400 }
      );
    }

    const deletedPool = await Pool.findOneAndDelete({ poolAddress });

    if (!deletedPool) {
      return NextResponse.json(
        { error: "Pool not found" },
        { status: 404 }
      );
    }

    console.log("Pool deleted:", deletedPool);

    return NextResponse.json(
      { message: "Pool deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting pool:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}