<script setup>
import Clusterize from './Clusterize.vue'
const props = defineProps({
    result: Object,
    caption: String
})

</script>
<template>
<Clusterize
 :headers="result.columnHeaders()"
 :cluster="result.resultRows()"
 :caption="caption" />
</template>
