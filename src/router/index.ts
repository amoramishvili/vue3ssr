import {
    createRouter as createVueRouter,
    createWebHistory,
    createMemoryHistory,
    RouteRecordRaw
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: () => import("../pages/home.page.vue"),
        meta: {}
    }
];

export function createRouter(isSSR: boolean) {
    const router = createVueRouter({
        history: isSSR ? createMemoryHistory() : createWebHistory(),
        routes
    });

    return router;
}
