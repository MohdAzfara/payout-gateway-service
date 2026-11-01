/**
 * Enterprise Jest Test & Coverage Configuration — Payout Gateway Service
 * Enforces deterministic verification across balance reservation, multi-rail routing,
 * asynchronous worker backoff, and three-way settlement reconciliation modules.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  displayName: 'payout-gateway-service',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)'
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true
      }
    ]
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/errors/**/*.ts',
    'src/guards/**/*.ts',
    'src/reconciliation/**/*.ts',
    'src/routing/**/*.ts',
    'src/security/**/*.ts',
    'src/telemetry/**/*.ts',
    'src/workers/**/*.ts',
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  verbose: true,
  testTimeout: 10000
};
