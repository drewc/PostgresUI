<script setup>
import { ref } from 'vue'
import { api, pgAPI, post } from "../../../js/pgAPI"
import PgLogin from './PgLogin.vue'
console.log('setup REPL!')

const servers = pgAPI.servers

const currentServer = ref(
    servers.value.length > 0 ? servers.value.slice(-1)[0] : undefined)

function innerWidth() { return window.innerWidth };

function isMobile () { return innerWidth() <= 640 }

</script>

<template src="../../../html/pgREPL.html">
</template>

<style src="../../../css/dashboard.css">
</style>
