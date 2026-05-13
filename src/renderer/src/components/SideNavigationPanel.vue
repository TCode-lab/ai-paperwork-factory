<template lang="pug">
    div.sidebar
        div.sidebarElement(v-for="(route, index) in props.routes" :key="index" @click="choose(route)")
            img.sidebarElementIcon(:src="route.icon")
            p.sidebarElementTitle.mediumText {{ route.title }}
</template>

<script setup>
    const props = defineProps({
        routes: {
            type: Array,
            required: true
        }
    })

    const emit = defineEmits(['selectRoute'])
    const choose = (item) => { emit('selectRoute', item) }
</script>

<style scoped>
    .sidebar {
        background: #1B1B1E;
        min-width: 250px;
        height: 100vh;
        gap: 8px;
        padding: 8px;
    }

    .sidebarElement {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        cursor: pointer;
    }

    .sidebarElementIcon {
        width: 24px;
        height: 24px;
    }
</style>