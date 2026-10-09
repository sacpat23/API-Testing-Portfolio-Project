# Booking API Playwright Automation

This project is a Playwright API automation suite for validating a sample booking API flow. It uses a local mock server so the tests are completely self-contained and can run reliably in CI or on a fresh machine without external API dependencies.

## Features

- API tests for booking creation, retrieval, update, and deletion
- Authentication checks for no-auth, basic auth, and token-based flows
- Schema validation using Ajv
- Local mock server for deterministic test execution
- GitHub-ready setup with Playwright config and CI workflow

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Run tests

```bash
npm test
```

## Optional commands

```bash
npm run test:headed
npm run test:report
npm run test:mock
```

## Environment setup

Copy the example environment file and adjust values if needed:

```bash
cp .env.example .env
```

The project reads values from `.env` automatically when present.

## Project structure

```text
.
├── .env.example
├── .github/
│   └── workflows/
│       └── playwright.yml
├── mock-server.js
├── playwright.config.ts
├── testData/
├── tests/
├── package.json
└── README.md
```

## Notes for interviews

This project demonstrates:

- API test design and automation
- realistic assertions and validation logic
- fixture-driven test data
- test isolation and reproducibility
- CI-friendly project structure

## Recommended usage of auth, env, and fixtures

- Use `.env` for environment-specific values like URLs and credentials.
- Use fixtures in `testData/` for reusable JSON payloads and schemas.
- Use a dedicated auth setup file only when many tests share the same authenticated session or token. For a small API suite, keeping auth logic in the relevant test is usually simpler and clearer.
