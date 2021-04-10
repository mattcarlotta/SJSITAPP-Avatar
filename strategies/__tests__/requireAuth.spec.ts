import { Response } from "express";
import mongoose from "mongoose";
import { connectToDB } from "~database";
import User from "~models";
import requireAuth from "~strategies";
import {
  badCredentials,
  invalidSession,
  invalidPermissions
} from "~helpers/errors";
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

  afterEach(() => {
    next.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("rejects missing login sessions", async done => {
    await requireAuth(mockRequest(), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: badCredentials
    });
    done();
  });

  it("rejects deleted/non-existent member login sessions", async done => {
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

  it("rejects suspended login sessions", async done => {
    const existingUser = await User.findOne({
      email: "suspended.employee@test.com"
    });

    const session = {
      user: {
        id: existingUser._id
      }
    };

    await requireAuth(mockRequest(session), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: invalidSession
    });
    done();
  });

  it("rejects requests where the params id doesn't match the session id", async done => {
    const existingUser = await User.findOne({
      email: "scheduledmember@test.com"
    });

    const session = {
      user: {
        id: existingUser._id
      }
    };

    await requireAuth(
      mockRequest(session, { id: "606f28d674c497962d03a144" }),
      res,
      next
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: invalidPermissions
    });
    done();
  });

  it("handles valid login sessions for members", async done => {
    const existingUser = await User.findOne({
      email: "scheduledmember@test.com"
    });

    const session = {
      user: {
        id: existingUser._id.toString()
      }
    };

    await requireAuth(
      mockRequest(session, { id: existingUser._id.toString() }),
      res,
      next
    );
    expect(next).toHaveBeenCalledTimes(1);
    done();
  });

  it("handles valid login sessions for staff", async done => {
    const staffMember = await User.findOne({
      email: "staffmember@test.com"
    });
    const otherMember = await User.findOne({
      email: "scheduledmember@test.com"
    });

    const session = {
      user: {
        id: staffMember._id.toString()
      }
    };

    await requireAuth(
      mockRequest(session, { id: otherMember._id.toString() }),
      res,
      next
    );
    expect(next).toHaveBeenCalledTimes(1);
    done();
  });
});
