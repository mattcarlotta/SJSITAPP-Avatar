import { createConnection } from "~database";
import { Types } from "mongoose";

jest.mock("fs-extra");

expect.extend({
  toBeNullOrType: (received, type) => ({
    message: () => `expected ${received} to be null or ${type}`,
    pass: received === null || typeof received === type,
  }),
});

const mockRequest = (user, session, body, query, params, file, err) => ({
  user,
  session,
  body,
  query,
  params,
  file,
  err,
});

const mockResponse = () => {
  const res = {};
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export { mockRequest, mockResponse };

global.ObjectId = Types.ObjectId;
global.createConnection = createConnection;
global.mockRequest = mockRequest;
global.mockResponse = mockResponse;
