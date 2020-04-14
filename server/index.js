/* eslint-disable no-console */
import express from "express";
import chalk from "chalk";

const { API, PORT } = process.env;

export default app => {
  app.use("/uploads", express.static("uploads"));
  app.use("/images", express.static("images"));

  app.listen(PORT, () => {
    console.log(
      `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" I ")} ${chalk.blue(
        `Avatar microservice is up and running at ${API}`
      )}`
    );
  });
};
/* eslint-enable no-console */
