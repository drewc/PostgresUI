import { get as aget } from 'axios';
import { post as apost } from 'axios';
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

export const api = reactive(pgAPI);
pgAPI.api = api;



export const servers = ref(getServersHistory().map(s => new pgServer(s)));

api.servers = servers;

export default pgAPI;
