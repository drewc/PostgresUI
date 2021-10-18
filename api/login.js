import { get } from 'axios'
import { api, pgAPI, post } from "../js/pgAPI"
import { ref } from 'vue'


export function pgLogin (host, port,username, passwd = false, db = username) {
    let loginData = {
        host: host,
        port: port,
        user: username,
        passwd: passwd,
        db: db
    };
    console.log('pgLogin', loginData)
    return post('pgLogin', loginData)
        .then(res => {
            delete loginData.passwd;
            api.setServersHistoryItem(loginData)
            loginData.uuid = res.data.uuid;
            api.servers.push(loginData);
            return loginData;
        })
        .catch(e => {
            if (e.response) {
                console.log('pgLogin error: ', e.response.data.error) ;
                return e.response.data
            }  else { throw(e) }
        })
};

pgAPI.pgLogin = pgLogin;

export default {
    api, pgLogin
}
