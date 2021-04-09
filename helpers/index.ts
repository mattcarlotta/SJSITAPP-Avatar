import get from "lodash.get";
import type { Request, Response } from "express";

/**
 * Helper function to parse req.session.
 *
 * @function parseSession
 * @param req - express `Request`
 * @returns string or undefined
 */
const parseSession = (req: Request): string | undefined => get(req, ["session", "user", "id"]);

/**
 * Helper function to send an error to the CLIENT.
 *
 * @function
 * @param err - error message
 * @param statusCode - status code error
 * @param res - res object
 * @returns Response
 */
 const sendError = (err: Error, statusCode: number, res: Response): Response =>
  res.status(statusCode).json({ err: err.toString() });

export { parseSession, sendError };
