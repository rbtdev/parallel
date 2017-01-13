var messenger = require('./messenger');
var child_process = require('child_process');
var os = require('os');
var Events = require('events');
var _ = require('lodash');

messenger.handle(process);
module.exports.apply = function (array, apply, progress) {
    var e = new Events.EventEmitter();

    var numCpus = os.cpus().length;
    console.log("Num Cpus = " + numCpus)
    if (array.length < numCpus) numCpus = array.length;
    var chunkSize = Math.round(array.length / numCpus);
    console.log("Chunk Size = " + chunkSize)
    var chunks = _.chunk(array, chunkSize);
    var done = 0;

    messenger
        .on('done', gotResult)
        .on('progress', gotProgress);

    function gotResult(data, child) {
        //console.log("Got result from " + child)
        done++;
        chunks[data.chunkId] = data.result;
        e.emit('chunk', chunks[data.chunkId]);
        messenger.sendTo(child, 'exit');
        if (done >= chunks.length) {
            e.emit('done', _.flatten(chunks));
        }
    }

    function gotProgress(data) {
        e.emit('progress', progress);
    }

    setImmediate(function () {
        e.emit('start', chunks.length);
        for (var i = 0; i < numCpus; i++) {
            var child = child_process.fork(require.resolve('./child.js'));
            messenger.handle(child);
            messenger.sendTo(child, 'start', {
                chunk: chunks[i],
                chunkId: i,
                f: apply.toString(),
                progress: progress
            })
        }
    });
    return e;

}