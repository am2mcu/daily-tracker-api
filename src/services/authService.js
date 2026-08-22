import User from "../models/userModel.js";
import {
  AuthenticationFailed,
  BadRequest,
  Forbidden,
  NotFoundError,
} from "../utils/errors.js";
import cryptography from "../utils/cryptoHandler.js";
import { sendEmail } from "../utils/email/emailRepository.js";
import env from "../config/env.js";

export const signup = async (data) => {
  const { email, password } = data || {};
  if (!email || !password) throw new BadRequest();

  const verificationToken = cryptography.createRandomToken();

  let user = await User.findOneAndUpdate(
    { email: data.email },
    {
      password: data.password,
      verificationToken: cryptography.hashToken(verificationToken),
      isDeleted: false,
      isVerified: false,
    },
  );

  if (!user)
    user = await User.create({
      email: data.email,
      password: data.password,
      verificationToken: cryptography.hashToken(verificationToken),
    });

  sendEmail(
    user.email,
    "Email Verification",
    `Click on the following link to verify your account: ${env.BASE_URL}/api/v1/verify-account/${verificationToken}`,
  );

  return verificationToken;
};

export const verifyAccount = async (token) => {
  const hash = cryptography.hashToken(token);
  const user = await User.findOneAndUpdate(
    { verificationToken: hash },
    { isVerified: true, $unset: { verificationToken: 1 } },
    { runValidators: true, returnDocument: "after" }, // to call createAuthToken on updated user
  );

  if (!user) throw new Forbidden("Verification token is invalid");

  const jwtToken = await user.createAuthToken();
  return jwtToken;
};

export const login = async (data) => {
  const user = await User.findOne({
    email: data.email,
  }).select("+password");

  if (!user || !(await user.comparePassword(data.password)))
    throw new AuthenticationFailed("Email or password is not valid");

  const token = await user.createAuthToken();
  return token;
};

export const forgotPassword = async (data) => {
  const token = cryptography.createRandomToken();
  const user = await User.findOneAndUpdate(
    { email: data.email },
    {
      passwordResetToken: token,
      passwordResetExpiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    },
  );

  if (!user) return; // do not send email to non-users

  sendEmail(
    user.email,
    "Password reset",
    `Click on the following link to reset your password: http://127.0.0.1:3000/api/v1/users/reset-password/${token}\nThis link will expire in 10 minutes.`,
  );
};

export const resetPassword = async (token, data) => {
  const hash = cryptography.hashToken(token);
  const user = await User.findOneAndUpdate(
    {
      passwordResetToken: hash,
      passwordResetExpiresAt: { $gt: Date.now() },
    },
    {
      password: data.password,
      passwordChangedAt: Date.now(),
      $unset: { passwordResetToken: 1, passwordResetExpiresAt: 1 },
    },
  );

  if (!user)
    throw new Forbidden("Password reset token is either expired or invalid");

  return await user.createAuthToken();
};

export const updatePassword = async (id, data) => {
  if (!data || !data.password || !data.newPassword) throw new BadRequest();

  const user = await User.findById(id).select("+password");
  if (!user) throw new NotFoundError("User not found");

  if (!(await user.comparePassword(data.password)))
    throw new AuthenticationFailed();

  await user.updateOne({
    password: data.newPassword,
    passwordChangedAt: Date.now(),
  });

  const token = await user.createAuthToken();
  return token;
};

export const updateEmail = async (id, data) => {
  if (!data || !data.password || !data.newEmail) throw new BadRequest();

  const user = await User.findById(id).select("+password");
  if (!user) throw new NotFoundError("User not found");

  if (!(await user.comparePassword(data.password)))
    throw new AuthenticationFailed();

  const verificationToken = cryptography.createRandomToken();
  await user.updateOne({
    email: data.newEmail,
    isVerified: false,
    verificationToken: cryptography.hashToken(verificationToken),
  });

  sendEmail(
    user.email,
    "Email Verification",
    `Click on the following link to verify your account: http://127.0.0.1:3000/api/v1/users/verify-account/${verificationToken}`,
  );
};
