module.exports = {
    setupFilesAfterEnv: ['./src/setupTests.js'],
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
    testPathIgnorePatterns: ["/node_modules/"],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
      "^.+\\.svg$": "<rootDir>/fileTransform.js", // Adicione esta linha
    },
    moduleFileExtensions: ["js", "json", "jsx", "node", "svg"], // Adicione "svg" aqui
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "\\.(css|less|scss)$": "identity-obj-proxy",
      '^axios$': require.resolve('axios'),
    },
    testEnvironment: "jsdom",
    
    reporters: [
      'default',
      [
          'jest-sonar',
          {
              outputDirectory: 'reports',
              outputName: 'sonar-report.xml'
          }
      ]
  ]
  };
  