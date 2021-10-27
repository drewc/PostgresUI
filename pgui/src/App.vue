<script setup>
  import { reactive, ref } from 'vue'

  import "./assets/js/uikit.min.js"
  import "./assets/js/uikit-icons.min.js"
  import "./assets/css/uikit.min.css"

  import pgAPI from "./assets/js/pgAPI.js"
  import pgREPL from './components/pgREPL.vue'


</script>

<template>
  <pgREPL></pgREPL>
</template>
