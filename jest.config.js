module.exports = {
  testEnvironment: "node",
  setupFiles: ["./tests/setup.js"],
  setupFilesAfterEnv: ["./tests/jest-after.js"],
  testMatch: ["**/tests/**/*.test.js"],
};
