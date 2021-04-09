import chalk from "chalk";

const { log } = console;

export const logErrorMessage = (error: string): void => {
  log(
    `\n${chalk.rgb(255, 255, 255).bgRgb(255, 17, 0)(" ERROR ")} ${chalk.red(
      `${error}`
    )}\n`
  );
};

export const logInfoMessage = (message: string): void => {
  log(
    `\n${chalk.rgb(7, 54, 66).bgRgb(38, 139, 210)(" INFO ")} ${chalk.blue(
      `${message}`
    )}`
  );
};
