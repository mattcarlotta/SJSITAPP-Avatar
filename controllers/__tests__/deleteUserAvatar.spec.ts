import fs from "fs-extra";
import type { Response } from "express";
import mongoose from "mongoose";
import { connectToDB } from "~database";
import { deleteUserAvatar } from "~controllers";
import { unableToLocateUser } from "~helpers/errors";
import User from "~models";
import { mockResponse, mockRequest } from "~utils/mockExpress";

describe("Delete Avatar", () => {
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
    await deleteUserAvatar(
      mockRequest(undefined, undefined, undefined, { id: "" }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser
    });
  });

  it("handles invalid user delete avatar requests", async () => {
    await deleteUserAvatar(
      mockRequest(undefined, undefined, undefined, {
        id: "5ea8496ce6e9625101b952d5"
      }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser
    });
  });

  it("handles empty delete avatar requests", async () => {
    const existingUser = await User.findOne({
      email: "real.member@test.com"
    });

    await deleteUserAvatar(
      mockRequest(undefined, undefined, undefined, {
        id: existingUser._id
      }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully removed your current avatar."
    });
  });

  it("handles delete avatar requests", async () => {
    const existingUser = await User.findOne({
      email: "scheduledmember@test.com"
    });

    await deleteUserAvatar(
      mockRequest(undefined, undefined, undefined, { id: existingUser._id }),
      res
    );

    const updatedUser = await User.findOne({
      email: "scheduledmember@test.com"
    });

    expect(fs.remove).toHaveBeenCalledWith(`uploads/${existingUser.avatar}`);
    expect(updatedUser.avatar).toEqual("");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully removed your current avatar."
    });
  });
});
