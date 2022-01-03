<script setup>
import { ref, getCurrentInstance } from 'vue'
import pgAPI from '../assets/js/pgAPI'
import { SQLQuery } from '../assets/js/api/simple-query'
import PgLogin from './PgLogin.vue'
import CodeMirror from './CodeMirror.vue'
import globalCodeMirror from 'codemirror'
import ClusterizeTable from './Clusterize.vue'
// import Clusterize from 'clusterize.js'

import { onMounted } from 'vue'

import XLSX from 'xlsx'
import ResultsTable from './ResultsTable.vue'
const resultCache = pgAPI.resultCache;
const results = ref(resultCache);
const self =  getCurrentInstance();

var data = ['<tr>…</tr>', '<tr>…</tr>'];


console.log('setup REPL!', self, this)
const update = ref();
const servers = pgAPI.servers

console.log('setup REPL!', self, this, servers)

function currentServer()  {
    return servers.value && servers.value.length > 0 ? servers.value.slice(-1)[0] : undefined
}

console.log('setup REPL!', self, servers.value[0] )
console.log('currentSerbver', currentServer() )

let codemirror ;

const error = ref();

let historyCount = 1

function getPreviousHistory() {
    const reses = results.value;
    const his = reses[reses.length - historyCount];
    console.log("History?", reses, his, reses.length, historyCount)
    if (!!his && reses.length !== historyCount) {
        historyCount = historyCount + 1
    }
    return his ? his.string : false;
}

function getNextHistory() {
    if (historyCount === 1) {
        return false
    } else {
        historyCount = historyCount - 1;
        const reses = results.value;
        const his = reses[reses.length - historyCount];
       console.log("NextHistory?", reses, his, reses.length, historyCount)
        return his ? his.string : false;
    }
}
function addHistoryMap(cm, self=getCurrentInstance()) {
    let firstValue = false;
    const extraKeys = {
        ...cm.options.extraKeys,
        Up:  function (cm) {
            if (cm.getCursor().line === 0) {
                if (historyCount === 1) { firstValue = cm.getValue() }
                const hist = getPreviousHistory();
                if (hist) {
                    cm.setValue(hist)
                    cm.setCursor({ line: 0 })
                } else {
                    globalCodeMirror.Pass
                }
            } else {
                return globalCodeMirror.Pass
            }
        },
        Down: function (cm) {
            if (cm.getCursor().line === 0) {
                if (historyCount === 1) {
                    if (typeof firstValue === "string") {
                        cm.setValue(firstValue)
                        firstValue = false;
                    }
                    return globalCodeMirror.Pass
                } else {
                    const hist = getNextHistory()
                    if (hist) {
                        cm.setValue(hist)
                        cm.setCursor({ line: 0 })
                    } else return  globalCodeMirror.Pass;
                }
            } else return globalCodeMirror.Pass;
        }
    }

    console.log('Adding History Keys', extraKeys)
    cm.setOption("extraKeys", extraKeys);

}


window.SQLHistory = results.value;


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



function prepareCodeMirror(cm = codemirror, server = currentServer()) {
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
    function (server = currentServer()) {
        const cm = this;
        return prepareCodeMirror(cm, server)
    }


window.CodeMirror = globalCodeMirror



function queryCodeMirror(cm = codemirror, server = currentServer()) {
   console.log('Querying:', cm.getValue());
    const q = new SQLQuery(cm.getValue())
    console.log('Simple Query', q);

    q.run(server).then(res => {
        console.log('done sq', res, q)
        results.value.push(q)
    })
     .catch(e => console.error(e));
    // return prepareCodeMirror(cm, server).then(stmt => {
    //  if (!!stmt && stmt.error) {
    //      error.value = stmt;
    //      return stmt
    //  } else if (!stmt) {
    //      return null;
    //   } else {
    //       return stmt.query().then(rstmt => {
    //           Object.assign(stmt, rstmt)
    //           // console.log('add results of query', stmt)
    //           results.value.push(stmt)
    //           cm.setValue("")
    //           return stmt;
    //       })

    //   }
    // })
    //     .catch(e => {
    //         console.error('Here Now Like err!', e.message,  e.response && e.response.data)
    //         window.err = e;
    //     })

}

globalCodeMirror.prototype.prepareSQL = prepareCodeMirror;

// console.log('toop', getCurrentInstance())
function codeMirrorInit(cm) {
  codemirror = cm;
  addEnterMap(cm);
  addHistoryMap(cm);
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

window.huh = import('../../pgui.conf.json')

function bookName(qres) {
  return qres.workBookName || "Spreadsheet-" + new Date()
}

function reportRouterLinkTo(qres) {
     const to = {
              name: 'save-new-report',
              params: { query: qres.string,
                        cacheNum: results.value.indexOf(qres)
                      }
             }
    console.log('To:', to)
    return to;
 }


</script>

<script>
</script>
<!-- <template src="/src/assets/html/pgREPL.html"> -->
<!-- </template> -->

<template>
   <!-- CONTENT -->
      {{ update }}
      {{ currentServer() }}
  
     <div class="uk-container uk-container-expand">
       <div style="position:relative">
          <div v-if="error" class="uk-alert-danger sql-error" uk-alert>
            <a class="uk-alert-close" @click="error = false"> X </a>
            <p> {{ error.message || error }} </p>
          </div>
  
       <div style="max-height: 60vh; overflow: auto; display: flex; "
            class="uk-flex uk-flex-column-reverse">
         <div v-for="qres in [...results].reverse()">
           <hr>
           <button class="uk-button uk-button-default sql-menu-button" type="button">
             <span uk-icon="table"></span>
           </button>
           <div uk-dropdown>
             <ul class="uk-nav uk-dropdown-nav">
               <li class="uk-nav-header">Spreadsheet</li>
               <li>Name: <input v-model="qres.workBookName" /> </li>
               <li>
                 <button type="button"
                   @click="qres.writeFile({ name: bookName(qres) })">
                   Download
                 </button>
               </li>
               <li class="uk-nav-header">Report {{ results.indexOf(qres) }}</li>
               <li>
                 <router-link
                   :to="reportRouterLinkTo(qres)"
                   >Save as Report</router-link>
               </li>
             </ul>
           </div>
           
         <pre><code>{{ qres.string }}</code></pre>
         =>
         <div v-for="res in [...qres.results]" class="res" >
           <ResultsTable v-if="res.columns" :result="res" />
           <pre v-else class="uk-text-success">{{ res.complete }}</pre>
         <!--  <div v-for="res in [...qres]"> -->
         <!--  {{ res }} -->
         <!-- </div> -->
         </div>
         </div>
         </div>
  
          <CodeMirror v-if="currentServer() && currentServer().uuid"
                      setValue="SHOW ALL;"
               @init="codeMirrorInit($event)"
               ref="CodeMirrorElement"
               @query="queryCodeMirror"
               />
   <PgLogin v-else msg="PostgreSQL Server Login" :currentServer="currentServer()"
            @login="servers.push($event)"/>
  
       </div>
       <!-- <div> Results: {{ results }} </div> -->
  
      <footer class="uk-section uk-section-small uk-text-center">
       <hr>
       <p class="uk-text-small uk-text-center">Copyright 2019 - <a href="https://github.com/zzseba78/Kick-Off">Created by KickOff</a> | Built with <a href="http://getuikit.com" title="Visit UIkit 3 site" target="_blank" data-uk-tooltip><span data-uk-icon="uikit"></span></a> </p>
      </footer>
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

<style>
.sql-result .clusterize-scroll {
    max-height: 45vh;
}

.res pre {
 margin: 0px;
 padding: 0px;
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
