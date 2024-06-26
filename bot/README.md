# Caniventure

The Caniballistic Discord Bot.

Please, feel free to view the trailer for the bot.

**REPLACE THIS BOLD TEXT WITH AN IFRAME WHEN TRAILER IS ON YOUTUBE.**

## Inviting

You can invite Caniventure to your Discord server **[here](https://discord.com/oauth2/authorize?client_id=1195600287646355526&permissions=414531836992&scope=bot+applications.commands)**.

## Running Locally

It is recommended to just invite the bot, but if you want to run it locally, you can do that too.

### Prerequisites

To be able to run the bot locally, you need to have the following:

-   [Bun](https://bun.sh)
-   A MongoDB database
-   An application on the **[Discord Developer Portal](https://discord.com/developers/applications)**
-   Git version 2.37.0 or higher

### Clone the repository

Run `cd` to head to anywhere you want to clone the repository.

Then run this in your terminal:

```bash
git clone https://github.com/Caniventure-Development/Caniventure.git
```

### Install dependencies

First, `cd` into the Caniventure bot directory.

```bash
cd Caniventure/bot
```

Now, run `bun install` to install the dependencies.

```bash
bun install
```

This may take a bit, so just wait until its done then continue on.

### Set up Prisma

Create a new file called `.env` and copy and paste the content from the `.env.example` file.

**OR**, to save time, use the terminal to copy the content from `.env.example` to `.env`. Examples are provided below.

#### Unix-based systems (like macOS or Linux)

```bash
cp .env.example .env
```

#### PowerShell

```powershell
Copy-Item .env.example -Destination .env
```

Then update the value of `DATABASE_URL` in the `.env` file with the connection string to your MongoDB instance.

Now, generate the Prisma Client.

```bash
pnpm prisma generate
```

### Start the bot

Now, open the `.env` again and update the value of `BOT_TOKEN` with your bot token.

If you plan to use a dev bot, update the value of `DEV_BOT_TOKEN` as well.

If you don't, open `src/index.ts` and comment out `client.login(process.env.DEV_BOT_TOKEN)` and uncomment `client.login(process.env.BOT_TOKEN)`.

Now run this:

```bash
bun run src/index.ts
```

### You're done!

The bot should be online and ready to go pretty soon after you run `bun run src/index.ts`! Have fun using Caniventure!
