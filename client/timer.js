let initialSettings, currMilliseconds, intervalEnd;
let timerIsNew = true;
let timer_tick_loop;
let audio, loopPlayer;

// MS per tick of the timer display
// numbers close to 500 or 1000 lead to lagging
// because setInterval is only a minimum request, not a guarante
const TICK_MS = 100;

/* Getters for testing */
function getCurrentMS() {
    return currMilliseconds;
}
function getLoopPlayer() {
    return loopPlayer;
}

/* Helper functions */
function setTimerDisplay (ms) {
    let totalSeconds = Math.floor(ms/1000);
    let minutes = Math.floor(totalSeconds/60);
    let seconds = Math.floor(totalSeconds%60);
    if (minutes < 10) { minutes = "0"+minutes; };
    if (seconds < 10) { seconds="0"+seconds; };
    document.getElementById('timer-time').innerHTML = (minutes + ":" + seconds);
}

/* Interval settings */
function setTimerInterval(ms){
    initialSettings = parseInt(ms);
}
function setSongPlayer(playerFunction, audioElement){
    loopPlayer = playerFunction;
    audio = audioElement;
}

/* Interval controls */
function startTimer() {
    // check if we need to reset currMilliseconds
    // ie on pageload or resetTimer
    if (timerIsNew) {
        currMilliseconds = initialSettings;
        timerIsNew = false;
    }
    intervalEnd = new Date((new Date()).getTime() + currMilliseconds);
    timer_tick_loop = setInterval(tick, TICK_MS);
}
function pauseTimer() {
    clearInterval(timer_tick_loop);
}
function resetTimer() {
    pauseTimer();
    timerIsNew = true;
    setTimerDisplay(initialSettings);
}

/* Core interval loop */
function tick() {
    currMilliseconds = (intervalEnd - new Date());
    if (currMilliseconds > 0){
        setTimerDisplay(currMilliseconds);
    } else {
        loopPlayer(audio); //play song
        resetTimer();
        startTimer();
    }
}


module.exports = {
    setTimerDisplay,
    setTimerInterval,
    setSongPlayer,
    startTimer,
    pauseTimer,
    resetTimer,
    
    // for tests
    getCurrentMS,
    getLoopPlayer
}
