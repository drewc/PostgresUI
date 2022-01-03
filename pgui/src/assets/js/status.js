import { get } from 'axios'
import { api, pgAPI, post } from "./pgAPI"
import { ref } from 'vue'


export function server (srv) {

    return post('status', srv);

};

pgAPI.serverStatus = server;

export default {
    api, server
}
