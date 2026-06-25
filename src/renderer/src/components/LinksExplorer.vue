<template lang="pug">
    div.filesExplorerWrapper
        div.filesFilters()
            div.filesFilter()
                input(type="checkbox" v-model="onlyUnChecked")
                label() {{ `Только новые` }}
        div.filesContainer()
            div.fileCard(v-for="(file, index) in filteredFiles" :key="file.realIdx")
                div.fileCardHeader
                    p.fileCardPrimary(:class="{'fileCardChecked': file.checked === true}" @click="cardClickHandler(file.realIdx)") {{ `№ ${file.key}` }}
                    IconSettings.favoriteButton(:color="file.favorite === true ? '#FBFBFB' : '#878787'" @click="favoriteClickHandler(file.realIdx)")
                div.fileCardTextFieldWrapper
                    p.fileCardPrimary(:class="{'fileCardChecked': file.checked === true}") Начальцая цена:
                    p.fileCardSecondary() {{ ` ${file.start_price} ₽` }}
            div.fileCard(v-if="isLoading") Загрузка...
</template>

<script setup>
    import { ref, computed } from 'vue'
    import IconSettings from './icons/IconSettings.vue'

    const props = defineProps({
        files: {
            type: Array,
            required: true
        },
        favorite: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    })

    const dateToString = (date) => {
        return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getMinutes()}:${date.getHours()}`
    }

    const cardClickHandler = (idx) => {
        const lot = props.files[idx]
        window.api.openExternalUrl(lot.ref)
        props.files[idx].checked = true
    }

    const favoriteClickHandler = (idx) => {
        props.files[idx].favorite = !props.files[idx].favorite
    }

    const onlyUnChecked = ref(false)
    const filteredFiles = computed(() => {
        let result = props.files
        if (onlyUnChecked && onlyUnChecked.value === true) {
            result = props.files.filter(file => file.checked === false)
        }
        if (props.favorite === true) {
            result = props.files.filter(file => file.favorite === true)
        }
        return result
    })

</script>

<style scoped>
    .filesExplorerWrapper {
        display: flex;
        flex-direction: column;
        padding: 8px;
        gap: 8px;
        width: 100%;
        height: 100%;
        max-height: calc(100vh - 28px);
    }

    .filesContainer {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-right: 8px;
    }

    .fileCard {
        position: relative;
        background: #1B1B1E;
        padding: 8px;
        border-radius: 8px;
        transition: box-shadow 0.3s ease;
        width: 100%;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1); 
    }

    .fileCard:hover {
        /* transform: translateY(-2px); */
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); 
        background: #262626;
    }

    .fileCardPrimary {
        color: #FBFBFB;
    }
    
    .fileCardSecondary {
        color: #878787;
        margin-left: 8px;
    }

    .fileCardChecked {
        color: #878787;
    }

    .fileCardTextFieldWrapper {
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
    }

    .fileCardHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
    }

    .fileCardHeader .fileCardPrimary {
        transition: font-weight 0.3s ease;
        cursor: pointer;
    }

    .fileCardHeader .fileCardPrimary:hover {
        font-weight: bold;
    }

    .favoriteButton {
        position: absolute;
        right: 12px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .favoriteButton:hover {
        transform: scale(1.2, 1.2);
    }
    
    .filesFilter {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
</style>