const aliasDirs = require("alias-dirs");
const { ignoreDirectories } = aliasDirs;

module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          },
        },
      ],
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: aliasDirs({
            paths: ["."],
            ignoreDirectories: ignoreDirectories.filter((f) => f !== "env"),
          }),
        },
      ],
    ],
  };
};
