module.exports = {
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$',
  collectCoverage: true,
  testEnvironment: 'node',
  coverageDirectory: 'coverage/',
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', './.cache/'],
  globals: {
    'ts-jest': {
      diagnostics: {
        pathRegex: '/.(spec|test).(ts|tsx)$/',
      },
    },
  },
  collectCoverageFrom: ['src/**/*.ts'],
};
