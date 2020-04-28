import mkdir from "mkdirp";
import sharp from "sharp";
import { sendError } from "~utils/helpers";
import { unableToProcessFile } from "~utils/errors";
import { v4 as uuid } from "uuid";

const currentDirectory = process.cwd();

export default async (req, res, next) => {
  try {
    if (req.err || !req.file) throw String(req.err || unableToProcessFile);

    const filename = `${uuid()}.png`;
    const filepath = `uploads/${filename}`;

    await mkdir(`${currentDirectory}/uploads`);

    await sharp(req.file.buffer)
      .resize({
        width: 256,
        height: 256,
        fit: "cover",
        withoutEnlargement: true,
      })
      .toFile(filepath);

    req.file.avatar = filename;

    next();
  } catch (err) {
    return sendError(err, 400, res);
  }
};
