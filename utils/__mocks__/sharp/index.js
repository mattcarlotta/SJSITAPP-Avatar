const result = {
  resize: jest.fn().mockReturnThis(),
  toFile: jest.fn().mockReturnThis(),
};

module.exports = jest.fn(() => result);
