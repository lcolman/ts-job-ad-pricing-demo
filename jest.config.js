module.exports = {
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/test/**/*.test.(ts|js)"
    ],
    collectCoverageFrom: [
        "**/src/**/*.(ts|js)"
    ],
    coveragePathIgnorePatterns: [
        ".example.(ts|js)"
    ],
    testEnvironment: "node"
};
