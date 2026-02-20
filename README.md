# Generic Optimization Workflow (GOW) Development Blog

This repository contains the **Generic Optimization Workflow (GOW) Development Blog**, built with [Docusaurus](https://docusaurus.io/).

## Install dependencies

Using Yarn:

```bash
yarn install
```

Using npm:

```bash
npm install
```

For reproducible installs in CI/local validation, use:

```bash
npm ci
```

## Run locally

Using Yarn:

```bash
yarn start
```

Using npm:

```bash
npm run start
```

## Build

Using Yarn:

```bash
yarn build
```

Using npm:

```bash
npm run build
```

## Health check

Run a full verification pass (build + link/asset/tag consistency checks):

```bash
npm run check
```

## Deploy to GitHub Pages

Using Yarn:

```bash
yarn deploy
```

If needed, set `GIT_USER=<your-github-username>` before running the deploy command.
