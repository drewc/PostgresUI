<script setup>
import { ref, getCurrentInstance } from 'vue'
import pgAPI from './js/pgAPI'
import PgLogin from './PgLogin.vue'
import CodeMirror from './CodeMirror.vue'
import globalCodeMirror from 'codemirror'
import ClusterizeTable from './Clusterize.vue'
// import Clusterize from 'clusterize.js'

import { onMounted } from 'vue'

import XLSX from 'xlsx'
import ResultsTable from './ResultsTable.vue'

const self =  getCurrentInstance();

var data = ['<tr>…</tr>', '<tr>…</tr>'];


// console.log('setup REPL!')

const servers = pgAPI.servers

const currentServer = ref(
    servers.value && servers.value.length > 0 ? servers.value.slice(-1)[0] : undefined)

let codemirror ;

const error = ref();
const results = ref([])


function addEnterMap(cm, self=getCurrentInstance()) {
    const extraKeys = {
        ...cm.options.extraKeys,
        Enter:  function (cm) {
            // console.log("Hit Enter!!", self, cm.getValue(), cm.lastChar())
            if (cm.lastChar() === ";") {
                self.emit('query', cm)
            } else {
                return globalCodeMirror.Pass
            }
        }
    }

    console.log('Adding Enter', extraKeys)
    cm.setOption("extraKeys", extraKeys);

}



function prepareCodeMirror(cm = codemirror, server = currentServer.value) {
    //     return cm.prepareSQL(cm, server);
    // }

    console.log('prepping', server, cm.getValue())

    const stmt = new pgAPI.SqlStatement(
        { text: cm.getValue(), uuid: server.uuid}
    );

    error.value = false;
    return stmt.prepare()
        .then(stmt => {
            // console.log('Prepped!', stmt)
            return stmt
        })

        .catch(e => {
            if (e.response && e.response.data && e.response.data.error) {
                const err = e.response.data.error;
                console.log('Endpoint Error:', err)
                if (err.code = "42601") {
                    cm.execCommand("newlineAndIndent");
                    error.value = err;
                    return null;
                } else {
                    return { error: e.response.data.error }
                }
            } else {
                console.warn('Unknown error:', e)
                return { error: e }
            }
        });
}

globalCodeMirror.prototype.prepareSQL =
    function (server = currentServer.value) {
        const cm = this;
        return prepareCodeMirror(cm, server)
    }



function queryCodeMirror(cm = codemirror, server = currentServer.value) {
   console.log('Querying:', cm.getValue);
    return prepareCodeMirror(cm, server).then(stmt => {
     if (!!stmt && stmt.error) {
         error.value = stmt;
         return stmt
     } else if (!stmt) {
         return null;
      } else {
          return stmt.query().then(rstmt => {
              Object.assign(stmt, rstmt)
              // console.log('add results of query', stmt)
              results.value.push(stmt)
          })

      }
    })
        .catch(e => {
            console.error('Here Now Like err!', e.message,  e.response && e.response.data)
            window.err = e;
        })

}

globalCodeMirror.prototype.prepareSQL = prepareCodeMirror;

// console.log('toop', getCurrentInstance())
function codeMirrorInit(cm) {
  codemirror = cm;
  addEnterMap(cm);
  window.dbgCodeMirror = cm
  // console.log("New CodeMirror", cm)
}

function innerWidth() { return window.innerWidth };

function isMobile () { return innerWidth() <= 640 }


// function onChange(cm, change) {
//   console.log("args", change,   this.$emit)

//     console.log('lastLine', cm.lastLine())

//     function lastLine(num) {
//         const l = cm.getLine(num).trim();
//         return (l === "" && num !== 0) ? lastLine(num - 1) : l;
//     }

//     const { from, text } = change;
//     const { line } = from;
//     console.log("from", cm.lastLine(), cm.firstLine() )

// }

// function onChanges(cm, changes) {
//  // console.log("changes", changes)
// }

  // JavaScript
var data = ['<tr>…</tr>', '<tr>…</tr>'];



</script>

<script>
</script>
<!-- <template src="/src/assets/html/pgREPL.html"> -->
<!-- </template> -->

