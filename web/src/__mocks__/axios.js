export default {
  get: jest.fn(() => Promise.resolve({ data: {}, status: {} })),
  post: jest.fn(() => Promise.resolve({ data: {}, status: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {}, status: {} }))
};
