import mkdir from "mkdirp";
import sharp from "sharp";
import { saveImage } from "~strategies";
import { unableToProcessFile } from "~utils/errors";

const next = jest.fn();

jest.mock("mkdirp", () => jest.fn());

describe("Save Image", () => {
  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("throws req.err if a file does not pass validation", async () => {
    const fileError = "Invalid format.";

    const req = mockRequest(null, null, null, null, null, null, fileError);
    await saveImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: fileError,
    });
  });

  it("throws an error if a file isn't present on req", async () => {
    const req = mockRequest(null, null, null, null, null, "");
    await saveImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToProcessFile,
    });
  });

  it("saves the image to disk", async () => {
    const pngfile = {
      originalname: "test.png",
      buffer: [104, 101, 108, 108, 111, 32, 98, 117, 102, 102, 101, 114],
    };

    const req = mockRequest(null, null, null, null, null, pngfile);
    await saveImage(req, res, next);

    expect(mkdir).toHaveBeenCalledTimes(1);
    expect(sharp).toHaveBeenCalledWith(pngfile.buffer);

    expect(req.file.avatar).toEqual(expect.any(String));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
