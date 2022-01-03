import { createRouter, createWebHistory } from 'vue-router'
import pgREPL from './components/pgREPL.vue'
import ReportEditor from './components/ReportEditor.vue'
import Hello from './components/HelloWorld.vue'
import { resultCache } from './assets/js/pgAPI'
export const routes = [
    { path: '/', name: 'REPL', component: pgREPL},
    { path: '/shell', name: 'REPL', component: pgREPL,
      name: 'shell'
    },
    { path: '/save-new-report/',
      name: 'save-new-report',
      props: route => ({ query: route.params.query,
                         SQLQuery: resultCache[parseInt(route.params.cacheNum)],
                         cacheNum: parseInt[route.params.cacheNum]
                       }),
      component: ReportEditor
    }
]

export const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

export default router
