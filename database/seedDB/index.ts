import "snackables";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { connectToDB, createConnectionToDatabase } from "../index";
import { logErrorMessage, logInfoMessage } from "../../logger";
import User from "../../models";

const { DATABASE, EXIT, SEED } = process.env;

/**
 * Function to seed the testing Mongo database.
 *
 * @function
 * @returns {string} - displays a:  PASS  utils/seedDB.js message to console.
 * @throws {error} - displays a:  FAIL  utils/seedDB.js message to console with the error.
 */
 const seedDB = async (): Promise<any> => {
  try {
    await connectToDB();
    const db = await createConnectionToDatabase();

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

    logInfoMessage(
      `\x1b[2mutils/\x1b[0m\x1b[1mseedDB.js\x1b[0m (${DATABASE})\n`
    );

    await mongoose.connection.close();

    if (EXIT) process.exit(0);

    return null;
  } catch (err) {
    logErrorMessage(`seedDB.js\x1b[0m\x1b[31m\n${err.toString()}\x1b[0m\n`);

    mongoose.connection.close();

    process.exit(0);
  }
};

if (SEED) seedDB();

export default seedDB;
/* eslint-enable no-console */
