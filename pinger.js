'use strict';

var INTERVAL = 1000;		// 1 ping per second
var DELAY = 2000;    		// wait 2s otherwise error
var MAX_DELAY = 500;		// barrier
var WINDOW = 10;    		// Window length for sliding mean
var URL = "ya.ru";

var pinger = require('net-ping').createSession({timeout: DELAY});
var cbuf = require('CBuffer')(WINDOW).fill(0);
var clc = require('cli-color');
var dns = require('dns');

var intel = require('intel');
intel.addHandler(new intel.handlers.File('pinger.log'));

var curMean = 0;			// current sliding mean

cbuf.overflow = function (newData) {
    curMean -= newData;  // substract first element
};

dns.lookup(URL, function (err, address) {
    if (err) {
        console.log(err);
    }
    else {
        runPinger(address);
    }
});

process.stdout.pipe(require('fs').createWriteStream('pinger.log', {flags: 'a'}));

var counter = 0,
    problemFlag = false;

function runPinger(address) {

    setInterval(
        function () {
            pinger.pingHost(address, function (error, target, sent, rcvd) {
                var delta, msg;
                if (error) {
                    delta = 2000;
                    cbuf.push(delta / WINDOW);
                    curMean += delta / WINDOW;
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write('Error: ' + clc.red(error) + ' avg: ' + Math.round(curMean) + ' ms');
                }
                else {
                    delta = rcvd - sent;
                    cbuf.push(delta / WINDOW);
                    curMean += delta / WINDOW; // add last element
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    delta < MAX_DELAY ? msg = clc.green(delta) : msg = clc.red(delta);
                    process.stdout.write('Success: ' + msg + ' ms,  avg.: ' + Math.round(curMean) + ' ms');
                }

                if (curMean > MAX_DELAY) {
                    counter += 1;
                }
                else if (counter > 0) {
                    counter -= 1;
                }

                counter > WINDOW ? startRegister(rcvd) : stopRegister(rcvd);
            });
        }, INTERVAL);
}

function startRegister(rcvd) {
    if (problemFlag) {
        return;
    } // already registering

    intel.info('problems started at: ' + rcvd);
    problemFlag = true;
}

function stopRegister(rcvd) {
    if (!problemFlag) {
        return;
    }
    intel.info('problems stopped at: ' + rcvd);
    problemFlag = false;
}