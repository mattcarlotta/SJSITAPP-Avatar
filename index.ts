import express from "express";
import middlewares from "~middlewares";
import { connectToDB } from "~database";
import routes from "~routes";
import { logInfoMessage, logErrorMessage } from "~logger";

const { CLIENT, PORT } = process.env;

(async () => {
  try {
    await connectToDB();

    const server = express();

    middlewares(server);

    server.use("/api", routes);
    server.use("/uploads", express.static("uploads"));
    server.use("/images", express.static("images"));
    server.use("/favicon.ico", express.static("images/favicon.ico"));

    server.listen(PORT, (err?: Error) => {
      if (err) throw err;
      logInfoMessage(`Listening for requests from: \x1b[1m${CLIENT}\x1b[0m\n`);
    });
  } catch (err) {
    logErrorMessage(err.toString());
    process.exit(1);
  }
})();
