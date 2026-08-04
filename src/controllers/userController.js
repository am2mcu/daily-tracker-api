import asyncHandler from "../utils/asyncHandler.js";
import * as userService from "../services/userService.js";

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await userService.getMe(req.user.id);

  res.status(200).json({ status: "success", data: { user } });
});

export const deleteMe = asyncHandler(async (req, res, next) => {
  const user = await userService.deleteMe(req.user.id, req.body);

  res.status(204).json({ status: "success", data: null });
});
