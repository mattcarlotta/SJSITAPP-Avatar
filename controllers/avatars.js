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

    if (exisitingUser.avatar)
      await fs.remove(`uploads/${exisitingUser.avatar}`);

    await exisitingUser.updateOne({ avatar: "" });

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
    const { avatar } = req.file;
    if (!avatar) throw String(unableToLocateFile);

    const exisitingUser = await User.findOne({ _id });
    if (!exisitingUser) throw String(unableToLocateUser);

    if (exisitingUser.avatar)
      await fs.remove(`uploads/${exisitingUser.avatar}`);

    await exisitingUser.updateOne({ avatar }, { upsert: true });

    res
      .status(200)
      .json({ message: "Successfully updated your current avatar.", avatar });
  } catch (err) {
    return sendError(err, 400, res);
  }
};

export { deleteUserAvatar, updateUserAvatar };
