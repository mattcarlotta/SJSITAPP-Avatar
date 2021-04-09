import type { Request, Response, NextFunction } from "express";
import User from "~models";
import { parseSession, sendError } from "~helpers";
import { badCredentials, invalidSession } from "~helpers/errors";

/**
 * Middleware function to check if a user is logged into a session and the session is valid.
 *
 * @function
 * @returns {function}
 */
const RequireAuth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const _id = parseSession(req);
    if (!_id) throw String(badCredentials);

    const existingUser = await User.findOne({ _id });
    if (!existingUser) throw String(badCredentials);
    if (existingUser.status !== "active") throw String(invalidSession);

    return next();
  } catch (err) {
    return sendError(err, 403, res);
  }
};

export default RequireAuth;