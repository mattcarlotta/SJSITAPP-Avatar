/* eslint-disable */
import chalk from "chalk";
import "~env";
import { createConnection } from "~database";
const { DATABASE, DROPDB } = process.env;

/**
 * Function to tear down the testing Mongo database.
 *
 * @function
 * @async
 * @function createConnection - connects to testing Mongo database.
 * @function dropDatabase - drops testing Mongo database.
 * @function close - closes connection to testing Mongo database.
 * @returns {string} - displays a:  PASS  utils/teardownDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/teardownDB.js message to console with the error.
 */

const teardownDB = async () => {
  const db = await createConnection();
  try {
    await db.dropDatabase();
    await db.close();

    console.log(
      `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" PASS ")} ${chalk.blue(
        `\x1b[2mutils/\x1b[0m\x1b[1mteardownDB.js\x1b[0m (${DATABASE})`
      )}\n`
    );

    return DROPDB ? process.exit(0) : true;
  } catch (err) {
    console.log(
      `\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mteardownDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m`
    );
    return DROPDB ? process.exit(1) : false;
  }
};

if (DROPDB) teardownDB();

export default teardownDB;
/* eslint-enable no-console */
