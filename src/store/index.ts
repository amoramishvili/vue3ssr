import { createPinia } from "pinia";

export function createStore(isSSR: boolean) {
    const store = createPinia();

    return store;
}
