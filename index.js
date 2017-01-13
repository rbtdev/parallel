var parallel = require('./parallel');
var ProgressBar = require('ascii-progress');


var arr = []
for (var i = 0; i < 1000000; i++) {
    arr.push(i);
}
var startTime;
var endTime;
var delay = 100000;
var progress = 1000;
console.log("Array length = " + arr.length)

parallel.apply(arr, apply, progress)
    .on('start', gotStart)
    .on('progress', gotProgress)
    .on('done', gotEnd)
    .on('error', gotError);

function apply(el) {
    for (var i = 0; i < 100000; i++) {}; // add long blocking delay
    return (el * 2);
}

function gotStart(count) {
    startTime = new Date();
    console.log("Processing %d chunks", count);
    bar = new ProgressBar({
        schema: ':bar',
        total: arr.length / progress
    });
}

function gotProgress(count) {
    //process.stdout.write('.');
    bar.tick();
}

function gotEnd(results) {
    var stopTime = new Date();
    var delta = stopTime - startTime;
    //console.log("results = " + results)
    console.log((delta / 1000).toFixed(3) + "sec");
}

function gotError(error) {
    console.log(error)
}