import env from "../config/env.js";
import * as authService from "../services/authService.js";
import asyncHandler from "express-async-handler";

const sendAsCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    secure: env.NODE_ENV === "production",
  });
};

export const signup = asyncHandler(async (req, res, next) => {
  const verificationToken = await authService.signup(req.body);

  res.status(200).json({
    status: "success",
    data: {
      message:
        env.NODE_ENV === "development"
          ? `Token: ${verificationToken}`
          : "A verification link has been sent to your email",
    },
  });
});

export const verifyAccount = asyncHandler(async (req, res, next) => {
  const token = await authService.verifyAccount(req.params.token);

  sendAsCookie(res, token);
  res.status(200).json({ status: "success", data: { token } });
});

export const login = asyncHandler(async (req, res, next) => {
  const token = await authService.login(req.body);

  sendAsCookie(res, token);
  res.status(200).json({ status: "success", data: { token } });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  await authService.forgotPassword(req.body);

  res.status(200).json({
    status: "success",
    data: { message: "A password reset link has been sent to your email" },
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const token = await authService.resetPassword(req.params.token, req.body);

  sendAsCookie(res, token);
  res.status(200).json({ status: "success", data: { token } });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const token = await authService.updatePassword(req.user.id, req.body);

  sendAsCookie(res, token);
  res.status(200).json({ status: "success", data: { token } });
});

export const updateEmail = asyncHandler(async (req, res, next) => {
  await authService.updateEmail(req.user.id, req.body);

  res.status(200).json({
    status: "success",
    data: { message: "A verification link has been sent to your email" },
  });
});
