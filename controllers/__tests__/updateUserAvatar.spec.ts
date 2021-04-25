import type { Response } from "express";
import fs from "fs-extra";
import sharp from "sharp";
import mongoose from "mongoose";
import { connectToDB } from "~database";
import { updateUserAvatar } from "~controllers";
import { unableToLocateUser, unableToProcessFile } from "~helpers/errors";
import User from "~models";
import { mockResponse, mockRequest } from "~utils/mockExpress";

jest.mock("fs-extra");

const originalname = "3.png";
const buffer = [104, 101, 108, 108, 111, 32, 98, 117, 102, 102, 101, 114];

describe("Update Avatar", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  let res: Response;
  beforeEach(() => {
    res = mockResponse();
  });

  afterEach(() => {
    // @ts-ignore
    (sharp as jest.Mock).mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles empty params requests", async () => {
    await updateUserAvatar(mockRequest(undefined, { id: "" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser
    });
  });

  it("handles missing member id delete update requests", async () => {
    await updateUserAvatar(
      mockRequest(
        undefined,
        {
          id: ""
        },
        { originalname, buffer }
      ),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser
    });
  });

  it("handles invalid member id delete update requests", async () => {
    await updateUserAvatar(
      mockRequest(
        undefined,
        {
          id: "5ea8496ce6e9625101b952d5"
        },
        { originalname, buffer }
      ),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToLocateUser
    });
  });

  it("handles requests that fail file check middleware", async () => {
    await updateUserAvatar(
      mockRequest(
        undefined,
        { id: "5ea8496ce6e9625101b952d5" },
        { originalname, buffer },
        "That file extension is not accepted!"
      ),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: "That file extension is not accepted!"
    });
  });

  it("handles requests empty file update avatar", async () => {
    await updateUserAvatar(
      mockRequest(undefined, { id: "5ea8496ce6e9625101b952d5" }, undefined),
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      err: unableToProcessFile
    });
  });

  it("handles requests where members that don't have an avatar and are trying to add one", async () => {
    const existingUser = await User.findOne({ email: "emptyavatar@test.com" });

    await updateUserAvatar(
      mockRequest(
        undefined,
        { id: existingUser._id },
        { originalname, buffer }
      ),
      res
    );

    const updatedUser = await User.findOne({ email: "emptyavatar@test.com" });

    expect(fs.ensureDir).toHaveBeenCalledWith("uploads");
    expect(sharp).toHaveBeenCalledWith(buffer);
    expect(updatedUser.avatar).toBeDefined();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully updated your current avatar.",
      avatar: expect.any(String)
    });
  });

  it("handles requests where members that already have an avatar and are trying to update it", async () => {
    const existingUser = await User.findOne({ email: "hasavatar@test.com" });
    const currentAvatar = "2.png";

    expect(existingUser.avatar).toEqual(currentAvatar);

    await updateUserAvatar(
      mockRequest(
        undefined,
        { id: existingUser._id },
        { originalname, buffer }
      ),
      res
    );

    const updatedUser = await User.findOne({ email: "hasavatar@test.com" });

    expect(fs.ensureDir).toHaveBeenCalledWith("uploads");
    expect(fs.remove).toHaveBeenCalledWith(`uploads/${existingUser.avatar}`);
    expect(updatedUser.avatar).not.toEqual(currentAvatar);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully updated your current avatar.",
      avatar: expect.any(String)
    });
  });
});
