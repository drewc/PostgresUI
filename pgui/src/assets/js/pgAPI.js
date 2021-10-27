import { get as aget, post as apost} from 'axios'
import { reactive, ref } from 'vue';

import { getServersHistory, setServersHistoryItem  } from './history'

export const version = 0.1

export const get = aget;
export function post (api, args) {
    let uri = "/api/" + api
    // console.log('Post:', uri, args)
    return apost(uri, args);
};


export function isServerLive(server) {
    return server.hasOwnProperty('uuid');
}

export function pgServer(args) {
    Object.assign(this, args)
}

pgServer.prototype.isLive = function() { return isServerLive(this); }

export const pgAPI = {
    version, get, post, ref,
    getServersHistory, setServersHistoryItem,
    isServerLive, pgServer

}


export function SqlStatement(obj) {
    Object.assign(this, obj);
};

SqlStatement.prototype.isPrepared = function () {
    return typeof this.name === "string"
}

SqlStatement.prototype.prepare = function (obj) {
   Object.assign(this, obj);
    console.log('Prepping', this)
    if (this.isPrepared()) {
        return new Promise((resolve, reject) => { resolve(this) });
    } else {
        return pgAPI.post('prepare', this).then(e => {
            console.log('SqlStatement was prepped', e)
            Object.assign(this, e.data)
            return this
        })
    }
};

SqlStatement.prototype.query = function (obj) {
    Object.assign(this, obj)
    if (this.isPrepared()) {
        return pgAPI.post('query', this).then(q => {
            const res = Object.assign(Object.create(this), q.data)
            console.log('Query Results:', res)
            return res;
        })
    
    } else {
        return this.prepare(obj).then(stmt => this.query(stmt))
    }       
}

pgAPI.SqlStatement = SqlStatement;
export const api = reactive(pgAPI);
pgAPI.api = api;

export const servers = ref(getServersHistory().map(s => new pgServer(s)));

api.servers = servers;




export default pgAPI;
