const tsconfigpaths = require("tsconfig-paths");

tsconfigpaths.register({
  baseUrl: "./build",
  paths: {
    "~controllers": ["controllers/index"],
    "~database/*": ["database/*"],
    "~database": ["database/index"],
    "~logger": ["logger/index"],
    "~middlewares": ["middlewares/index"],
    "~models": ["models/index"],
    "~routes/*": ["routes/*"],
    "~routes": ["routes/index"],
    "~strategies": ["strategies/index"],
    "~utils/*": ["utils/*"]
  }
});
