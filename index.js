
const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");

const Database = require("better-sqlite3");
const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const REQUIRED_ROLE_NAME = "Buyers Mobile <3";
const PORT = Number(process.env.PORT) || 10000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "keys.db");

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID.");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

db.exec(`
    CREATE TABLE IF NOT EXISTS available_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS redeemed_keys (
        key TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        redeemed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS database_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
`);

const keys = [
    "ba07siZe47NfMRBwZcQsnPeZ2V12",
    "dbn4GETInxdLclaVwkonnXkkgSyE",
    "OvdeUnImHlxtIGden7IOXmJubfAG",
    "iGNz1R3MXoYCRgAki96D9XgSG01y",
    "NceqjxldwimXPZdfJgO3qaqA8aYl",
    "6cqqQSiF6WgUG61VYXxRJdzfcLRt",
    "hrgEKSagjrk3La0gxf0GDWhV7bhW",
    "Nvxmk6UPlCduPdlbpNYzUc8bya5S",
    "Osyovw7EL1yKAZxOyVdAETIFhDkV",
    "uywCiRVV4YgpZgWK3kWxKvx5tvse",
    "vq3PY5SXtr7QBRs0jm5w3wuvCHmY",
    "3ZAUq8rWbaxpLmAm2CxDvrS30YOs",
    "cDXDfvaUM6fkpQR8PQFUyqmoshy4",
    "P42bXLYaOGdIYhTxTVQk5eMirOV3",
    "isv5fYAhxlZkbAPIdyotTXROPvaQ",
    "Hw0H8zSzbaL9D8ZAwHaATe4pN29S",
    "7wDGWVrq8qmUmXbd9FTxWFWWW2CK",
    "iQpD7ye85eNrObBNFFGOo15dNQVu",
    "Mo3A3qsSi7g0mxYvdlVwdgp6M6mT",
    "wKzoRF4qDZItPRDbXE3d0vVhltyC",
    "lO23S9XAZJsecJUlWYW4FNbqI57x",
    "SLH001SH6yLGBjZ6iUmemyIov6Zg",
    "HDCEAxLCdLZGZSxsxMwoxj5bn6Hy",
    "1PoKlmKPKOiGKlZ3QCxwLJQedmAk",
    "dKEZiS5wVbIieoTxxF9zD2jlh8fD",
    "W3cwCjGkbcMK82HUE9hIZMMJYr4w",
    "yPuJRfz6S3qwtyCalDN4GezL4hAD",
    "tvy0rfod0qQwZYg48Dg9Tr6VtaZL",
    "tSS3h6OTOYQ95QFPvKumkjp4WsJs",
    "OP3oHdEj5HmgLRkgAAdTvMMxY1Hy",
    "zQvChlkHWZBNb0sDysFUoZT3DT3K",
    "RjK4isnUJskUfyi3E4Ox6b1SOJcl",
    "zsVGM0SnOtJzfmaFWjUPTu8kqz4n",
    "ZsqS8e30eWSceiZqofgW0B9k1tYr",
    "t46KyBu8O6BVlBp9ER9Ir55OV7r0",
    "7bTuwhIyDztdZlLzlevPb8006sDP",
    "jrt0oQTWCUoaaFIvK0kWGSn6u8p3",
    "gv4igcYQPJFGwhLSCYJg9T9JF98z",
    "UA9eZFPimW0EkfjCq5boosPneTTy",
    "1E5LAiBEiXsyZ9s5TzmN0X9sQBgP",
    "yRDQIrbyEAXPldoGidboBCphLnxe",
    "DFWowGZXDBRHs5RTaUL3eROmCMyW",
    "J0T63XDusrCWy5Fe88ROULCN537D",
    "76i7uHtUVakt3LVB3H1xLAxEuF3h",
    "asFwSMkOUyi2FPZnV2ZrhXGjN4WJ",
    "7cM19radEJAY23MRQuuXEgMG2lFI",
    "lPWdeN2LHLUD1q8fQAvB5XIU1RL1",
    "DL7O8FlNQoyQ6CvXWlUjgIJmX6uq",
    "gThUYnG97lgsllnZ5zXMeDJ3JvM9",
    "ExFvQEYYfdn4y35usK5ladx8humE",
    "0w0CZfXzRqtZSYAH4lji3PBDzEMJ",
    "0K1pQKkEvFbWkGTns5CQW5QKRpiH",
    "PV12RzG1TJW2OyI2o5qMlknoWJmp",
    "4m98TskZHlbxlsdaxKLhS2lWq93f",
    "taXnvPOkZ2KVRluoQuqubTMuhqQm",
    "bp2sZHQWEzdqBaTnGdlsKnsO8Fwy",
    "mi3frxlI3mM7wWYcpQ41YO2NLBTb",
    "pKVaCB2rBoSkvG1mW8IvwjeBp0Y6",
    "ucC6vR8qukKYtc2CG3nOxeiHeBdi",
    "XPtTYLT457aXJSRAhwPRHjj2vrnL",
    "jhRhngn0TkZwb6wMATtGwrXnOZ7Q",
    "FWIWq96D8ddcO1cX3ngWk9gT8r5Z",
    "wl3v1mZJyrBCzYjTLxEu38qNTkS9",
    "9856Mv7fT4TffoQz4llVUxLnXrnN",
    "PYUuVxChFUuwTrM6CQ75rAfM31h4",
    "HCHGVKrSNpd8ttk7AZFcZw64UyVn",
    "9dUah6tV3yVhlWoqC8L88Z1OnS3A",
    "SCkf3eslPle2SRoueO22PvqjlVu7",
    "Vb492dFAe4RfRwXbLaBA2QGN06Vm",
    "dOgETKXN5mJPlxuw87fhfirqwFpH",
    "lUPt81z9lYqxl64lqgP6ExWpNg2U",
    "7PuRM3gIpAqe7Xfju2vGnjOamWsP",
    "yvYzFyHoT2CgZ189FGO1gLxHwgoV",
    "Y3Ak7TsfEfWqxfbrj6nf7SqymUa7",
    "zqcMf9cnzU6MYRyaFSYgbxbTWtjM",
    "M2wtEWui6Kr6l1NxyStXwuOjUIj2",
    "3ALOYBR78NOg7Rj7wH5nbGFmi3fw",
    "YNsfvdiD7yJ3w0GMSHdv0ciWKzdY",
    "MUUq55SqIpwrXpZykMjbHlWxnQMT",
    "thrx1NJ3fw8V0ab03et0dAwqW5OM",
    "7QqK6hOIsuYKeg4fqCY11GAaIWfa",
    "rBWlqE1aqt3jKX2bb3rqbODvuuiJ",
    "QsqeRgNAzNYebBq5k8FnFQxvDLqk",
    "qw2wSs5j2kR6XqgE0vCzM6B3nQcS",
    "Oaucn6YB6nsOW7HN964qX0zrHZHd",
    "YGWKp9KX5Kdg5ckaf1TTgoHWxTa6",
    "jxnMCOmBHsvNVgfLNuWTDEV1ZtLd",
    "PWP82xLTA6t2EgWbnpHT3M5Jc6A6",
    "kT4lJALdrXhNmDwLu4EmdxGUhbF1",
    "ZYtk9yr13MzVfcBwLy1pmKtuHo62",
    "GHWdG7kkRkBMBVx0f4bx2uRYFsP4",
    "cP68F1yb0Jr62hjEPFjt1DDFSABD",
    "J9VmQfDLtM5Ui1ro6Pqqojg0Fzea",
    "NZptHHuU3ZfPuddC0ScS7ceNpKUo",
    "8o8qe6iFN2POpStxdPonI49k2ZAh",
    "uaJbbPAQzPBhbTrmUlvqap59LbYp",
    "pZjjF5y2rDFa7xUqrEvNwy03hjor",
    "9AtcLBOeCkBhrk3H4SW3SC8kZorO",
    "mTbPRsHDNjVbMNNhIW1jvgzxSBaY"
];

