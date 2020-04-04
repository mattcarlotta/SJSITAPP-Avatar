import mkdir from "mkdirp";
import sharp from "sharp";
import { createRandomString, sendError } from "~utils/helpers";
import { unableToProcessFile } from "~utils/errors";

const { API } = process.env;
const currentDirectory = process.cwd();

export default async (req, res, next) => {
  try {
    if (req.err || !req.file) throw String(req.error || unableToProcessFile);

    const {
      file: { buffer, originalname },
    } = req;

    const filename = `${Date.now()}-${createRandomString()}-${originalname}`;
    const filepath = `uploads/${filename}`;

    await new Promise((resolve, reject) =>
      mkdir(`${currentDirectory}/uploads`, (err) => {
        !err ? resolve() : reject(err);
      })
    );

    await sharp(buffer)
      .resize({
        width: 256,
        height: 256,
        fit: "cover",
        withoutEnlargement: true,
      })
      .toFile(filepath);

    req.file.avatar = `${API}/${filepath}`;
    req.file.avatarPath = filepath;

    next();
  } catch (err) {
    return sendError(err, 400, res);
  }
};
