var messenger = require('./messenger');

messenger.handle(process);
messenger
    .on('start', start)
    .on('exit', process.exit)

function start(data) {

    var result = [];
    var f = new Function('return ' + data.f)();
    var processed = 0;
    data.chunk.forEach(function (el, index) {
        result.push(f(el));
        if (!(index % data.progress)) {
            messenger.send('progress')
        }
    })

    messenger.send('done', {
        chunk: data.chunkId,
        result: result
    })
}