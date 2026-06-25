<template lang="pug">
  div.statusBarWrapper() {{ props.text }}
</template>

<script setup>
import { defineProps } from 'vue';


const props = defineProps({
    text: {
        type: String,
        default: ""
    }
})

</script>

<style scoped>
    .statusBarWrapper {
        background: #1B1B1E;
        height: 24px;
        padding: 2px 8px;
        color: #878787;
    }
</style>