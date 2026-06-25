<template lang="pug">
    div.sidebar
        div.sidebarElement(v-for="(route, index) in props.routes" :key="index" :class="{'sidebarElementActive': activeRouteId === route.id}" @click="choose(route)")
            component.sidebarElementIcon(:is="route.iconComponent" :color="activeRouteId === route.id ? '#FBFBFB' : '#878787'")
            p.sidebarElementTitle.mediumText {{ route.title }}
</template>

<script setup>
import { ref } from 'vue'

    const props = defineProps({
        routes: {
            type: Array,
            required: true
        }
    })

    const activeRouteId = ref("")

    const emit = defineEmits(['selectRoute'])
    const choose = (item) => {
        console.log(item.id)
        activeRouteId.value = item.id
        emit('selectRoute', item) 
    }

    if (props.routes.length > 0) { choose(props.routes[0]) }
</script>

<style scoped>
    .sidebar {
        background: #1B1B1E;
        min-width: 220px;
        height: calc(100vh - 28px);
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
        color: #878787;
        font-style: inherit;
    }

    .sidebarElementActive {
        border-left: 2px solid #FBFBFB;
        padding-left: 8px;
        color: #FBFBFB;
    }

    .sidebarElementIcon {
        width: 20px;
        height: 20px;
    }
</style>