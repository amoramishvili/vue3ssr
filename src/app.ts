import { createApp as createClientApp, createSSRApp } from "vue";

import { createHead } from "@vueuse/head";

import { createRouter } from "./router";
import { createStore } from "./store";
import App from "./App.vue";
import http from "./store/http.store";

export interface AppOptions {
    hostUrl?: string;
    baseUrl?: string;
    baseApiUrl?: string;
}

export function createApp(opts: AppOptions = {}) {
    const isSSR = import.meta.env.SSR;

    const app = isSSR ? createSSRApp(App) : createClientApp(App);

    app.config.globalProperties.$opts = opts;

    const head = createHead();
    const router = createRouter(isSSR);
    const store = createStore(isSSR);

    app.use(router);
    app.use(store);
    app.use(head);

    http.init({
        baseApiUrl: opts.baseApiUrl as string
    });

    return { app, store, router, head };
}
