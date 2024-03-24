import { ApiError } from "../utils/ApiError.util";
import { ApiResponse } from "../utils/ApiResponse.util";
import { AsynHandler } from "../utils/AsyncHandler.util";
import { Url } from "../models/url.model";
import { Response } from "express";
import { myCustomReq } from "../interfaces/config.interface";

// TODO: url update

const getUrl = AsynHandler(async (req: myCustomReq, res: Response) => {
  const { shortId } = req.query;

  if (!shortId) throw new ApiError(400, "shortId is required.");

  const url = await Url.findOne({ shortId });

  if (!url) throw new ApiError(404, "Url not found.");

  res.status(200).json(new ApiResponse(200, url, "Url fetched successfully"));
});

const deleteUrl = AsynHandler(async (req: myCustomReq, res: Response) => {
  const { id } = req.query;

  if (!id) throw new ApiError(400, "shortId is required.");

  const deletedUrl = await Url.findByIdAndDelete(id);

  if (!deletedUrl) throw new ApiError(500, "Error while deleting Url");

  res.status(200).json(new ApiResponse(200, {}, "Url deleted successfully."));
});

export { getUrl, deleteUrl };
