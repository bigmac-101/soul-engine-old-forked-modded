# BACKUP of OPENSOULS/SOULS-ENGINE-SDK 
# MODIFIED INITIALLY TO RUN IN PYTHON (ABANDONED)

# 🤖+👱 OPEN SOULS (Engine and Core Monorepo)

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/OpenSoulsPBC.svg?style=social&label=Follow%20%40OpenSoulsPBC)](https://twitter.com/OpenSoulsPBC) [![](https://dcbadge.vercel.app/api/server/FCPcCUbw3p?compact=true&style=flat)](https://discord.gg/opensouls)

## 🤔 What is this?

**OPEN SOULS** offers developers clean, simple, and extensible abstractions for directing the cognitive processes of large language models (LLMs), steamlining the creation of more effective and engaging AI souls.

This repo is the public, monorepo hosting our [open source core](./packages/core), our [command line tool](./packages/soul-engine-cli/), and code for interacting with the hosted [Soul Engine](https://docs.souls.chat).

## 💫 AI Souls

AI Souls are agentic and embodied digital beings, one day comprising thousands of mental processes (managed by the Soul Engine). Unlike traditional chatbots, this code will give digital souls personality, drive, ego, and will.

## 📖 Repo structure

- [`/packages/core`](./packages/core) contains the core, open source, library for creating AI souls.
- [`/packages/engine`](./packages/engine) contains the client side code for building and interacting with the [Soul Engine](https://docs.souls.chat)
- [`/packages/soul-engine-cli`](./packages/soul-engine-cli/) contains the command line interface (CLI) for creating and developing AI souls with the [Soul Engine](https://docs.souls.chat).

## 🚀 Getting started with documentation.

The easiest way to get started developing with `@opensouls/core` is to explore the [documentation](https://docs.souls.chat/core).

## 👏 Contributing

If this project is exciting to you, come hangout in the [OPEN SOULS Discord](https://discord.gg/opensouls) and build with us!

We have a [community repository](https://github.com/opensouls/community) where we share cognitive steps, mental processes, documentation, example projects, etc to help each other build compelling AI souls. This is a great place to start contributing.

## 🚢 Releasing

To release a new version, please follow these steps:

1. Ensure you have the necessary access permissions.
1. Run `git checkout -b bump/v0.1.XX` (where `XX` is the new version)
1. Push the new branch to the origin: `git push origin bump/v0.1.XX`
1. Run the bump script: `npm run bump`
1. Wait until GitHub Actions releases the package.
1. Don't forget to merge your bump branch to main
