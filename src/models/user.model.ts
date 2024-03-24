import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { userModelInterface } from "../interfaces/config.interface";

const userSchema = new mongoose.Schema<userModelInterface>(
  {
    userName: {
      type: String,
      required: [true, "username is required."],
    },
    email: {
      type: String,
      required: [true, "email is required."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    loginType: {
      type: String,
      required: [true, "Please provide a login type."],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre<userModelInterface>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const accessTokenSecret: Secret =
    process.env.ACCESS_TOKEN_SECRET || "default_secret";
  return jwt.sign(
    {
      id: this._id,
      iat: Date.now(),
    },
    accessTokenSecret
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshTokenSecret: Secret =
    process.env.REFRESH_TOKEN_SECRET || "default_another_secret";
  return jwt.sign(
    {
      id: this._id,
      iat: Date.now(),
    },
    refreshTokenSecret,
    {
      expiresIn: 1000 * 60 * 60 * 24 * 15,
    }
  );
};

export const User = mongoose.model("User", userSchema);
