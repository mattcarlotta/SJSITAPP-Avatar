import type { Request, Response } from "express";

const mockRequest = (
  session?: Record<string, any>,
  body?: Record<string, any>,
  query?: Record<string, any>,
  params?: Record<string, any>,
  file?: Record<string, any>,
  err?: string
): Request => {
  const req: any = {};
  req.session = session;
  req.body = body;
  req.query = query;
  req.params = params;
  req.file = file;
  req.err = err;
  return req;
};

const mockResponse = (): Response => {
  const res: any = {};
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export { mockRequest, mockResponse };
