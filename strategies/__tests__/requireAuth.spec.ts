import { Response } from "express";
import mongoose from "mongoose";
import { connectToDB } from "~database";
import User from "~models";
import requireAuth from "~strategies";
import { badCredentials, invalidSession } from "~helpers/errors";
import { mockResponse, mockRequest } from "~utils/mockExpress";

const next = jest.fn();

describe("Require Authentication Middleware", () => {
  let res: Response;
  beforeEach(() => {
    res = mockResponse();
  });

  beforeAll(async () => {
    await connectToDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("handles missing login sessions", async done => {
    await requireAuth(mockRequest(), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: badCredentials
    });
    done();
  });

  it("handles deleted/non-existent member login sessions", async done => {
    const session = {
      user: {
        id: "5d5b5e952871780ef474807d"
      }
    };

    await requireAuth(mockRequest(session), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: badCredentials
    });
    done();
  });

  it("handles suspended login sessions", async done => {
    const existingUser = await User.findOne({
      email: "suspended.employee@example.com"
    });

    const session = {
      user: {
        id: existingUser!._id
      }
    };

    await requireAuth(mockRequest(session), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: invalidSession
    });
    done();
  });

  it("handles valid login sessions", async done => {
    const existingUser = await User.findOne({
      email: "scheduledmember@test.com"
    });

    const session = {
      user: {
        id: existingUser!._id
      }
    };

    await requireAuth(mockRequest(session), res, next);
    expect(next).toHaveBeenCalledTimes(1);
    done();
  });
});
