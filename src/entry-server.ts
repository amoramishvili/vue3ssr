import { createApp, AppOptions } from "./app";

import { renderToString } from "@vue/server-renderer";
import { renderHeadToString } from "@vueuse/head";

export async function render(
    url: string,
    manifest = {},
    opts: AppOptions = {}
) {
    const { app, router, head, store } = createApp(opts);

    await router.push(url);
    await router.isReady();

    const ctx: any = {};

    const html = await renderToString(app, ctx);

    const { headTags, htmlAttrs, bodyAttrs, bodyTags } =
        renderHeadToString(head);

    const preloadLinks = renderPreloadLinks(ctx.modules, manifest);

    let state = JSON.stringify(store.state.value);

    return {
        route: router.currentRoute.value,
        context: {
            html,
            preloadLinks,
            headTags,
            htmlAttrs,
            bodyAttrs,
            bodyTags,
            state
        }
    };
}

function renderPreloadLinks(modules, manifest) {
    let links = "";
    const seen = new Set();
    modules.forEach((id) => {
        const files = manifest[id];
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
}

function renderPreloadLink(file) {
    if (file.endsWith(".js")) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith(".css")) {
        return `<link rel="stylesheet" href="${file}">`;
    } else if (file.endsWith(".woff")) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    } else if (file.endsWith(".woff2")) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    } else if (file.endsWith(".gif")) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
    } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
    } else if (file.endsWith(".png")) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
    } else {
        // TODO
        return "";
    }
}
