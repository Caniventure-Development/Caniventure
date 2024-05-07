# How to contribute

Want to help out with Caniventure **AND** get a badge on your Caniventure profile for it?

Then let's go, follow this guide to get started.

## Prerequisites

This section depends on which part of the source code you want to contribute to, however all of them share some prerequisites.

All of these share the following:

- [Node.js](https://nodejs.org/en/) version 16.11.0 or higher
- [pnpm](https://pnpm.io/) version 8.13.1 or higher
- [Git](https://git-scm.com/) version 2.37.0 or higher
- A [MongoDB](https://www.mongodb.com) database
- A code editor, I personally use [Visual Studio Code](https://code.visualstudio.com/)
- _(optional)_ [GitHub Desktop](https://desktop.github.com/)

### For the bot

- An application on the [Discord Developer Portal](https://discord.com/developers/applications)

### For the main website

- Knowledge of express.js
- Knowledge of EJS

## If you don't have `pnpm` yet

Run this in your terminal:

```bash
npm install -g pnpm
```

## Clone the repository

First step _(as always 🙄)_ is to clone the repository.

```bash
git clone https://github.com/Caniventure-Development/Caniventure.git
```

## Install dependencies

Go to the folder you want to use to contribute to (for example, to contribute to the bot go to `{cloned repository path}/bot` (`{cloned repository path}` is the path you cloned the repository)).

```bash
cd {cloned repository path}/bot
```

Then run `pnpm install`.

```bash
pnpm install
```

## If contributing to the bot, you'll have to read this section

Copy the content of the `.env.example` file to the `.env` file.

### Unix-based systems (like macOS or Linux)

```bash
cp .env.example .env
```

### PowerShell

```powershell
Copy-Item .env.example -Destination .env
```

Now, update the value of `DATABASE_URL` in the `.env` file with the connection string to your MongoDB instance.

And update the value of `BOT_TOKEN` in the `.env` file with your bot's token.

If you don't set `DEV_BOT_TOKEN`, update the `index.ts` file like this:

```diff lang=ts
- export const TOKEN = process.env.DEV_BOT_TOKEN;
+ export const TOKEN = process.env.BOT_TOKEN;
```

## If contributing to the website, you'll have to read this section

All you'll have to do _(for now)_ is copy the content of the `.env.example` file to the `.env` file.

### Unix-based systems (like macOS or Linux)

```bash
cp .env.example .env
```

### PowerShell

```powershell
Copy-Item .env.example -Destination .env
```

Now, update the value of `DATABASE_URL` in the `.env` file with the connection string to your MongoDB instance also make sure to add `/{database name}` at the end _(replacing `{database name}` with the name of your database (for example: `mongodb://localhost:27017/my-database`)).

You'll also have to update the value of `CLIENT_SECRET` to your Discord's client secret, `SESSION_SECRET` with whatever gibberish you want, and `TOKEN` with your Discord bot's token (`TOKEN` is used for some HTTP requests that happen server-side).

And you're good to go!

## Start contributing

Now, you can start contributing to the project! Open the folder in your code editor and run wild!

## Open a pull request

After you're done updating the code, you can open a pull request!

Head [here](https://github.com/Caniventure-Development/Caniventure/pulls) to open a pull request.

## Thank you for contributing!

Thank you for contributing to Caniventure, you're awesome!

**Names will go here once we have some contributions.**
