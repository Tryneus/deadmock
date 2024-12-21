const config = {
  preset: 'jest-preset-preact',
  testEnvironment: 'jsdom',
  moduleNameMapper: {'^/(.*)': '<rootDir>/$1'},
};

export default config;
