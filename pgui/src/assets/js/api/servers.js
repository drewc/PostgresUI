export function Server(obj) {
 Object.assign(this, obj);
}

export function pguiServer(obj) {
 Server.call(this, obj);
}
pguiServer.prototype = Object.create(Server.prototype);
pguiServer.prototype.constructor = Server;

export function pgServer(obj) {
 Server.call(this, obj);
}
pgServer.prototype = Object.create(Server.prototype);
pgServer.prototype.constructor = Server;

export default { Server, pgServer, pguiServer }
