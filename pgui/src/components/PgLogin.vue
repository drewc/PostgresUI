<script setup>
  import { ref, reactive} from 'vue'
  import Login from "/src/assets/js/login"
  
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
            .catch(e => {
                console.error('Login Error:', e)
                return { error: e }
            })
      if ("error" in server) {
          error.value = server.error
  
      }
      emits('login', server)
      return server
  
  }
</script>

<template>
  <div class="uk-flex uk-flex-center uk-flex-middle uk-background-muted" >
    <div class="uk-position-bottom-center uk-position-small uk-visible@m uk-position-z-index">
      <span class="uk-text-small uk-text-muted">© 2019 Company Name - <a href="https://github.com/zzseba78/Kick-Off">Created by KickOff</a> | Built with <a href="http://getuikit.com" title="Visit UIkit 3 site" target="_blank" data-uk-tooltip><span data-uk-icon="uikit"></span></a></span>
    </div>
    <div class="uk-padding-small">
      <!-- login -->
      <fieldset class="uk-fieldset">
        <div class="uk-flex-nowrap uk-inline"><h1> {{ msg }}</h1></div>
        <!-- login: {{ login }} -->
        <!--  cs: {{ currentServer }} -->
  
        <div v-if="error" class="uk-alert-danger" uk-alert>
          <a class="uk-alert-close" uk-close></a>
          <p> {{ error }} </p>
        </div>
        <!-- hosts: {{ hosts() }} -->
        <!-- servers : {{ api.servers }} -->
  
        <datalist id="hosts">
          <option v-for="host in hosts()" :value="host"/>
        </datalist>
        <form @submit="login">
          <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1 uk-input uk-border-pill uk-flex">
              <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
              <input class="uk-input" required
                     :placeholder="hostPlaceholder()"
                     :type="getServers() ? 'search' : 'text'"
                     :list="getServers() ? 'hosts' : null" v-model="host">
              <input class="uk-input pgui-port" required placeholder="Port" title="default: 5432" type="text" v-model="port">
            </div>
          </div>
  
          <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1">
              <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
              <input class="uk-input uk-border-pill" required placeholder="Username" type="text"
                     v-model="username">
            </div>
          </div>
  
          <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1">
              <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: lock"></span>
              <input class="uk-input uk-border-pill"
                     v-model="pw" placeholder="Password" type="password">
            </div>
          </div>
  
          <div class="uk-margin-small">
            <div class="uk-inline uk-width-1-1">
              <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"></span>
              <input v-model="database" class="uk-input uk-border-pill" :placeholder="'Database' + (username ? ': ' + username : '')" type="text">
            </div>
          </div>
  
  
          <!-- <div class="uk-margin-small"> -->
            <!--   <label><input class="uk-checkbox" type="checkbox"> Keep me logged in</label> -->
            <!-- </div> -->
          <div class="uk-margin-bottom">
            <button
              type="submit" class="uk-button uk-button-primary uk-border-pill uk-width-1-1">LOG IN</button>
          </div>
        </form>
      </fieldset>
      <!-- /login -->
  
      <!-- recover password -->
      <!-- <form class="toggle-class" action="login-dark.html" hidden> -->
        <!--   <div class="uk-margin-small"> -->
          <!--     <div class="uk-inline uk-width-1-1"> -->
            <!--       <span class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"></span> -->
            <!--       <input class="uk-input uk-border-pill" placeholder="E-mail" required type="text"> -->
            <!--     </div> -->
          <!--   </div> -->
        <!--   <div class="uk-margin-bottom"> -->
          <!--     <button type="submit" class="uk-button uk-button-primary uk-border-pill uk-width-1-1">SEND PASSWORD</button> -->
          <!--   </div> -->
        <!-- </form> -->
      <!-- /recover password -->
  
      <!-- <\!-- action buttons -\-> -->
        <!-- <div> -->
          <!--   <div class="uk-text-center"> -->
            <!--     <a class="uk-link-reset uk-text-small toggle-class" data-uk-toggle="target: .toggle-class ;animation: uk-animation-fade">Forgot your password?</a> -->
            <!--     <a class="uk-link-reset uk-text-small toggle-class" data-uk-toggle="target: .toggle-class ;animation: uk-animation-fade" hidden><span data-uk-icon="arrow-left"></span> Back to Login</a> -->
            <!--   </div> -->
          <!-- </div> -->
        <!-- <\!-- action buttons -\-> -->
    </div>
  
  </div>
  
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
