<script setup>
  import { reactive, ref } from 'vue'

  import UIkit from 'uikit'
  import Icons from 'uikit/dist/js/uikit-icons';

   // loads the Icon plugin
  UIkit.use(Icons);

  window.UIkit = UIkit;

  import "./assets/css/uikit.min.css"

  import pgAPI from "./assets/js/pgAPI.js"
  import pgREPL from './components/pgREPL.vue'
  import page from './components/Page.vue'


</script>

<template>
  <div>
   <page/>
  </div>
</template>
