import fs from "fs";
import path from "path";

import { defineConfig, UserConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import { visualizer } from "rollup-plugin-visualizer";
import svgLoader from "vite-svg-loader";

export default defineConfig(({ command, mode, ssrBuild }) => {
    let hash = "bundled";

    let outDir = `dist/${hash}/client`;

    if (ssrBuild) {
        outDir = `dist/${hash}/server`;
    }

    const config: UserConfig = {
        build: {
            manifest: true,
            rollupOptions: {
                input: {
                    index: path.join(__dirname, "src/entry-client.ts")
                },
                output: {
                    dir: outDir
                }
            }
        },
        plugins: [
            vue(),
            legacy({
                targets: ["ie >= 11"],
                additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
            }),
            svgLoader()
        ],
        resolve: {
            alias: {
                "@": path.join(__dirname, "src"),
                "~": path.join(__dirname, "assets")
            }
        },
        define: {
            "process.env": process.env
        }
    };

    if (command === "build") {
        config.plugins.push(
            visualizer({
                open: false,
                gzipSize: true,
                brotliSize: true
            })
        );
    }

    return config;
});
