import mongoose from "mongoose";

const kittenSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    createdAt: Number,
    updatedAt: Number,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Kitten = mongoose.model("Kitten", kittenSchema, "collectionName");
