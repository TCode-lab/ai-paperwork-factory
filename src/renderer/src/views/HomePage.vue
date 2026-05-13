<template lang="pug">
    div.spaceWrapper
        SideNavigationPanel(:routes="routes" @selectRoute="onSelectNavigationRoute")
        FilesExplorer(v-if="activeViewId === 'projects'", :files="projects")
        AppSettings(v-if="activeViewId === 'settings'")
</template>

<script setup>
import SideNavigationPanel from '../components/SideNavigationPanel.vue';
import FilesExplorer from '../components/FilesExplorer.vue';
import AppSettings from '../components/AppSettings.vue';
import { ref } from 'vue';

// Иконки
import projectsIcon from '../assets/icons/projects.svg'
import settingsIcon from '../assets/icons/settings.svg'
//

const routes = [
    {
        id: "projects",
        icon: projectsIcon,
        title: "Проекты"
    },
    {
        id: "settings",
        icon: settingsIcon,
        title: "Настройки"
    }
]

const activeViewId = ref("")
const onSelectNavigationRoute = (route) => { activeViewId.value = route.id }

const projects = [
    {
        name: "Template",
        path: "C:\\tests\\template",
        lastChangeAt: new Date()
    },
    {
        name: "Template2",
        path: "C:\\tests\\template2",
        lastChangeAt: new Date()
    }
]

</script>

<style scoped>

.spaceWrapper {
    display: flex;
    flex-direction: row;
}

</style>