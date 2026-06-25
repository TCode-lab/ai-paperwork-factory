<template lang="pug">
    div.spaceWrapper
        SideNavigationPanel(:routes="routes" @selectRoute="onSelectNavigationRoute")
        div.view
            div.LinksExplorerView(v-if="activeViewId === 'projects'")
                LinksExplorer(:isLoading="isLoading" :files="links")
            div.appSettingsView(v-if="activeViewId === 'settings'")
                LinksExplorer(:isLoading="isLoading" :files="links", :favorite="true")
    StatusBar(:text="statusBarText")
</template>

<script setup>
import SideNavigationPanel from '../components/SideNavigationPanel.vue';
import LinksExplorer from '../components/LinksExplorer.vue';
import AppSettings from '../components/AppSettings.vue';
import StatusBar from '../components/StatusBar.vue';
import { onMounted, ref, watch } from 'vue';
// import { contextBridge, ipcRenderer } from 'electron'; 

// Иконки
import IconProjects from '../components/icons/IconProjects.vue';
import IconSettings from '../components/icons/IconSettings.vue';
//



const routes = [
    {
        id: "projects",
        title: "Лоты",
        iconComponent: IconProjects
    },
    {
        id: "settings",
        title: "Избранные",
        iconComponent: IconSettings
    }
]

const activeViewId = ref("")
const onSelectNavigationRoute = (route) => { activeViewId.value = route.id }

const statusBarText = ref('')
const links = ref([])

const isLoading = ref(true)

watch(links, async (newValue, oldValue) => {
    const getRowsForSave = (rows) => {
        return rows.filter(link => link.favorite !== false || link.checked !== false)
                   .map(link => ({
                       key: link.key,
                       checked: link.checked,
                       favorite: link.favorite
                   }))
    }

    const rowsToSave = getRowsForSave(newValue)
    if (rowsToSave !== getRowsForSave(oldValue)) {
        console.log('сохранение...')
        await window.api.saveRows(rowsToSave)
    }
}, { deep: true })

onMounted(async () => {
    isLoading.value = true
    const res = await window.api.loadRows()
    const oldRows = res.data

    const addRows = (rows) => {
        rows.forEach(row => {
            const oldRow = oldRows.find(r => r.key === row.key)
            links.value.push({
                ...row,
                checked: oldRow !== undefined ? oldRow.checked : false,
                favorite: oldRow !== undefined ? oldRow.favorite : false
            })
        })
        
        links.value.forEach((link, idx) => link.realIdx = idx)
    }

    try {
        statusBarText.value = 'parse 1/? page...'
        let { nextPage, totalPageCount, rows } = await window.api.indexPage(null, null)
        addRows(rows)

        while (nextPage !== null) {
            statusBarText.value = `parse ${nextPage}/${totalPageCount} page...`
            const res = await window.api.indexPage(nextPage, totalPageCount)
            nextPage = res.nextPage 
            addRows(res.rows)
        }
        statusBarText.value = ''
    } catch (err) {
        alert(`Произошла ошибка при парсинге сайтов: ${err}`)
        console.log(err)
        statusBarText.value = 'Failed'
        setTimeout(() => { statusBarText.value = '' }, 5000)
    }

    isLoading.value = false
})

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