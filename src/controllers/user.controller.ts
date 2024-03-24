import { ApiError } from "../utils/ApiError.util";
import { ApiResponse } from "../utils/ApiResponse.util";
import { AsynHandler } from "../utils/AsyncHandler.util";
import { User } from "../models/user.model";
import { Url } from "../models/url.model";
import { Request, Response } from "express";
import { myCustomReq } from "../interfaces/config.interface";
import {
  ACCEPTED_MAIL_ADDRESSES,
  LOGIN_TYPE,
  ACCEPTED_URLS,
} from "../constants";
import { Feedback } from "../models/feedback.model";

// TODO: update user profile, user profile picture, click count on user's link and so on

const generateTokens = async function (userId: string) {
  const user = await User.findById(userId);
  const accessToken = user?.generateAccessToken();
  const refreshToken = user?.generateRefreshToken();

  if (user) {
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return accessToken;
  } else {
    return null;
  }
};

const generateID = function () {
  const charecters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
  let shortId = "";

  for (let i = 0; i < 8; i++) {
    shortId += charecters[Math.floor(Math.random() * charecters.length)];
  }
  return shortId;
};

const userRegister = AsynHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  const requiredFields = [userName, email, password];

  if (requiredFields.some((field) => !field))
    throw new ApiError(400, "All fields are required.");

  if (!ACCEPTED_MAIL_ADDRESSES.includes(email.split("@")[1]))
    throw new ApiError(400, "This mail address is not accepted.");

  const existingUser = await User.findOne({ email: email });

  if (existingUser)
    throw new ApiError(400, "A user with this email already exists.");

  const user = await User.create({
    userName,
    email: email.toLowerCase(),
    password,
    loginType: LOGIN_TYPE.LOCAL,
  });

  if (!user) throw new ApiError(500, "Error while registering user.");

  res.status(201).json(new ApiResponse(201, {}, "User created successfully."));
});

const userLogin = AsynHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password are required.");

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) throw new ApiError(401, "User does not exist.");

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) throw new ApiError(401, "Password does not matched.");

  const accessToken = await generateTokens(user._id);

  if (!accessToken) throw new ApiError(500, "Error while generating tokens.");

  res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "User loggedin successfully."));
});

const getUser = AsynHandler(async (req: myCustomReq, res: Response) => {
  const user = await User.findById(req.userId).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .json(new ApiResponse(200, user || {}, "User fetched successfully."));
});

const getAllUrl = AsynHandler(async (req: myCustomReq, res: Response) => {
  const urls = await Url.find({ createdBy: req.userId }).sort({
    createdAt: "desc",
  });
  res.status(200).json(new ApiResponse(200, urls, "Urls fetched fuccessfully"));
});

const deleteAccount = AsynHandler(async (req: myCustomReq, res: Response) => {
  const deletedUrlsACK = await Url.deleteMany({ createdBy: req.userId });

  if (!deletedUrlsACK.acknowledged)
    throw new ApiError(500, "Error while deleting all urls.");

  const deletedUser = await User.findByIdAndDelete(req.userId);

  if (!deletedUser) throw new ApiError(500, "Error while deleting user.");

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully."));
});

const generateShortUrl = AsynHandler(
  async (req: myCustomReq, res: Response) => {
    const { userUrl } = req.body;

    if (!userUrl) throw new ApiError(400, "Url is required.");

    const urlProtocol = userUrl.split("://")[0];

    if (!ACCEPTED_URLS.includes(urlProtocol))
      throw new ApiError(400, "This url is not accepted.");

    const shortId = generateID();

    const url = await Url.create({
      shortId,
      actualUrl: userUrl,
      createdBy: req.userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, url, "Url generated successfully"));
  }
);

const submitFeedback = AsynHandler(async (req: myCustomReq, res: Response) => {
  const { userName, email, content } = req.body;
  const requiredFields = [userName, email, content];

  if (requiredFields.some((field) => !field))
    throw new ApiError(400, "All fields are required.");

  const feedback = await Feedback.create({
    userName,
    email,
    content,
  });

  res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback submitted successfully."));
});

export {
  userRegister,
  userLogin,
  getUser,
  generateShortUrl,
  deleteAccount,
  getAllUrl,
  submitFeedback,
};
