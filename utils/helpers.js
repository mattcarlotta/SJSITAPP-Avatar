import random from "lodash.random";
import get from "lodash.get";

const tokenGenerator = (str, tlen) => {
  const arr = [...str];
  const max = arr.length - 1;
  let token = "";
  for (let i = 0; i < tlen; i += 1) {
    const int = random(max);
    token += arr[int];
  }
  return token;
};

/**
 * Helper function to create a random string.
 *
 * @function createRandomToken
 * @returns {String}
 */
const createRandomToken = () =>
  tokenGenerator(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$/.",
    64
  );

/**
 * Helper function to create a random string.
 *
 * @function createRandomString
 * @returns {String}
 */
const createRandomString = () =>
  tokenGenerator(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    8
  );

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

export { createRandomToken, createRandomString, parseSession, sendError };
