import type { Request, Response, NextFunction } from "express";
import User from "~models";
import { parseSession, sendError } from "~helpers";
import {
  badCredentials,
  invalidPermissions,
  invalidSession
} from "~helpers/errors";

/**
 * Middleware function to check if a user is logged into a session and the session is valid.
 *
 * @function
 * @returns {function}
 */
const RequireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const _id = parseSession(req);
    if (!_id) throw badCredentials;

    const existingUser = await User.findOne({ _id });
    if (!existingUser) throw badCredentials;
    if (existingUser.status !== "active") throw invalidSession;

    if (req.params.id !== _id && existingUser.role === "member")
      throw invalidPermissions;

    return next();
  } catch (err) {
    return sendError(err, 403, res);
  }
};

export default RequireAuth;
