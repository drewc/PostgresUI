<script setup>
import XLSX from 'xlsx'
import Clusterize from './Clusterize.vue'

const props = defineProps({
    result: Object
})

function resultHeaders(res = props.result) {
    return res.columns.map(c => c[0])
}

console.log("result", props.result);

function resultRows(res = props.result) {
    return res.results.map(a => Array.isArray(a) ? a : [a])
}

function resultQuery(res = props.result) { return res.text }

var sheetname = 'Database-Report'

function makeSheetBook(res = props.result, name = sheetname) {
 const wb = XLSX.utils.book_new();

 const ws = XLSX.utils.aoa_to_sheet([
     resultHeaders(res),
     ...resultRows(res)
  ]);

    XLSX.utils.book_append_sheet(wb, ws, name);


    window.foo = wb;

    return wb;

}





function makeAndDownloadSheetBook(res = result.value, name = sheetname) {

     const book = makeSheetBook(res, name)

     XLSX.writeFile(book, name + ".xlsb", {compression:true});

}


</script>

<template>
  <div>
    <button class="uk-button uk-button-default sql-menu-button" type="button"><span uk-icon="table"></span></button>
<div uk-dropdown>
    <ul class="uk-nav uk-dropdown-nav">
        <li class="uk-nav-header">Spreadsheet</li>
        <li>Name: <input v-model="sheetname" /> </li>
        <li>
          <button
            type="button"
            @click="makeAndDownloadSheetBook(result, sheetname)">
            Download </button></li>

        <li><a href="#">Item</a></li>
        <li class="uk-nav-divider"></li>
        <li><a href="#">Item</a></li>
    </ul>
</div>
<Clusterize
  :headers="resultHeaders(result)"
  :cluster="resultRows(result)"
  :caption="resultQuery(result)"
  />
</div>
</template>

<style>
  .sql-menu-button {
    float: right;
     opacity:50%;
     line-height: 0;
     padding:0;
     position: relative;
     top: 0.9em;
     right: 1.9em;
     border: 1px solid white;
     z-index: 1025;
  }
  .sql-menu-button:hover {
    opacity: 100
  }
 </style>
