/* eslint-disable no-console */
import express from "express";
import chalk from "chalk";
import { version } from "../package.json";

const { API, PORT } = process.env;

export default (app) => {
  app.use("/uploads", express.static("uploads"));
  app.use("/images", express.static("images"));

  app.listen(PORT, () => {
    console.log(
      `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
        `Avatar microservice is up and running at ${API} (v.${version})`
      )}\n`
    );
  });
};
/* eslint-enable no-console */
