import bodyParser from "body-parser";
import session from "cookie-session";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import moment from "moment-timezone";

const { cookieKey, CLIENT, NODE_ENV } = process.env;

const inProd = NODE_ENV === "production";

const logging = inProd
  ? ":remote-addr [:date] :referrer :method :url HTTP/:http-version :status :res[content-length]"
  : "tiny";

//= ===========================================================//
/* APP MIDDLEWARE */
//= ===========================================================//
export default (app) => {
  morgan.token("date", () => moment().format("MMMM Do YYYY, h:mm:ss a"));

  app.set("json spaces", 2); // sets JSON spaces for clarity

  if (inProd) app.set("trust proxy", 1);

  app.use(cors({ credentials: true, origin: CLIENT })); // allows receiving of cookies from front-end

  app.use(morgan(logging));

  app.use(
    multer({
      limits: {
        fileSize: 10240000,
        files: 1,
        fields: 1,
      },
      fileFilter: (req, file, next) => {
        if (!/\.(jpe?g|png)$/i.test(file.originalname)) {
          req.err = "That file extension is not accepted!";
          next(null, false);
        }
        next(null, true);
      },
    }).single("file")
  );

  app.use(bodyParser.json()); // parses header requests (req.body)

  app.use(
    session({
      path: "/",
      name: "SJSITApp",
      maxAge: 2592000000, // 30 * 24 * 60 * 60 * 1000 expire after 30 days
      keys: [cookieKey],
      httpOnly: true,
      secure: inProd,
      sameSite: inProd,
    })
  );
};
