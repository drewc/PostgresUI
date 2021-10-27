import { get } from 'axios'
import { api, pgAPI, post } from "./pgAPI"
import { ref } from 'vue'


export function pgLogin (host, port,username, passwd = false, db = username) {
    let loginData = {
        host: host,
        port: port,
        user: username,
        passwd: passwd,
        db: db
    };
    console.log('Trying pgLogin', loginData)
    return post('pgLogin', loginData)
        .then(res => {
            console.warn("Login Success?", res)
            delete loginData.passwd;
            api.setServersHistoryItem(loginData)
            loginData.uuid = res.data.uuid;
            api.servers.push(loginData);
            return loginData;
        })
        .catch(e => {
            if (e.response && e.response.data) {
                console.log('pgLogin error: ', e.response.data.error) ;
                return e.response.data
            }  else { throw(e) }
        })
};

pgAPI.pgLogin = pgLogin;

export default {
    api, pgLogin
}
