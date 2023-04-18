import fs from "fs";
import path, { join } from "path";

import toml from "toml";

import express from "express";
import compression from "compression";
import serveStatic from "serve-static";

import { __dirname, isContainer } from "./config.js";

const Host = isContainer ? "node" : "localhost";

const __APP_OPTIONS__ = ({ p, h, hostname }) => {
    p = p || "http";
    h = h || `${Host}:4000`;

    return {
        hostUrl: hostname,
        baseUrl: `${p}://${h}`,
        baseApiUrl: `${p}://${h}/api`
    };
};

const root = process.cwd();
const isProd = process.env.NODE_ENV === "production";

const Config = toml.parse(
    fs.readFileSync(
        isContainer ? "../config/project.toml" : "project.toml",
        "utf8"
    )
);

function parseClientManifest(manifest) {
    const modules = [];
    const legacy = [];
    const links = [];

    Object.values(manifest)
        .filter((m) => m.isEntry)
        .forEach((m) => {
            const islegacy = m.file.includes("-legacy.");

            m.css?.forEach((c) => {
                links.push({
                    html: `<link rel="stylesheet" href="/${c}">`
                });
            });

            if (islegacy) {
                const html = `<script nomodule src="/${m.file}"></script>`;

                if (m.file.includes("polyfills")) {
                    legacy.unshift({ html });
                } else {
                    legacy.push({ html });
                }
            } else {
                modules.push({
                    html: `<script type="module" src="/${m.file}"></script>`
                });
            }
        });

    return {
        links,
        legacy,
        modules
    };
}
async function createServer() {
    const resolve = (p) => path.resolve(__dirname, p);

    const hostname = "";

    const hash = "bundled";

    const ssrManifest = isProd
        ? JSON.parse(fs.readFileSync(`./dist/${hash}/client/ssr-manifest.json`))
        : {};

    const manifest = isProd
        ? JSON.parse(fs.readFileSync(`./dist/${hash}/client/manifest.json`))
        : {};

    const app = express();

    app.enable("trust proxy");

    app.set("view engine", "ejs");
    app.set("views", "./templates");

    let vite, render;

    if (!isProd) {
        const { createServer: createViteServer } = await import("vite");

        vite = await createViteServer({
            root,
            logLevel: "error",
            server: {
                middlewareMode: "ssr",
                watch: {
                    usePolling: true,
                    interval: 100
                }
            }
        });
        app.use(vite.middlewares);

        render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
        render = (await import(`./dist/${hash}/server/entry-server.js`)).render;
        app.use(compression());
        app.use(
            serveStatic(resolve(`dist/${hash}/client`), {
                index: false
            })
        );
    }

    const MEDIA_DIR = Config.project.MEDIA_DIR;

    if (MEDIA_DIR) {
        app.use("/media", express.static(path.join(__dirname, MEDIA_DIR)));
    }

    app.get("/robots.txt", (req, res) => {
        res.sendFile(join(__dirname, "templates/robots.txt"));
    });

    app.use("*", async (req, res) => {
        try {
            const url = req.originalUrl;

            const ssrContext = await render(
                url,
                ssrManifest,
                __APP_OPTIONS__({ hostname: hostname })
            );

            if (ssrContext.route.name == "404") {
                res.status(404);
            }

            res.render("index", {
                lang: "ru",
                isProd,
                manifest: parseClientManifest(manifest),
                __APP_OPTIONS__: JSON.stringify(
                    __APP_OPTIONS__({
                        p: req.protocol,
                        h: req.get("host"),
                        hostname: hostname
                    })
                ),
                ...ssrContext.context
            });
        } catch (e) {
            vite && vite.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).render("500");
        }
    });

    return { app, vite };
}

createServer().then(({ app }) => {
    const PORT = 4000;

    app.listen(PORT, () => {
        console.log(`Listening to http://localhost:${PORT}`);
    });
});
