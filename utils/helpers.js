import random from "lodash.random";
import get from "lodash.get";

/**
 * Helper function to parse req.session.
 *
 * @function parseSession
 * @returns {string}
 */
const parseSession = (req) => get(req, ["session", "user", "id"]);

/**
 * Helper function to send an error to the client.
 *
 * @function sendError
 * @returns {function}
 */
const sendError = (err, statusCode, res) =>
  res.status(statusCode).json({ err: err.toString() });

export { parseSession, sendError };