const seeded = db.prepare(
    "SELECT value FROM database_settings WHERE key = 'seeded'"
);

if (!seeded.get()) {
    db.transaction(() => {
        const insert = db.prepare(
            "INSERT OR IGNORE INTO available_keys (key) VALUES (?)"
        );

        for (const key of keys) {
            insert.run(key);
        }

        db.prepare(
            "INSERT INTO database_settings (key, value) VALUES ('seeded', '1')"
        ).run();
    })();
}

// Remove this key from existing databases as well.
db.prepare(
    "DELETE FROM available_keys WHERE key = ?"
).run("klGYB3bLSk0DKIvPOBnuIxlatbrN");

// ---------------- WEB SERVER ----------------

const app = express();

app.get("/", (_req, res) => {
    res.status(200).send("🎃 vivians is running 🦇");
});

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        bot: "vivians",
        discord: client.isReady()
    });
});

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[WEB] Listening on port ${PORT}`);
});

// ---------------- KEEP ALIVE ----------------

const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000;

function startKeepAlive() {
    const baseUrl = (
        process.env.RENDER_EXTERNAL_URL ||
        `http://localhost:${PORT}`
    ).replace(/\/+$/, "");

    const healthUrl = `${baseUrl}/health`;
    const mod = healthUrl.startsWith("https://") ? https : http;

    setInterval(() => {
        const req = mod.get(healthUrl, { timeout: 5000 }, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const json = JSON.parse(data);

                    if (res.statusCode === 200 && json.status === "ok") {
                        console.log(
                            "[KEEP-ALIVE] Ping successful — " +
                            new Date().toLocaleTimeString()
                        );
                    } else {
                        console.log(
                            "[KEEP-ALIVE] Unexpected response:",
                            res.statusCode
                        );
                    }
                } catch {
                    console.log("[KEEP-ALIVE] Invalid health response.");
                }
            });
        });

        req.on("timeout", () => {
            req.destroy(new Error("keep-alive timeout"));
        });

        req.on("error", (err) => {
            console.log("[KEEP-ALIVE] Ping failed: " + err.message);
        });
    }, KEEP_ALIVE_INTERVAL);
}

