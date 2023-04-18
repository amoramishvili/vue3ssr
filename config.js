import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import toml from "toml";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const isContainer = __dirname == "/app/code";

export const Config = toml.parse(
    fs.readFileSync(
        isContainer ? "../config/project.toml" : "project.toml",
        "utf8"
    )
);
