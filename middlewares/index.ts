import express from "express";
import session from "cookie-session";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import moment from "moment-timezone";
import type { Express } from "express";

const { COOKIEKEY, inTesting, CLIENT, NODE_ENV } = process.env;

const inProduction = NODE_ENV === "production";

const logging = inProduction
  ? ":remote-addr [:date] :referrer :method :url HTTP/:http-version :status :res[content-length]"
  : "tiny";

//= ===========================================================//
/* APP MIDDLEWARE */
//= ===========================================================//
const middlewares = (app: Express): void => {
  morgan.token("date", () => moment().format("MMMM Do YYYY, h:mm:ss a"));

  app.set("json spaces", 2); // sets JSON spaces for clarity
  if (inProduction) app.set("trust proxy", 1);

  if (!inTesting) app.use(morgan(logging));

  app.use(
    session({
      path: "/",
      keys: [COOKIEKEY as string],
      name: "SJSITApp",
      maxAge: 2592000000,
      httpOnly: true,
      secure: inProduction,
      sameSite: inProduction
    })
  );

  app.use("/assets/*", (_req, _res, next) => next(), cors());
  app.use("/images/*", (_req, _res, next) => next(), cors());
  app.use("/uploads/*", (_req, _res, next) => next(), cors({ origin: CLIENT }));
  app.use(
    "/api/avatar/*",
    (_req, _res, next) => next(),
    cors({ credentials: true, origin: CLIENT })
  );

  app.use(
    multer({
      limits: {
        fileSize: 10240000,
        files: 1,
        fields: 1
      },
      fileFilter: (req, file, next) => {
        if (!/\.(jpe?g|png)$/i.test(file.originalname)) {
          req.err = "That file extension is not accepted!";
          next(null, false);
        }
        next(null, true);
      }
    }).single("file")
  );

  app.use(express.json()); // parses header requests (req.body)
};

export default middlewares;
