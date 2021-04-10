import type { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import mongoose from "mongoose";
import { connectToDB } from "~database";
import User from "~models";
import app from "~utils/tesetServer";
import { unableToLocateUser } from "~helpers/errors";

jest.mock("~strategies", () => jest.fn((_req, _res, next) => next()));

jest.mock("multer", () => () => ({
  single: () => (req: Request, _: Response, next: NextFunction): void => {
    req.file = {
      destination: "somewhere",
      encoding: "utf8",
      originalname: "sample.name",
      filename: "somewhere",
      fieldname: "file",
      mimetype: "sample.type",
      path: "sample.url",
      buffer: Buffer.from("whatever"),
      size: 123,
      stream: new Readable({})
    };

    return next();
  }
}));

describe("Routing", () => {
  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("rejects requests to delete a member's avatar when id is invalid", async done => {
    app()
      .delete(`/api/avatar/delete/5ea8496ce6e9625101b952d5`)
      .expect("Content-Type", /json/)
      .expect(400)
      .then(res => {
        expect(res.body.err).toEqual(unableToLocateUser);
        done();
      });
  });

  it("accepts requests to delete a member's avatar", async done => {
    const existingMember = await User.findOne({
      email: "signinmember@test.com"
    });

    app()
      .delete(`/api/avatar/delete/${existingMember._id}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        expect(res.body.message).toEqual(
          "Successfully removed your current avatar."
        );
        done();
      });
  });

  it("rejects requests to update a member's avatar when id is invalid", done => {
    app()
      .put(`/api/avatar/update/123`)
      .expect("Content-Type", /json/)
      .expect(400)
      .then(res => {
        expect(res.body.err).toEqual(unableToLocateUser);
        done();
      });
  });

  it("rejects requests to update a member's avatar when id is invalid", async done => {
    const existingMember = await User.findOne({
      email: "signinmember@test.com"
    });

    app()
      .put(`/api/avatar/update/${existingMember._id}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          message: "Successfully updated your current avatar.",
          avatar: expect.any(String)
        });
        done();
      });
  });
});
