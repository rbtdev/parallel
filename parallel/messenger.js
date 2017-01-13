var events = require('events');
var util = require('util');

function Messenger() {
    events.EventEmitter.call(this);
    this.processes = {};
}

util.inherits(Messenger, events.EventEmitter);

Messenger.prototype.send = function (event, data) {
    process.send({
        event: event,
        data: data,
        pid: process.pid
    })
}

Messenger.prototype.sendTo = function (to, event, data) {
    this.processes[to.pid].send({
        event: event,
        data: data,
        pid: process.pid
    })
}

Messenger.prototype.handle = function (proc) {
    var _this = this;
    this.processes[proc.pid] = proc;
    this.processes[proc.pid].on('message', function (message) {
        _this.emit(message.event, message.data, _this.processes[message.pid])
    })
}

module.exports = new Messenger();