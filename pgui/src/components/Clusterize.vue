<script setup>
  //import  { Clusterize } from '../../../clusterize-es6/dist/clusterize.es.js'
  import  Clusterize  from 'clusterize.js'
  // import foo from '/src/clusterize/clusterize.cjs'
  import { onMounted, onUpdated, getCurrentInstance, ref } from 'vue'

  // const Clusterize = window.Clusterize;

  const self =  getCurrentInstance();

  const props = defineProps({
    headers: Array,
    cluster: Array,
    caption: String
  })

  // console.log("Setup", props.headers, props.cluster)

  let clusterObject ;

  function makeTR(row) {
    let tr = '<tr>'
    if (Array.isArray(row)) {
     for (var col in row) {
        tr = tr + '<td class="uk-table-shrink">' + row[col] + '</td>'
     }
    } else {

      tr = tr + '<td class="uk-table-shrink">' + row + '</td>'

    }

    // console.warn("new row!", tr)

    return tr + '</tr>'
  }

  const rows = ref();

  function rowCount() {
     rows.value = clusterObject ? clusterObject.getRowsAmount() : null;
    }

  onUpdated(() => {
     // console.log('updated!', props.headers, props.cluster, clusterObject)
     clusterObject.update(props.cluster.map(makeTR))
    rowCount();
  })

 onMounted(() => {
  const sa = self.refs.scrollArea, ca = self.refs.contentArea;

  console.log("New Cluster", props.cluster, props.headers)

   clusterObject =  new Clusterize({
   rows: props.cluster.map(makeTR),
   scrollElem: sa,
   contentElem: ca
 });
  rowCount();
  console.warn('Cluster Mounted!', self, sa, ca)

})

</script>
<template>
<div class="clusterize-panel">
<div class="clusterize">
  <div ref="scrollArea" class="clusterize-scroll">
  <table class="uk-table uk-table-small uk-table-divider ">
      <caption v-if="caption"> <code> {{ caption }} </code> </caption>
      <thead> <tr> <th v-for="h in headers" key="h"> {{ h }} </th> </tr> </thead>
      <tbody ref="contentArea" class="clusterize-content">
        <tr class="clusterize-no-data">
          <td>Loading data…</td>
        </tr>
      </tbody>
    </table>
  </div>
  <span class="label alert radius rows-amount-helper">Rows: {{ rows }}</span>
 </div>



</div>
</template>

<style src="clusterize.js/clusterize.css"></style>
<style>
.clusterize-panel {
  position: relative;
  margin-top: 0.5em;
  border-radius: 0.3em;
  padding:0.3em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border: 1px solid #BBB;
}

.clusterize .uk-table {
   margin-bottom: 0.5em;
}
.clusterize .uk-table th {
    padding: 1em 0.5em;
    color: #333;
    position: -webkit-sticky;
    position: sticky;
    top: 3em;
    border-left: 1px solid #eee;
    border-bottom: 1px solid #ddd;
    font-size: 13px;
    text-align: center;
    z-index: 6;
    background: #fff;
}

.clusterize .uk-table td {
  z-index: 10
}

.clusterize .uk-table caption {
 max-height: 3em;
 overflow: auto;
 margin-bottom: 0.5em;
 background: #fff;
 border-radius: 0.3em;
 padding:0.3em;
 position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
    z-index: 5;
    color: #878686;
      opacity: 0.8;
    position: -webkit-sticky;
    position: sticky;
 }
.clusterize code {
 white-space: pre-wrap;
 background: #fff;
 padding: 0.5em;
}


.rows-amount-helper {
    position: absolute;
    bottom: -0.75em;
    right: 28px;
    z-index: 7;
    color:black;
    border-radius: 3px;
    background: #fff;
 padding:0.3em;
}
 </style>
