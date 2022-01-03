import { openDB } from 'idb/with-async-ittr.js';
import { deleteDB, wrap, unwrap } from 'idb';

export var DB;

export async function openHistoryDB() {
    if (DB) return DB;
    const db = await openDB('History', 1, {
        upgrade(db) {
            console.log('Object Store?')
            db.createObjectStore('servers', { keyPath: '$id', autoIncrement: true });
        },
    });
    DB = db;
    return db;
}

export async function getServersHistory() {
    await openHistoryDB();
    const tx = DB.transaction('servers');
    console.log(tx);
    const store = tx.store;
    console.log(store);
    const his = []
    for await (const cursor of tx.store) {
        // console.log('cursor', cursor.value);
        his.push(cursor.value)
    }

    return his;
}


export async function setServersHistoryItem(server) {
    await openHistoryDB();
    return DB.put('servers', server);
}
