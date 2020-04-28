import User from "~models/user";
import { parseSession, sendError } from "~utils/helpers";
import { badCredentials, invalidSession } from "~utils/errors";

/**
 * Middleware function to check if a user is logged into a session and the session is valid.
 *
 * @function
 * @returns {function}
 */
export default async (req, res, next) => {
  try {
    const _id = parseSession(req);
    if (!_id) throw String(badCredentials);

    const existingUser = await User.findOne({ _id });
    if (!existingUser) throw String(badCredentials);
    if (existingUser.status !== "active") throw String(invalidSession);

    req.user = existingUser;

    next();
  } catch (err) {
    return sendError(err, 403, res);
  }
};
