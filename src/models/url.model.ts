import mongoose from "mongoose";
import { urlModelInterface } from "../interfaces/config.interface";

const urlSchema = new mongoose.Schema<urlModelInterface>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    actualUrl: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Url = mongoose.model("Url", urlSchema);
