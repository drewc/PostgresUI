import { get as aget, post as apost} from 'axios'

export function get (api, args) {
    let uri = "/api/" + api
    return aget(uri, args);
};

export function post (api, args) {
    let uri = "/api/" + api
    return apost(uri, args);
};


export default { get, post }
