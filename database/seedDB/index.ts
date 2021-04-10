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

    const databaseExists = User.findOne({ email: "staffmember@test.com" });
    if (databaseExists) await db.dropDatabase();

    const password = "password";
    const registered = new Date();

    const staffMember = {
      avatar: "",
      email: "staffmember@test.com",
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
      email: "real.member@test.com",
      password,
      firstName: "Real",
      lastName: "Member",
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

    const emptyAvatarMember = {
      avatar: "",
      email: "emptyavatar@test.com",
      password,
      firstName: "Empty",
      lastName: "Avatar",
      role: "member",
      token: uuid(),
      emailReminders: true,
      registered
    };

    const hasAvatarMember = {
      avatar: "2.png",
      email: "hasavatar@test.com",
      password,
      firstName: "Has",
      lastName: "Avatar",
      role: "member",
      token: uuid(),
      emailReminders: true,
      registered
    };

    const signinMember = {
      avatar: "2.png",
      email: "signinmember@test.com",
      password,
      firstName: "Signin",
      lastName: "Member",
      role: "member",
      token: uuid(),
      emailReminders: true,
      registered
    };

    const suspendedMember = {
      avatar: "2.png",
      email: "suspended.employee@test.com",
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
      emptyAvatarMember,
      hasAvatarMember,
      scheduledMember,
      signinMember,
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
