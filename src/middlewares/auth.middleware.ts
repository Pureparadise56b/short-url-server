import { User } from "../models/user.model";
import { AsynHandler } from "../utils/AsyncHandler.util";
import { ApiError } from "../utils/ApiError.util";
import { Request, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import {
  decodedDataInterface,
  decodedRefreshTokenDataInterface,
  myCustomReq,
} from "../interfaces/config.interface";

const JWTVerify = AsynHandler(
  async (req: myCustomReq, _: any, next: NextFunction) => {
    if (!req.headers["authorization"])
      throw new ApiError(401, "Unauthorized access.");

    const authHeader = req.headers["authorization"]?.split(" ");

    if (authHeader) {
      if (authHeader[0] !== "Bearer")
        throw new ApiError(401, "Invalid token type.");

      if (!authHeader[1])
        throw new ApiError(401, "Authorization token is required.");

      const token = authHeader[1] || "";

      const accessTokenSecret: Secret =
        process.env.ACCESS_TOKEN_SECRET || "default_secret";
      const refreshTokenSecret: Secret =
        process.env.REFRESH_TOKEN_SECRET || "default_another_secret";

      const decodedData = <decodedDataInterface>(
        jwt.verify(token, accessTokenSecret)
      );

      const user = await User.findById(decodedData.id);

      if (!user) throw new ApiError(401, "Invalid token.");

      const decodedRefreshTokenData = <decodedRefreshTokenDataInterface>(
        jwt.verify(user.refreshToken || "", refreshTokenSecret)
      );

      if (decodedRefreshTokenData.exp < Date.now())
        throw new ApiError(401, "Session expired please login.");

      req.userId = user._id;
      next();
    } else {
      throw new ApiError(401, "Invalid token type.");
    }
  }
);

export { JWTVerify };
