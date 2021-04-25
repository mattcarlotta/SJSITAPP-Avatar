import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import fs from "fs-extra";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import User from "~models";
import { sendError } from "~helpers";
import { unableToLocateUser, unableToProcessFile } from "~helpers/errors";

/**
 * Deletes an avatar for the signed in user.
 *
 * @param req - express `Request`
 * @param res - express `Response`
 * @returns {Response} message
 * @throws {ResponseError}
 */
const deleteUserAvatar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id: _id } = req.params;
    if (!isValidObjectId(_id)) throw unableToLocateUser;

    const existingUser = await User.findOne({ _id });
    if (!existingUser) throw unableToLocateUser;

    if (existingUser.avatar) await fs.remove(`uploads/${existingUser.avatar}`);

    await existingUser.updateOne({ avatar: "" });

    return res
      .status(200)
      .json({ message: "Successfully removed your current avatar." });
  } catch (err) {
    return sendError(err, 400, res);
  }
};

/**
 * Updates an avatar for the signed in user.
 *
 * @param req - express `Request`
 * @param res - express `Response`
 * @param filename - string `filename`
 * @returns {Response} message
 * @throws {ResponseError}
 */
const updateUserAvatar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id: _id } = req.params;
    if (!isValidObjectId(_id)) throw unableToLocateUser;
    if (req.err || !req.file) throw String(req.err || unableToProcessFile);

    const exisitingUser = await User.findOne({ _id });
    if (!exisitingUser) throw unableToLocateUser;

    const avatar = `${uuid()}.png`;
    const filepath = `uploads/${avatar}`;

    await fs.ensureDir("uploads");

    await sharp(req.file.buffer)
      .resize({
        width: 256,
        height: 256,
        fit: "cover",
        withoutEnlargement: true
      })
      .toFile(filepath);

    if (exisitingUser.avatar)
      await fs.remove(`uploads/${exisitingUser.avatar}`);

    await exisitingUser.updateOne({ avatar }, { upsert: true });

    return res
      .status(200)
      .json({ message: "Successfully updated your current avatar.", avatar });
  } catch (err) {
    return sendError(err, 400, res);
  }
};

export { deleteUserAvatar, updateUserAvatar };
