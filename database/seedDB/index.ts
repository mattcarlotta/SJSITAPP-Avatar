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

    const password = "password";
    const registered = new Date();

    const staffMember = {
      avatar: "",
      email: "staffmember@example.com",
      password,
      firstName: "Staff",
      lastName: "Member",
      role: "staff",
      token: uuid(),
      emailReminders: true,
      registered
    };

    const realMember = {
      avatar: "",
      email: "carlotta.matthew@gmail.com",
      password,
      firstName: "Matthew",
      lastName: "Carlotta",
      role: "member",
      token: uuid(),
      emailReminders: true,
      registered
    };

    const scheduledMember = {
      avatar: "2.png",
      email: "scheduledmember@test.com",
      password,
      firstName: "Scheduled",
      lastName: "Member",
      role: "member",
      token: uuid(),
      emailReminders: true,
      registered
    };

    const suspendedMember = {
      avatar: "",
      email: "suspended.employee@example.com",
      password,
      firstName: "Suspended",
      lastName: "Employee",
      role: "member",
      token: uuid(),
      emailReminders: true,
      registered,
      status: "suspended"
    };

    await User.insertMany([
      staffMember,
      realMember,
      scheduledMember,
      suspendedMember
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
