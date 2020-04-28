import { requireAuth } from "~strategies";
import { badCredentials, invalidSession } from "~utils/errors";
import User from "~models/user";

const next = jest.fn();

describe("Require Authentication Middleware", () => {
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

  it("handles missing login sessions", async (done) => {
    const req = mockRequest();

    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: badCredentials,
    });
    done();
  });

  it("handles deleted/non-existent member login sessions", async (done) => {
    const session = {
      user: {
        id: "5d5b5e952871780ef474807d",
      },
    };

    const req = mockRequest(null, session);

    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: badCredentials,
    });
    done();
  });

  it("handles suspended login sessions", async (done) => {
    const existingUser = await User.findOne({
      email: "jamie.doe@example.com",
    });

    const session = {
      user: {
        id: existingUser._id,
      },
    };

    const req = mockRequest(null, session);

    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      err: invalidSession,
    });
    done();
  });

  it("handles valid login sessions", async (done) => {
    const existingUser = await User.findOne({
      email: "bob.dole@example.com",
    });
    const session = {
      user: {
        id: existingUser._id,
      },
    };

    const req = mockRequest(null, session);

    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    done();
  });
});
