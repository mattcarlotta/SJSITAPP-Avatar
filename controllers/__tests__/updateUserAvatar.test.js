import fs from "fs-extra";
import { updateUserAvatar } from "~controllers/avatars";
import { unableToLocateUser, unableToLocateFile } from "~utils/errors";
import User from "~models/user";

const findUserExistingUser = (email) => User.findOne({ email });

describe("Update Avatar", () => {
  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  let db;
  beforeAll(async () => {
    db = await createConnection();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles empty params requests", async () => {
    const id = "";
    const req = mockRequest(null, null, null, null, { id });
    await updateUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser,
    });
  });

  it("handles empty update avatar requests", async () => {
    const id = "0123456789";
    const req = mockRequest(
      null,
      null,
      null,
      null,
      { id },
      { file: { avatar: "" } }
    );

    await updateUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateFile,
    });
  });

  it("handles invalid user delete update requests", async () => {
    const req = mockRequest(
      null,
      null,
      null,
      null,
      {
        id: "5ea8496ce6e9625101b952d5",
      },
      { avatar: "1234.png" }
    );
    await updateUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser,
    });
  });

  it("handles empty user avatar requests", async () => {
    const existingUser = await findUserExistingUser("jane.doe@example.com");

    const avatar = "3.png";

    const req = mockRequest(
      null,
      null,
      null,
      null,
      { id: existingUser._id },
      { avatar }
    );

    await updateUserAvatar(req, res);

    const updatedUser = await findUserExistingUser("jane.doe@example.com");

    expect(updatedUser.avatar).toEqual(avatar);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully updated your current avatar.",
      avatar,
    });
  });

  it("handles updating previous user avatar requests", async () => {
    const existingUser = await findUserExistingUser("chuck.doe@example.com");

    expect(existingUser.avatar).toEqual("2.png");

    const avatar = "4.png";

    const req = mockRequest(
      null,
      null,
      null,
      null,
      { id: existingUser._id },
      { avatar }
    );

    await updateUserAvatar(req, res);

    const updatedUser = await findUserExistingUser("chuck.doe@example.com");

    expect(fs.remove).toHaveBeenCalledWith(`uploads/${existingUser.avatar}`);
    expect(updatedUser.avatar).toEqual(avatar);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully updated your current avatar.",
      avatar,
    });
  });
});
