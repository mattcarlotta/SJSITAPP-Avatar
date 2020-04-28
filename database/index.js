import bluebird from "bluebird";
import mongoose from "mongoose";
import chalk from "chalk";

const { log } = console;
const { DATABASE, inTesting } = process.env;

const options = {
  useNewUrlParser: true, // avoids DeprecationWarning: current URL string parser is deprecated
  useCreateIndex: true, // avoids DeprecationWarning: collection.ensureIndex is deprecated.
  useFindAndModify: false, // avoids DeprecationWarning: collection.findAndModify is deprecated.
  useUnifiedTopology: true, // avoids DeprecationWarning: current Server Discovery and Monitoring engine is deprecated
};

module.exports.connectDatabase = () =>
  mongoose.createConnection(`mongodb://localhost/${DATABASE}`, options);

//= ===========================================================//
//* MONGO DB CONFIG */
//= ===========================================================//
mongoose.connect(`mongodb://localhost/${DATABASE}`, options); // connect to our mongodb database

mongoose.Promise = bluebird; // bluebird for mongoose promises

if (!inTesting) {
  mongoose.connection.on(
    "connected",
    () =>
      log(
        `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
          `Connected to ${DATABASE}\n`
        )}\n`
      ) // log mongodb connection established
  );

  mongoose.connection.on(
    "disconnected",
    () =>
      log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.rgb(
          34,
          155,
          127
        )(`Disconnected from ${DATABASE}`)}\n`
      ) // log mongodb connection disconnected
  );

  mongoose.connection.on(
    "error",
    () =>
      log(
        `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" ERROR ")} ${chalk.red(
          `Connection error to ${DATABASE}`
        )}\n`
      ) // log mongodb connection error
  );

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      log(
        `${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.magenta(
          `Connection was manually terminated from ${DATABASE}`
        )}\n`
      );
      process.exit(0);
    });
  });
}
