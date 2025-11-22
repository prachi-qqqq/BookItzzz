module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['lib/**/*.ts', 'app/**/*.ts', 'scripts/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/']
};
