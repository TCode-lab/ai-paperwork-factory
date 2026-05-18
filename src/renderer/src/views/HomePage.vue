<template lang="pug">
    div.spaceWrapper
        SideNavigationPanel(:routes="routes" @selectRoute="onSelectNavigationRoute")
        div.view
            div.filesExplorerView(v-if="activeViewId === 'projects'")
                FilesExplorer(:files="projects")
            div.appSettingsView(v-if="activeViewId === 'settings'")
                AppSettings()
</template>

<script setup>
import SideNavigationPanel from '../components/SideNavigationPanel.vue';
import FilesExplorer from '../components/FilesExplorer.vue';
import AppSettings from '../components/AppSettings.vue';
import { ref } from 'vue';

// Иконки
import IconProjects from '../components/icons/IconProjects.vue';
import IconSettings from '../components/icons/IconSettings.vue';
//

const routes = [
    {
        id: "projects",
        title: "Проекты",
        iconComponent: IconProjects
    },
    {
        id: "settings",
        title: "Настройки",
        iconComponent: IconSettings
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
    width: 100%;
    display: flex;
    flex-direction: row;
}

.view {
    width: 100%;
}

</style>