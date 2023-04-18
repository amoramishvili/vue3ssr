<template>
    <component :is="getLayout(route.meta.layout as string)">
        <RouterView :key="route.fullPath"> </RouterView>
    </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getLayout } from "./layouts";
import { useRoute } from "vue-router";
export default defineComponent({
    setup() {
        const route = useRoute();
        return {
            getLayout,
            route
        };
    }
});
</script>
