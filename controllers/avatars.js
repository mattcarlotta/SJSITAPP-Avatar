import fs from "fs-extra";
import User from "~models/user";
import { sendError } from "~utils/helpers";
import { unableToLocateUser, unableToLocateFile } from "~utils/errors";

/**
 * Deletes an avatar for the signed in user.
 *
 * @async
 * @function deleteUserAvatar
 * @param {req}
 * @param {res}
 * @returns {object}
 * @throws {function}
 */
const deleteUserAvatar = async (req, res) => {
  try {
    const { id: _id } = req.params;

    const exisitingUser = await User.findOne({ _id });
    if (!exisitingUser) throw String(unableToLocateUser);

    if (exisitingUser.avatarPath) await fs.remove(exisitingUser.avatarPath);

    await exisitingUser.updateOne({ avatar: "", avatarPath: "" });

    res
      .status(200)
      .json({ message: "Successfully removed your current avatar." });
  } catch (err) {
    return sendError(err, 400, res);
  }
};

/**
 * Updates an avatar for the signed in user.
 *
 * @async
 * @function updateUserAvatar
 * @param {req}
 * @param {res}
 * @returns {object}
 * @throws {function}
 */
const updateUserAvatar = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { avatar, avatarPath } = req.file;
    if (!avatar || !avatarPath) throw String(unableToLocateFile);

    const exisitingUser = await User.findOne({ _id });
    if (!exisitingUser) throw String(unableToLocateUser);

    if (exisitingUser.avatarPath) await fs.remove(exisitingUser.avatarPath);

    await exisitingUser.updateOne({ avatar, avatarPath }, { upsert: true });

    res
      .status(200)
      .json({ message: "Successfully updated your current avatar.", avatar });
  } catch (err) {
    return sendError(err, 400, res);
  }
};

export { deleteUserAvatar, updateUserAvatar };
