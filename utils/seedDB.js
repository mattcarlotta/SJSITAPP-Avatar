/* eslint-disable no-console */
import chalk from "chalk";
import { v4 as uuid } from "uuid";
import "~env";
import { createConnection } from "~database";
import User from "~models/user";

const { DATABASE, SEEDDB } = process.env;

/**
 * Function to seed the testing Mongo database.
 *
 * @function
 * @async
 * @function createConnection - connects to testing Mongo database.
 * @function close - closes connection to testing Mongo database.
 * @returns {string} - displays a:  PASS  utils/seedDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/seedDB.js message to console with the error.
 */
const globalSetup = async () => {
  const db = await createConnection();
  try {
    const databaseExists = User.findOne({ email: "bob.dole@example.com" });
    if (databaseExists) await db.dropDatabase();

    const testUser1 = {
      avatar: "",
      email: "bob.dole@example.com",
      password: "password",
      firstName: "Bob",
      lastName: "Dole",
      role: "employee",
      token: uuid(),
      emailReminders: true,
      registered: new Date(),
    };

    const testUser2 = {
      avatar: "",
      email: "jane.doe@example.com",
      password: "password",
      firstName: "Jane",
      lastName: "Doe",
      role: "staff",
      token: uuid(),
      emailReminders: true,
      registered: new Date(),
    };

    const testUser3 = {
      avatar: "1.png",
      email: "annie.dole@example.com",
      password: "password",
      firstName: "Annie",
      lastName: "Dole",
      role: "employee",
      token: uuid(),
      emailReminders: true,
      registered: new Date(),
    };

    const testUser4 = {
      avatar: "2.png",
      email: "chuck.doe@example.com",
      password: "password",
      firstName: "Chuck",
      lastName: "Doe",
      role: "employee",
      token: uuid(),
      emailReminders: true,
      registered: new Date(),
    };

    const testUser5 = {
      avatar: "",
      email: "jamie.doe@example.com",
      password: "password",
      firstName: "Jamie",
      lastName: "Doe",
      role: "employee",
      token: uuid(),
      emailReminders: true,
      status: "suspended",
      registered: new Date(),
    };

    await User.insertMany([
      testUser1,
      testUser2,
      testUser3,
      testUser4,
      testUser5,
    ]);

    await db.close();

    console.log(
      `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" SEED ")} ${chalk.blue(
        `\x1b[2mutils/\x1b[0m\x1b[1mseedDB.js\x1b[0m (${DATABASE})`
      )}\n`
    );

    return SEEDDB ? process.exit(0) : true;
  } catch (err) {
    console.log(
      `\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mseedDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m`
    );

    return SEEDDB ? process.exit(1) : false;
  }
};

if (SEEDDB) globalSetup();

export default globalSetup;
/* eslint-enable no-console */
