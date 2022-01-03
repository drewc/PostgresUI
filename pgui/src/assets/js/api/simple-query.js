import { post } from './axios'
import XLSX from 'xlsx'

export function SQLCommand(cmd) {
    Object.assign(this, { type: "command", complete: false }, cmd)
}


export function SQLStatement(stmt) {
    Object.assign(this, { type: "statement", complete: false }, stmt)
}

SQLStatement.prototype = Object.create(SQLCommand.prototype);
SQLStatement.prototype.constructor = SQLStatement;

export function SQLQuery(str) {
    SQLCommand.call(this, { string: str, type: "query" })
}

SQLQuery.prototype = Object.create(SQLCommand.prototype);
SQLQuery.prototype.constructor = SQLQuery ;

SQLQuery.prototype.run = function(server) {
    this.server = server;
    const self = this;
    return post('simple-query', this)
        .then(res => {
            const data = res.data
            self.complete = data.results.map(r => r.complete)
            this.results = data.results.map(r => {
                if (r.type === 'statement') {
                    return new SQLStatement(r)
                } else return new SQLCommand(r)
            })
            this.notices = data.notices
            console.log('simple query run:', data)
            return data;
        })
}

SQLCommand.prototype.sheetHeaders = function() { return [] };
SQLCommand.prototype.sheetRows = function() { return [] };
SQLCommand.prototype.sheetName = false;
SQLCommand.prototype.makeSpreadSheet = function() { return false };
SQLCommand.prototype.isSpreadSheet = false;


SQLStatement.prototype.isSpreadSheet = true;
SQLStatement.prototype.sheetHeaders = function() {
    return this.columns ? this.columns.map(c => c[0]) : []
}

SQLStatement.prototype.sheetRows = function() {
    return this.rows.map(a => Array.isArray(a) ? a : [a])
}

SQLStatement.prototype.makeSpreadSheet = function() {
    return XLSX.utils.aoa_to_sheet([this.sheetHeaders(), ...this.sheetRows()])
};

SQLQuery.prototype.makeWorkBook = function(names = []) {
    const sheets = this.results.map(s => s.makeSpreadSheet()).filter(s => s)
    const book = XLSX.utils.book_new();
    for (const n in sheets) {
        XLSX.utils.book_append_sheet(
            book, sheets[n], names[n] || ("Sheet " + (n + 1)));
    }
    return book;
}

SQLQuery.prototype.writeFile = function(conf = {
    name: "Spreadsheet-" + new Date()
}) {
     XLSX.writeFile(this.makeWorkBook(), conf.name + ".xlsb", {compression:true});
}
