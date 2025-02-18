import mongoose from "mongoose";

const PoolSchema = new mongoose.Schema({
  token0: { type: String, required: true },
  token1: { type: String, required: true },
  feeTier: { type: Number, required: true },
  poolAddress: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Pool = mongoose.models.Pool || mongoose.model("Pool", PoolSchema);

export default Pool;
