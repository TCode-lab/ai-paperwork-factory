<template lang="pug">
  div.fileCard(v-for="(file, index) in props.files" :key="index")
    img.fileCardIcon(src="../assets/icons/file.svg")
    p.fileCardTitle {{ file.name }}
    p.fileCardPath {{ file.path }}
    p.fileCardLastChangeAt {{ file.lastChangeAt }}
</template>

<script setup>
    const props = defineProps({
        files: {
            type: Array,
            required: true
        }
    })
</script>

<style scoped>
    
</style>