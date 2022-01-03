import { get, post } from './axios.js'

export const reportInterface = {
    query: String,
    name: String,
    description: String,
    filename: String,
    sheetnames: Array
}

export function Report(r) {
    Object.assign(this, r);
     for (const prop in r) {
        if(!reportInterface[prop]) {
            throw "Property not allowed in Report constructor: " + prop
        }
    }

    for (const prop in reportInterface) {
        if(!this[prop]) {
            throw "Report must have a property named"+ prop
        }
    }
}

Report.prototype.save = function() {
    return post('save-report', this).then(r => r.data);
}
