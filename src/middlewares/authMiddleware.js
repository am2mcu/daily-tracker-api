import asyncHandler from "express-async-handler";
import { promisify } from "util";
import {
  Forbidden,
  InvalidAuthHeader,
  MissingToken,
  NotFoundError,
} from "../utils/errors.js";
import User from "../models/userModel.js";
import env from "../config/env.js";
import { verifyAuthToken } from "../utils/jwtHandler.js";

const extractTokenHeader = (header) => {
  const authHeader = header.split(" ");
  if (authHeader[0] !== "Bearer" || !authHeader[1])
    throw new InvalidAuthHeader("Invalid authorization header");

  return authHeader[1];
};

const extractToken = (req) => {
  if (req.headers.authorization)
    return extractTokenHeader(req.headers.authorization);

  if (req.cookies.jwt) return req.cookies.jwt;

  return;
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) throw new MissingToken("Token is missing");

  const { id, iat } = await verifyAuthToken(token);

  const user = await User.findById(id).select("+passwordChangedAt");
  if (!user) throw new NotFoundError("User no longer exists");

  // prevent tokens from a deleted account or newly changed (email)
  if (!user.isVerified) throw new Forbidden("User is not verified yet");
  if (user.isDeleted) throw new NotFoundError("User no longer exists");

  if (user.isPasswordChangedAfterToken(iat))
    throw new Forbidden("Passowrd has changed. Token is no longer valid");

  req.user = user;
  next();
});

export const authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) throw new AuthenticationFailed();

    if (!roles.includes(req.user.role))
      throw new Forbidden("Not allowed to access this resource");

    next();
  });
};
