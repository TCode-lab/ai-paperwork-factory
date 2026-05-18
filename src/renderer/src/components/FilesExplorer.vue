<template lang="pug">
    div.filesExplorerWrapper
        div.fileCard()
            p.fileCardPrimary + Новая работа
        div.fileCard(v-for="(file, index) in props.files" :key="index")
            div.fileCardHeader
                IconFile()
                p.fileCardPrimary {{ file.name }}
            div.fileCardTextFieldWrapper
                p.fileCardPrimary Путь:
                p.fileCardSecondary {{ file.path }}
            div.fileCardTextFieldWrapper
                p.fileCardPrimary Дата изменения:
                p.fileCardSecondary {{ dateToString(file.lastChangeAt) }}
</template>

<script setup>
    import IconFile from './icons/IconFile.vue';

    const props = defineProps({
        files: {
            type: Array,
            required: true
        }
    })

    const dateToString = (date) => {
        return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getMinutes()}:${date.getHours()}`
    }


</script>

<style scoped>
    .filesExplorerWrapper {
        display: flex;
        flex-direction: column;
        padding: 8px;
        gap: 8px;
        width: 100%;
    }

    .fileCard {
        position: relative;
        background: #1B1B1E;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width: 100%;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1); 
    }

    .fileCardPrimary {
        color: #FBFBFB;
    }
    
    .fileCardSecondary {
        color: #878787;
    }

    .fileCard:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); 
        background: #262626;
    }

    .fileCardTextFieldWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .fileCardHeader {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
    }
</style>