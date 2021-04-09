import type { Response } from "express";
// import fs from "fs-extra";
import mongoose from "mongoose";
import { connectToDB } from "~database";
import { updateUserAvatar } from "~controllers";
import { unableToLocateUser } from "~helpers/errors"; // unableToLocateFile
// import User from "~models";
import { mockResponse, mockRequest } from "~utils/mockExpress";

// const findUserExistingUser = email => User.findOne({ email });

describe("Update Avatar", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  let res: Response;
  beforeEach(() => {
    res = mockResponse();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles empty params requests", async () => {
    await updateUserAvatar(
      mockRequest(undefined, undefined, undefined, { id: "" }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser
    });
  });

  // it("handles empty update avatar requests", async () => {
  //   const id = "0123456789";
  //   const req = mockRequest(
  //     null,
  //     null,
  //     null,
  //     null,
  //     { id },
  //     { file: { avatar: "" } }
  //   );

  //   await updateUserAvatar(req, res);
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     err: unableToLocateFile,
  //   });
  // });

  // it("handles invalid user delete update requests", async () => {
  //   const req = mockRequest(
  //     null,
  //     null,
  //     null,
  //     null,
  //     {
  //       id: "5ea8496ce6e9625101b952d5",
  //     },
  //     { avatar: "1234.png" }
  //   );
  //   await updateUserAvatar(req, res);
  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({
  //     err: unableToLocateUser,
  //   });
  // });

  // it("handles empty user avatar requests", async () => {
  //   const existingUser = await findUserExistingUser("jane.doe@example.com");

  //   const avatar = "3.png";

  //   const req = mockRequest(
  //     null,
  //     null,
  //     null,
  //     null,
  //     { id: existingUser._id },
  //     { avatar }
  //   );

  //   await updateUserAvatar(req, res);

  //   const updatedUser = await findUserExistingUser("jane.doe@example.com");

  //   expect(updatedUser.avatar).toEqual(avatar);
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: "Successfully updated your current avatar.",
  //     avatar,
  //   });
  // });

  // it("handles updating previous user avatar requests", async () => {
  //   const existingUser = await findUserExistingUser("chuck.doe@example.com");

  //   expect(existingUser.avatar).toEqual("2.png");

  //   const avatar = "4.png";

  //   const req = mockRequest(
  //     null,
  //     null,
  //     null,
  //     null,
  //     { id: existingUser._id },
  //     { avatar }
  //   );

  //   await updateUserAvatar(req, res);

  //   const updatedUser = await findUserExistingUser("chuck.doe@example.com");

  //   expect(fs.remove).toHaveBeenCalledWith(`uploads/${existingUser.avatar}`);
  //   expect(updatedUser.avatar).toEqual(avatar);
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: "Successfully updated your current avatar.",
  //     avatar,
  //   });
  // });
});
