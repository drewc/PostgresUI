<script setup>
import { ref, computed } from 'vue'
import CodeMirror from './CodeMirror.vue'
import PreView from './ReportViewer.vue'
import { Report } from '../assets/js/pgAPI'

const props = defineProps({
    query: String,
    SQLQuery: Object,
    cacheNum: Number
})

const error = ref()

const description = ref("")
const repQuery = ref(props.query)

const report = ref({ name: undefined });
const sheetNames = ref([]);

function title () {
 if (report.value.uuid) {
  return "Edit Report"
 }
 return "Save New Report"
}
if (props.SQLQuery)  {
    const q = props.SQLQuery
    report.value = { SQLQuery: q }
    sheetNames.value = q.results.filter(r =>
        r.isSpreadSheet).map(r => r.sheetName);
    sheetNames.value.forEach((nm, i) => {
        if(!nm) sheetNames.value[i] = 'Sheet ' + (i + 1)
    })
    window.testSQLQuery = q;
}


function saveReport() {
    const self = report.value
   try {
        const rep = new Report({
            query: props.query,
            name: self.name,
            description: description.value,
            filename: self.filename || self.name,
            sheetnames: sheetNames.value
        })
        console.log('New Report', rep)
        rep.save().then(sr => {
            if (sr.error) {
                error.value = sr.error
            } else {
                self.uuid = sr.uuid
            }
        })
            .catch(e => { error.value = e })
    } catch (e) {
        error.value = e
    }

}
function makeReport(name, query, description) {
    return { name: name, description: description, query: query };
}

const mirrorQuery = ref(props.query);

function preview () {

}

</script>

<template>
<h1> {{ title() }}</h1>
<div class="report-codemirror-container">
<CodeMirror @init="mirrorQuery = $event.getValue()" ref="CodeMirrorSFC" :setValue="repQuery" />
</div>
<div style="position:relative">
        <div v-if="error" class="uk-alert-danger sql-error" uk-alert>
          <a class="uk-alert-close" @click="error = false"> X </a>
          <p> {{ error.message || error }} </p>
        </div>
</div>
{{ query }}
{{ cacheNum }}
{{ sheetNames }}
<div class="uk-column-1-2 uk-column-divider">
    <input class="uk-input" type="text" placeholder="Report Name" v-model="report.name">
    <input class="uk-input" type="text" placeholder="File Name"
           :value="report.filename || report.name"
           @input="report.filename = $event.target.value">

  <p>
    <textarea class="uk-textarea"
              rows="5"
              placeholder="Description of Report"
              v-model="description">
    </textarea>
    </p>

    <p>
     Sheet Names:
     <input v-for="(n, idx) in sheetNames"
            class="uk-input" type="text" v-model="sheetNames[idx]">
    </p>
    <p>
      <button class="uk-button" type="button"
              @click="preview()"> Preview </button>
      &nbsp;
      <button class="uk-button" type="button" @click="saveReport()"> Save </button>
    </p>
    </div>
 <PreView :report="report" v-if="report" />


</template>
