<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import PgLogin from './components/PgLogin.vue'
import PgREPL from './components/pgREPL.vue'
import "../../js/uikit.min.js"
import "../../js/uikit-icons.min.js"
import pgAPI from "../../js/pgAPI"
import { reactive, ref } from 'vue'


const servers = pgAPI.servers

</script>



<template>
<PgREPL></pgREPL>
<!-- <PgLogin msg="PostgreSQL Server Login" /> -->
<!-- <PgLogin msg="Foo" /> -->

<!-- Servers: {{ servers }} -->
</template>

<style src="../../css/uikit.min.css">
</style>
