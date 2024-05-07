import "dotenv/config";

import express from "express";
import path from "path";
import colors from "picocolors";
import mongoose from "mongoose";

// Model import(s)
import Users from "../models/users";

// Passport imports
import passport, { AuthenticateOptions } from "passport";
import DiscordStrategy from "passport-discord";

// Extra stuff we'll need
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import ConnectMongo from "connect-mongo";

// Other route imports
import AuthRoute from "./routes/auth";
//import DashboardRoute from "./routes/dashboard";
//import GuidesRoute from "./routes/guides";
import LinksRoute from "./routes/links";
import ProfileRoute from "./routes/profile";

// import md from "markdown-it";
// import fs from "fs";
import axios from "axios";

if (!process.env.CLIENT_SECRET) {
    throw new Error(
        "CLIENT_SECRET is not set, it is required for the site to work.",
    );
}

enum BotStages {
    PreAlpha = "Pre-Alpha",
    Alpha = "Alpha",
    PreBeta = "Pre-Beta",
    Beta = "Beta",
    PreRelease = "Pre-Release",
    FullRelease = "Release",
}

const app = express();
const port = 6969; // Feel free to replace this port with whatever you prefer.
export const clientId = "1195600287646355526";
export const currentBotStage = BotStages.PreAlpha;

// Connecting to MongoDB so we can work with our models
mongoose
    .connect(process.env.DATABASE_URL!)
    .then(() => {
        console.log(
            colors.green(
                "Connected to MongoDB with the database " +
                    mongoose.connection.db.databaseName,
            ),
        );
    })
    .catch((err) => {
        console.error(colors.red(`Failed to connect to MongoDB: ${err}`));
        process.exit(1);
    });

// Inserting our plugins including body-parser, and cookie-parser so we can use it.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store: ConnectMongo.create({
            mongoUrl: process.env.MONGO_URI!,
            ttl: 86400 * 2, // 2 days
        }),
    }),
);

// Setting up passport
app.use(passport.session());
passport.use(
    new DiscordStrategy.Strategy(
        {
            clientID: clientId,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL:
                process.env.NODE_ENV === "production"
                    ? "https://caniventure.vercel.app/auth/discord/callback"
                    : "http://localhost:6969/auth/discord/callback",
            scope: ["identify", "guilds"],
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        },
    ),
);
passport.use(
    "discordBotAuth",
    new DiscordStrategy.Strategy(
        {
            clientID: clientId,
            callbackURL:
                process.env.NODE_ENV === "production"
                    ? "https://caniventure.vercel.app/auth/discordBot/callback"
                    : "http://localhost:6969/auth/discordBot/callback",
            scope: ["bot", "applications.commands"],
            clientSecret: process.env.CLIENT_SECRET,
        },
        async (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        },
    ),
);
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser(async (user: any, done) => {
    try {
        let userDB = await Users.findOne({ id: user.id });

        if (!userDB) {
            userDB = new Users({
                id: user.id,
            });
            userDB.save();
        }

        user.dataFromDB = userDB;

        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Setting up ejs, our views directory and static files.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "ui"));
app.use(express.static(path.join(__dirname, "..", "static")));

// Insert our external routes
app.use("/auth", AuthRoute);
// app.use("/dashboard", DashboardRoute); // To be made in Pre-Beta.
// app.use("/guides", GuidesRoute); // To come in Alpha or later, no later than Beta though.
app.use("/links", LinksRoute);
app.use("/profile", ProfileRoute);

// Setting up routes
app.get("/", (req, res) => {
    res.status(200).render("index", {
        user: req.user,
    });
});

/*app.get("/about", async (req, res) => {
    const markdownFile = fs.readFileSync(
        path.join(__dirname, "..", "static", "lore-starting-point.md"),
        {
            encoding: "utf-8",
        },
    );
    const rendered = md().render(markdownFile);

    res.status(200).render("about", {
        user: req.user,
        loreStartingPoint: rendered,
        botStage: currentBotStage,
    });
});*/

app.get("/getting-started", async (req, res) => {
    const guildId = req.query.guild_id;

    if (!guildId) {
        return res.status(400).send("Missing guild_id in query.");
    }

    const guildRequest = await axios
        .get(`https://discord.com/api/guilds/${guildId}`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            },
        })
        .catch(() => {
            res.status(500).send("Failed to get guild from Discord.");
            return null;
        });

    if (!guildRequest) return;

    res.status(200).render("gettingstarted", {
        user: req.user,
        guild: guildRequest.data,
        botStage: currentBotStage,
    });
});

// 404 route (leave this for last)
app.all("*", (req, res) => {
    res.status(404).render("404", {
        path: req.path,
        user: req.user,
    });
});

// Start the server
app.listen(port, () => {
    console.log(colors.green(`Server ready at http://localhost:${port}`));
});
