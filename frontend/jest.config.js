module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testPathIgnorePatterns: ["node_modules", ".cache", "public"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|webp|svg)$": `<rootDir>/__mocks__/file-mock.js`,
  },
  reporters: [
    "default",
    ["jest-junit", {
      outputDirectory: "unittest_reports",
      outputName: "junit.xml",
    }],
  ],
};
