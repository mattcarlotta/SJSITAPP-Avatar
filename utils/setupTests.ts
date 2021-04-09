jest.mock("fs-extra");

expect.extend({
  toBeNullOrType: (received, type) => ({
    message: () => `expected ${received} to be null or ${type}`,
    pass: received === null || typeof received === type
  })
});