<template>
  <!-- LEFT BAR -->
    <aside :id="!isMobile() ? 'left-col' : null" class="uk-light"
           v-if="currentServer && currentServer.uuid">
     <div class="left-logo uk-flex uk-flex-middle">
      <!-- <img class="custom-logo" src="img/dashboard-logo.svg" alt=""> -->
     </div>
     <div class="left-content-box  content-box-dark">
      <!-- <img src="img/avatar.svg" alt="" class="uk-border-circle profile-img"> -->
      <div class="uk-position-relative uk-text-center uk-display-block">
          <a href="#" class="uk-text-small uk-text-muted uk-display-block uk-text-center" data-uk-icon="icon: triangle-down; ratio: 0.7">
            {{ currentServer.host }}</a>
          <!-- user dropdown -->
          <div class="uk-dropdown user-drop" data-uk-dropdown="mode: click; pos: bottom-center; animation: uk-animation-slide-bottom-small; duration: 150">
           <ul class="uk-nav uk-dropdown-nav uk-text-left">
             <li v-for="server in servers"> {{ server.name }} </li>
          <li><a href="#"><span data-uk-icon="icon: settings"></span> Configuration</a></li>
          <li class="uk-nav-divider"></li>
          <li><a href="#"><span data-uk-icon="icon: refresh"></span> Change Server </a></li>
          <li class="uk-nav-divider"></li>
          <li><a href="#"><span data-uk-icon="icon: sign-out"></span> Sign Out</a></li>
           </ul>
          </div>
          <!-- /user dropdown -->
      </div>
     </div>
  
     <div class="left-nav-wrap">
      <ul class="uk-nav uk-nav-default uk-nav-parent-icon" data-uk-nav>
       <li class="uk-nav-header">ACTIONS</li>
       <li><a href="#"><span data-uk-icon="icon: comments" class="uk-margin-small-right"></span>Messages</a></li>
       <li><a href="#"><span data-uk-icon="icon: users" class="uk-margin-small-right"></span>Friends</a></li>
       <li class="uk-parent"><a href="#"><span data-uk-icon="icon: thumbnails" class="uk-margin-small-right"></span>Templates</a>
        <ul class="uk-nav-sub">
         <li><a title="Article" href="https://zzseba78.github.io/Kick-Off/article.html">Article</a></li>
         <li><a title="Album" href="https://zzseba78.github.io/Kick-Off/album.html">Album</a></li>
         <li><a title="Cover" href="https://zzseba78.github.io/Kick-Off/cover.html">Cover</a></li>
         <li><a title="Cards" href="https://zzseba78.github.io/Kick-Off/cards.html">Cards</a></li>
         <li><a title="News Blog" href="https://zzseba78.github.io/Kick-Off/newsBlog.html">News Blog</a></li>
         <li><a title="Price" href="https://zzseba78.github.io/Kick-Off/price.html">Price</a></li>
         <li><a title="Login" href="https://zzseba78.github.io/Kick-Off/login.html">Login</a></li>
         <li><a title="Login-Dark" href="https://zzseba78.github.io/Kick-Off/login-dark.html">Login - Dark</a></li>
        </ul>
       </li>
       <li><a href="#"><span data-uk-icon="icon: album" class="uk-margin-small-right"></span>Albums</a></li>
       <li><a href="#"><span data-uk-icon="icon: thumbnails" class="uk-margin-small-right"></span>Featured Content</a></li>
       <li><a href="#"><span data-uk-icon="icon: lifesaver" class="uk-margin-small-right"></span>Tips</a></li>
       <li class="uk-parent">
        <a href="#"><span data-uk-icon="icon: comments" class="uk-margin-small-right"></span>Reports</a>
        <ul class="uk-nav-sub">
         <li><a href="#">Sub item</a></li>
         <li><a href="#">Sub item</a></li>
        </ul>
       </li>
      </ul>
      <div class="left-content-box uk-margin-top">
  
        <h5>Daily Reports</h5>
        <div>
         <span class="uk-text-small">Traffic <small>(+50)</small></span>
         <progress class="uk-progress" value="50" max="100"></progress>
        </div>
        <div>
         <span class="uk-text-small">Income <small>(+78)</small></span>
         <progress class="uk-progress success" value="78" max="100"></progress>
        </div>
        <div>
         <span class="uk-text-small">Feedback <small>(-12)</small></span>
         <progress class="uk-progress warning" value="12" max="100"></progress>
        </div>
  
      </div>
  
     </div>
     <div class="bar-bottom">
      <ul class="uk-subnav uk-flex uk-flex-center uk-child-width-1-5" data-uk-grid>
       <li>
        <a href="#" class="uk-icon-link" data-uk-icon="icon: home" title="Home" data-uk-tooltip></a>
       </li>
       <li>
        <a href="#" class="uk-icon-link" data-uk-icon="icon: settings" title="Settings" data-uk-tooltip></a>
       </li>
       <li>
        <a href="#" class="uk-icon-link" data-uk-icon="icon: social"  title="Social" data-uk-tooltip></a>
       </li>
  
       <li>
        <a href="#" class="uk-icon-link" data-uk-tooltip="Sign out" data-uk-icon="icon: sign-out"></a>
       </li>
      </ul>
     </div>
    </aside>
    <!-- /LEFT BAR -->
  
   <!-- CONTENT -->
    <div :id="(currentServer && currentServer.uuid) ? 'content' : null" data-uk-height-viewport="expand: true">
  
     <div class="uk-container uk-container-expand">
       <div style="position:relative">
          <div v-if="error" class="uk-alert-danger sql-error" uk-alert>
            <a class="uk-alert-close" @click="error = false"> X </a>
            <p> {{ error.message || error }} </p>
          </div>
  
       <div style="max-height: 60vh; overflow: auto; display: flex; "
            class="uk-flex uk-flex-column-reverse">
         <div v-for="res in [...results].reverse()">
           <ResultsTable :result="res" />
         </div>
         </div>
  
          <CodeMirror v-if="currentServer && currentServer.uuid"
               @init="codeMirrorInit($event)"
               ref="CodeMirrorElement"
               @query="queryCodeMirror"
               />
   <PgLogin v-else msg="PostgreSQL Server Logaain" :currentServer="currentServer"
            @login="currentServer = $event"/>
  
       </div>
       <!-- <div> Results: {{ results }} </div> -->
  
      <footer class="uk-section uk-section-small uk-text-center">
       <hr>
       <p class="uk-text-small uk-text-center">Copyright 2019 - <a href="https://github.com/zzseba78/Kick-Off">Created by KickOff</a> | Built with <a href="http://getuikit.com" title="Visit UIkit 3 site" target="_blank" data-uk-tooltip><span data-uk-icon="uikit"></span></a> </p>
      </footer>
     </div>
    </div>
    <!-- /CONTENT -->
    <!-- OFFCANVAS -->
    <div id="offcanvas-nav" data-uk-offcanvas="flip: true; overlay: true">
     <div class="uk-offcanvas-bar uk-offcanvas-bar-animation uk-offcanvas-slide">
      <button class="uk-offcanvas-close uk-close uk-icon" type="button" data-uk-close></button>
      <ul class="uk-nav uk-nav-default">
       <li class="uk-active"><a href="#">Active</a></li>
       <li class="uk-parent">
        <a href="#">Parent</a>
        <ul class="uk-nav-sub">
         <li><a href="#">Sub item</a></li>
         <li><a href="#">Sub item</a></li>
        </ul>
       </li>
       <li class="uk-nav-header">Header</li>
       <li><a href="#js-options"><span class="uk-margin-small-right uk-icon" data-uk-icon="icon: table"></span> Item</a></li>
       <li><a href="#"><span class="uk-margin-small-right uk-icon" data-uk-icon="icon: thumbnails"></span> Item</a></li>
       <li class="uk-nav-divider"></li>
       <li><a href="#"><span class="uk-margin-small-right uk-icon" data-uk-icon="icon: trash"></span> Item</a></li>
      </ul>
      <h3>Title</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
     </div>
    </div>
    <!-- /OFFCANVAS -->
  
</template>

<style src="/src/assets/css/dashboard.css"> </style>
<style>
.clusterize-scroll {
    max-height: 40vh;
}

.sql-error {
    position:absolute;
    z-index: 1234;
    top: 50%;
    width: 80%;
    margin-left: 5%;
    text-align: center;
    border: 1px solid;
}
</style>
