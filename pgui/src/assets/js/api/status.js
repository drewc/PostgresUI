import { post } from "./axios"
import { pgServer } from "./servers"

export function server (srv) {
    return post('status', srv).then(e => e.data);

};

pgServer.prototype.status = function () {
    return server(this);
}

export default {
    server
}
