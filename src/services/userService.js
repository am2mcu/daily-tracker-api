import User from "../models/userModel.js";
import { BadRequest, NotFoundError } from "../utils/errors.js";

export const getMe = async (id) => await User.findById(id);

export const deleteMe = async (id, data) => {
  const user = await User.findById(id).select("+password");

  if (!user) throw new NotFoundError("User not found");

  if (!data?.password || !(await user.comparePassword(data.password)))
    throw new BadRequest();

  await user.updateOne({ isDeleted: true });
  return user;
};