startKeepAlive();

// ---------------- DISCORD BOT ----------------

const generateKeyCommand = new SlashCommandBuilder()
    .setName("generatekey")
    .setDescription("Get one unused Mobile key.");

const selectKey = db.prepare(
    "SELECT key FROM available_keys ORDER BY id LIMIT 1"
);

const deleteKey = db.prepare(
    "DELETE FROM available_keys WHERE key = ?"
);

const saveRedeemed = db.prepare(`
    INSERT INTO redeemed_keys (key, user_id, redeemed_at)
    VALUES (?, ?, ?)
`);

const claimKey = db.transaction((userId) => {
    const entry = selectKey.get();

    if (!entry) return null;

    const result = deleteKey.run(entry.key);

    if (result.changes !== 1) return null;

    saveRedeemed.run(
        entry.key,
        userId,
        new Date().toISOString()
    );

    return entry.key;
});

const restoreKey = db.prepare(
    "INSERT OR IGNORE INTO available_keys (key) VALUES (?)"
);

async function registerCommands() {
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: [generateKeyCommand.toJSON()] }
    );

    console.log("[DISCORD] /generatekey registered.");
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "generatekey") return;

    await interaction.deferReply({ ephemeral: true });

    try {
        if (!interaction.inGuild()) {
            return interaction.editReply(
                "Use this command in the server."
            );
        }

        const member = await interaction.guild.members.fetch(
            interaction.user.id
        );

        const hasRole = member.roles.cache.some(
            role => role.name === REQUIRED_ROLE_NAME
        );

        if (!hasRole) {
            return interaction.editReply(
                `You need the **${REQUIRED_ROLE_NAME}** role to use this command.`
            );
        }

        const key = claimKey(interaction.user.id);

        if (!key) {
            return interaction.editReply("No unused keys are left.");
        }

        try {
            await interaction.user.send(
                "🎃 **Vivian's Mobile Key** 🦇\n\n" +
                `\`\`\`\n${key}\n\`\`\`\n` +
                "Keep your key private."
            );
        } catch (error) {
            // Return the key to stock if delivery fails.
            db.transaction(() => {
                db.prepare(
                    "DELETE FROM redeemed_keys WHERE key = ?"
                ).run(key);

                restoreKey.run(key);
            })();

            return interaction.editReply(
                "I couldn't DM you. Enable DMs from server members and try again."
            );
        }

        await interaction.editReply(
            "Check your DMs! Your key was sent privately."
        );

        console.log(
            `[KEY] Sent a key to ${interaction.user.tag} (${interaction.user.id}).`
        );
    } catch (error) {
        console.error("[KEY ERROR]", error);

        await interaction.editReply(
            "Something went wrong while generating your key."
        ).catch(() => {});
    }
});

client.once("ready", () => {
    const remaining = db.prepare(
        "SELECT COUNT(*) AS count FROM available_keys"
    ).get().count;

    console.log(`[DISCORD] Logged in as ${client.user.tag}`);
    console.log(`[KEYS] ${remaining} unused keys remaining.`);
});

async function start() {
    try {
        await registerCommands();
        await client.login(TOKEN);
    } catch (error) {
        console.error("[STARTUP ERROR]", error);
        process.exit(1);
    }
}

async function shutdown() {
    console.log("[SHUTDOWN] Closing services.");

    clearInterval(keepAliveTimer);
    server.close();

    if (client.isReady()) {
        client.destroy();
    }

    db.close();
    process.exit(0);
}

// Store the timer so it can be stopped during shutdown.
const keepAliveTimer = setInterval(() => {}, 2147483647);

process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);

start();
