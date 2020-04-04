/* eslint-disable no-console */
import "~env";
import { connectDatabase } from "database";
// import User from "~models/user";

const { SEED } = process.env;

/**
 * Function to seed the testing Mongo database.
 *
 * @function
 * @async
 * @function connectDatabase - connects to testing Mongo database.
 * @function close - closes connection to testing Mongo database.
 * @returns {string} - displays a:  PASS  utils/seedDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/seedDB.js message to console with the error.
 */
const seedDB = async () => {
  const db = connectDatabase();
  try {
    await db.close();

    return console.log(
      "\n\x1b[7m\x1b[32;1m PASS \x1b[0m \x1b[2mutils/\x1b[0m\x1b[1mseedDB.js"
    );
  } catch (err) {
    return console.log(
      "\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mseedDB.js\x1b[0m\x1b[31m\n" +
        err.toString() +
        "\x1b[0m"
    );
  } finally {
    if (SEED) process.exit(0);
  }
};

if (SEED) seedDB();

module.exports = seedDB;
/* eslint-enable no-console */
