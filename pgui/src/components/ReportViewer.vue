<script setup>
import { ref, computed } from 'vue'
import XLSX from 'xlsx'
import ClusterizeResult from './ClusterizeResult.vue'
import pgAPI from '../assets/js/pgAPI'

const props = defineProps({
    report: Object
})

XLSX.utils.sql_result_to_sheet = function (result) {
    function resultHeaders(res = props.result) {
        return res.columns.map(c => c[0])
    }
    function resultRows(res = props.result) {
        return res.results.map(a => Array.isArray(a) ? a : [a])
    }
    return  XLSX.utils.aoa_to_sheet([
     resultHeaders(result),
     ...resultRows(result)
     ]);
}

XLSX.utils.sql_result_to_book = function (result, name = "Sheet") {

   const wb = this.book_new();

   this.book_append_sheet(
        wb, this.sql_result_to_sheet(result), name);

    return wb;
}

XLSX.sql_result_writeFile = function (result, filename = name, type, name = "Sheet") {

    const wb = this.utils.sql_result_to_book(result, name);
    const ext = type.ext;
    const comp = type.container === "ZIP";

     this.writeFile(wb, filename + ext, { compression: comp });
}

XLSX.utils.sql_test = function () { return this; }
window.XLSX = XLSX

const error = ref(false)

function normalizedReport() { return props.report }

const reportValue = ref();

function defaultFileName() {
  props.report.name + '_' + new Date().toJSON()
};


const downloadAutomatically = ref(true);

function runReport (server = pgAPI.currentServer()) {
    const rep = normalizedReport();
    const stmt = new pgAPI.SqlStatement(
        { text: rep.query, uuid: server.uuid}
    );

    error.value = undefined;
    return stmt.prepare()
        .then(stmt => {
             console.log('Prepped report', stmt)
          return stmt.query().then(rstmt => {
              Object.assign(stmt, rstmt)
              console.log('Ran Report', stmt)
              reportValue.value = stmt
              if (downloadAutomatically.value) {
                  XLSX.sql_result_writeFile(
                      stmt, fileName.value, selectedFileType.value);
              }
              return stmt;
          })

        })
}

const _ftds = [
    ['file', 'ext',	'container',	'sheets',	'Description'],
    ['xlsx',	'.xlsx',	'ZIP',	'multi',	'Excel 2007+ XML Format'],
    ['xlsm',	'.xlsm',	'ZIP',	'multi',	'Excel 2007+ Macro XML Format'],
    ['xlsb',	'.xlsb',	'ZIP',	'multi',	'Excel 2007+ Binary Format'],
    ['biff8',	'.xls',	'CFB',	'multi',	'Excel 97-2004 Workbook Format'],
    ['biff5',	'.xls',	'CFB',	'multi',	'Excel 5.0/95 Workbook Format'],
    ['biff4','.xls','none','single','Excel 4.0 Worksheet Format'],
    ['biff3',	'.xls',	'none',	'single',	'Excel 3.0 Worksheet Format'],
    ['biff2',	'.xls',	'none',	'single',	'Excel 2.0 Worksheet Format'],
    ['xlml',	'.xls',	'none',	'multi',	'Excel 2003-2004 (SpreadsheetML)'],
    ['ods',	'.ods',	'ZIP',	'multi',	'OpenDocument Spreadsheet'],
    ['fods',	'.fods',	'none',	'multi',	'Flat OpenDocument Spreadsheet'],
    ['csv',	'.csv',	'none',	'single',	'Comma Separated Values'],
    ['txt',	'.txt',	'none',	'single',	'UTF-16 Unicode Text (TXT)'],
    ['sylk',	'.sylk',	'none',	'single',	'Symbolic Link (SYLK)'],
    ['html',	'.html',	'none',	'single',	'HTML Document'],
    ['dif',	'.dif',	'none',	'single',	'Data Interchange Format (DIF)'],
    ['dbf',	'.dbf',	'none',	'single',	'dBASE II + VFP Extensions (DBF)'],
    ['rtf',	'.rtf',	'none',	'single',	'Rich Text Format (RTF)'],
    ['prn',	'.prn',	'none',	'single',	'Lotus Formatted Text'],
    ['eth',	'.eth',	'none',	'single',	'Ethercalc Record Format (ETH)']
]


const sheetFileTypes = _ftds.slice(1).map((desc) => {
    const o = {};
    const props = _ftds[0]
    for (let i in desc) {
        o[props[i]] = desc[i]
    }
    return o
})

XLSX.utils.sheet_file_types = sheetFileTypes;




const selectedFileType = ref(sheetFileTypes[0])

const isModalVisible = ref(false);

function showModal(modal) {
  console.log("show modal", modal);
  UIkit.modal(modal).show();
  isModalVisible.value = true
  UIkit.util.on(modal, 'hide', () => { modalIsHidden(modal) })
}

function modalIsHidden (modal) {
   isModalVisible.value = false;
}


</script>

<template>
<form class="uk-grid-small" uk-grid>
  <div class="uk-width-1-2">
    <label class="uk-form-label">Name</label>
      <input class="uk-input" type="text" placeholder="Report Name" v-model="report.name">
    </div>
    <div class="uk-width-1-2@s">
    <label class="uk-form-label">Type</label>
      <select class="uk-select" v-model="selectedFileType">
      <option
        v-for="type in sheetFileTypes"
        :value="type"
        >{{ type.file }}: {{ type.Description }} </option>
      <option>Option 02</option>
    </select>
    </div>
    <div class="uk-width-1-4@s">
    <div class="uk-margin">
      <label><input class="uk-checkbox" type="checkbox"
                    v-model="downloadAutomatically"> Download Automatically?</label>
    </div>
    </div>
    <div class="uk-width-1-4">

  <button class="uk-button" type="button" @click="runReport()"> Run </button>
    </div>

    <div class="uk-width-1-2" v-if="reportValue">
      Done! {{ reportValue.results.length }} rows.
    <div class="uk-button-group">

      <button v-if="!downloadAutomatically"
              class="uk-button" type="button" @click="runReport()"> Download </button>&nbsp;
  <button class="uk-button" type="button" @click="showModal($refs.modal)"> View </button>
    </div>
    </div>
</form>
<div
    ref="modal" class="uk-modal-full report-result-modal"
    uk-modal>
    <div class="uk-modal-dialog" ref="md" uk-height-viewport>
      <button
        class="uk-modal-close-full uk-close-large"
        type="button" uk-close></button>
    <ClusterizeResult v-if="isModalVisible" :result="reportValue" />
    </div>
  </div>


</template>

<style>
  .report-result-modal {
    position:absolute;
    top:0;
  }
  .report-result-modal .clusterize-scroll{
    max-height: 95vh;
    max-width: 99vw;
    overflow: auto;
  }
  .report-result-modal .clusterize .uk-table th {
      top: -1em;
      backround-color: white;
      border: 1px solid grey;
      z-index: 10;
  }
  
  .report-result-modal .uk-close-large {
    color: black;
    opacity: 70%;
    border: 1px solid black;
    padding: 0.5em;
  }
  
</style>
