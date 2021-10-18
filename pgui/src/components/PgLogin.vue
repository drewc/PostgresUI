<script setup>
  import { ref, reactive} from 'vue'
  import Login from "../../../api/login"
  
  const { pgLogin, api } = Login;
  
  const props = defineProps({
      msg: String,
      currentServer: Object
  })
  
  const emits = defineEmits(['login']);
  
  const username = ref()
  const pw = ref()
  const host = ref()
  const port = ref()
  const database = ref() ;
  
  const pu = reactive({
      username, pw, host, port, database})
  
  const error = ref(false);
  
  function getServers() {
      let servers = api.servers
      return (Array.isArray(servers) && servers.length > 0)
  };
  
  console.log('setip lig',emits)
  function lists (prop) {
   const things = api.servers.map( s => {
          return s[prop]
      })
      return [...new Set(things)];
  }
  
  function listslast (arr) {
     if (arr.length > 0) return arr[arr.length - 1]
  }
  
  function hosts() {
      return lists('host')
  }
  
  function defaultHost() {
    return listslast(hosts())
  }
  
  host.value = defaultHost()
  port.value = (api.servers.length > 0) ? listslast(api.servers).port : undefined;
  
  function hostPlaceholder() {
     const d = defaultHost()
  
    return ("Server Host" + ( d ? (": " + d) : "" ))
  }
  
  
  async function login(e) {
      e.preventDefault();
  
      const server = await pgLogin(pu.host, pu.port, pu.username,
                                   pu.pw || false, pu.database || pu.username)
      if ("error" in server) {
          error.value = server.error
  
      }
      emits('login', server)
      return server
  
  }
</script>

<template src="../../../html/login-to-server.html">
</template>

<style scoped>
.uk-input .uk-input {
    border: none;
    padding: 0;
    margin: 0;
}
.uk-input .pgui-port{
   width: 6em;
}
</style>
