<script setup>
import { ref } from 'vue'

const props = defineProps({
    setValue: String
})



</script>
<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/sql/sql.js'

console.log('wincode', CodeMirror, CodeMirror.prototype)

CodeMirror.prototype.lastTrimmedLine = function (linenum) {
    const num = linenum !== undefined ? linenum : this.lastLine();
    const l = this.getLine(num).trim();
    if (num == 0) { return l };
    if (l === "") {
        return this.lastTrimmedLine(num - 1)
    } else {
     return l
}
}


CodeMirror.prototype.lastChar  = function (linenum) {
 return this.lastTrimmedLine(linenum).slice(-1);
}



 export default {
  name: 'CodeMirror',
  methods: {
     mirrorEvents(events = ["change", "changes"]) {

    events.forEach(e => { this.codemirror.on(e, (...args) => {
        this.$emit(e, args);
        })
    })

 },
      initialize() {
        //const cmOptions = Object.assign({}, this.globalOptions, this.options)
          console.log('Init Codemirror')
          this.codemirror = CodeMirror.fromTextArea(
              this.$refs.textarea,
              { mode: "sql",
                viewportMargin: Infinity
              })

          }
        },
  mounted() {
      this.initialize()
      this.mirrorEvents()
      this.$emit('init', this.codemirror)
    },
 }
</script>
<template>
  <textarea ref="textarea">{{ setValue ? setValue : 'SELECT * from claim limit 127;' }}</textarea>
</template>

<style src="codemirror/lib/codemirror.css"></style>
<style>
.CodeMirror {
    height:auto
}
</style>
