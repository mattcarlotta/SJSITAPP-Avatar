import fs from "fs-extra";
import { deleteUserAvatar } from "~controllers/avatars";
import { unableToLocateUser } from "~utils/errors";
import User from "~models/user";

describe("Delete Avatar", () => {
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
    await deleteUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser,
    });
  });

  it("handles invalid user delete avatar requests", async () => {
    const req = mockRequest(null, null, null, null, {
      id: "5ea8496ce6e9625101b952d5",
    });
    await deleteUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser,
    });
  });

  it("handles empty delete avatar requests", async () => {
    const existingUser = await User.findOne({ email: "bob.dole@example.com" });

    const req = mockRequest(null, null, null, null, { id: existingUser._id });
    await deleteUserAvatar(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully removed your current avatar.",
    });
  });

  it("handles delete avatar requests", async () => {
    const existingUser = await User.findOne({
      email: "annie.dole@example.com",
    });
    const req = mockRequest(null, null, null, null, { id: existingUser._id });

    await deleteUserAvatar(req, res);

    const updatedUser = await User.findOne({
      email: "annie.dole@example.com",
    });

    expect(fs.remove).toHaveBeenCalledWith(`uploads/${existingUser.avatar}`);
    expect(updatedUser.avatar).toEqual("");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully removed your current avatar.",
    });
  });
});
