module.exports = {
  transform: {
    '^.+\\.jsx?$': require.resolve('babel-jest'),
    '^.+\\.ts?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 85,
    },
  },
};
