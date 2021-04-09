const sharp = jest.fn(() => ({
  resize: jest.fn().mockReturnThis(),
  toFile: jest.fn().mockReturnThis()
}));

export default sharp;
