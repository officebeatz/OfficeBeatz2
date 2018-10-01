const play = require('audio-play');
const load = require('audio-loader');
var utils= require('./utils')
//Starts up the player.
exports.audioPlay=async function() {
    load(utils.getRandomFile()).then(function (buffer) {
        play(buffer)
    })
   // await sleep(2700000)
   await sleep(300000)
}

//Sleep function, waits for given amount of milliseconds.
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
