import "~/scss/main.scss";

import { createApp } from "./app";

let appOptions = {
    baseUrl: window.location.origin,
    baseApiUrl: window.location.origin + "/api"
};

if (window["__APP_OPTIONS__"]) {
    appOptions = window["__APP_OPTIONS__"];
}

const { app, router, head, store } = createApp(appOptions);

if (window["__INITIAL_STATE__"]) {
    store.state.value = window["__INITIAL_STATE__"];
}

router.isReady().then(() => {
    app.mount("#app", true);
});
