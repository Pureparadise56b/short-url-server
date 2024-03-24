import mongoose from "mongoose";
import { feedbackModelInterface } from "../interfaces/config.interface";

const feedbackSchema = new mongoose.Schema<feedbackModelInterface>(
  {
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
