import { Document, Types } from "mongoose";
import { Request } from "express";

// Define the structure of user model
interface userModelInterface extends Document {
  userName: string;
  email: string;
  password: string;
  loginType: string;
  refreshToken?: string;

  matchPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Define the structure of url model
interface urlModelInterface extends Document {
  shortId: string;
  actualUrl: string;
  createdBy: Types.ObjectId;
}

interface feedbackModelInterface extends Document {
  userName: string;
  email: string;
  content: string;
}

// Define the structure of decoded data comming from req header's token.
interface decodedDataInterface {
  id: string;
  iat: number;
}

// Define the structure of decoded data from user refreshtoken
interface decodedRefreshTokenDataInterface {
  id: string;
  iat: number;
  exp: number;
}

// Define the structure of express request
interface myCustomReq extends Request {
  userId: string;
}

export {
  userModelInterface,
  decodedDataInterface,
  decodedRefreshTokenDataInterface,
  urlModelInterface,
  myCustomReq,
  feedbackModelInterface,
};
