import DefaultLayout from "./default.layout.vue";
import SecondLayout from "./second.layout.vue";

export function getLayout(name: string) {
    switch (name) {
        case "default":
            return DefaultLayout;
        case "second":
            return SecondLayout;
        default:
            return DefaultLayout;
    }
}
