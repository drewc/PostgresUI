import { get as aget, post as apost} from './api/axios'
import { pgServer as _pgServer} from './api/servers'
import { Report } from './api/report'
export { Report };
import "./api/status"
import { reactive, ref } from 'vue';

import { getServersHistory,
         setServersHistoryItem,
         openHistoryDB,
         DB } from './history'

export function historyDB() { return DB; }

export const version = 0.1

export const get = aget;
export const post = apost;

export const resultCache = []

export function isServerLive(server) {
    return server.hasOwnProperty('uuid');
}

export const pgServer = _pgServer
pgServer.prototype.isLive = function() { return isServerLive(this); }

export const pgAPI = {
    version, get, post, ref,
    getServersHistory, setServersHistoryItem, historyDB,
    isServerLive, pgServer,
    resultCache, Report

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

SqlStatement.prototype.columnHeaders = function () {
        return this.columns.map(c => c[0])
}

SqlStatement.prototype.resultRows = function () {
    return this.results.map(a => Array.isArray(a) ? a : [a])
}

pgAPI.SqlStatement = SqlStatement;
export const api = reactive(pgAPI);
pgAPI.api = api;


export const servers = ref([]);

export function serverStatus (srv) {

    return post('status', srv);

};

pgAPI.serverStatus = serverStatus;

const serversHistory = []

        // await getServersHistory() .then(h => h.map(s => new pgServer(s)));

export async function liveServers() {
    const lv = []
    await openHistoryDB();
    console.log("Have HistoryDB", DB);
    await getServersHistory()
        .then(h => h.map(s => serversHistory.push(new pgServer(s))));
    await Promise.all(serversHistory.map(async (s) => {
        // console.log("Find server status ", s);
        const st = await pgAPI.serverStatus(s)
        //console.log("Found server status ", st);
        if (st.data && st.data.connected) {
            lv.push(s)
        }

    }));
    servers.value = lv
    console.log('Set SErvers, ', currentServer(), servers.value)
    return lv;
}

pgAPI.liveServers = liveServers;



export function currentServer() {
  return servers.value && servers.value.length > 0 ? servers.value.slice(-1)[0] : false;
}

pgAPI.currentServer = currentServer;


api.servers = servers;






export default pgAPI;
