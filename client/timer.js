var initialSettings = parseInt(localStorage.getItem("TIME_INTERVAL")) || 900000; 
var currMilliseconds = parseInt(localStorage.getItem("TIME_INTERVAL")) || 900000; 
var intervalEnd;
var timer_display;
var audio;
function loopPlayer(){};


function updateTimerDisplay(totalSeconds){
        var minutes = Math.floor(totalSeconds/60);
        if(minutes < 10){minutes = "0"+minutes};
        var seconds = Math.floor(totalSeconds%60);
        if(seconds<10){seconds="0"+seconds};
        document.getElementById("timer-time").innerHTML=
        (minutes + ":" + seconds);

}   
function displayTimer(){
        var seconds_remaining = Math.floor((intervalEnd-new Date())/1000);
        if(seconds_remaining > 0){
            updateTimerDisplay(seconds_remaining);
            currMilliseconds=currMilliseconds-500;
        } else{
                //play song
                loopPlayer(audio);
                setTimer(initialSettings);
                intervalEnd = new Date(new Date().getTime() + (currMilliseconds));
                
        }
}
function startTimer(){
        intervalEnd = new Date(new Date().getTime() + (currMilliseconds));
        timer_display = setInterval(displayTimer, 500);
    //note: the occasional slight lagging can make the timer look like it skips a step, 
    //hence 500 rather than 1000ms
}
function setTimer(time){
        initialSettings = time;
        currMilliseconds = time;
}
function pauseTimer(){
        clearInterval(timer_display);
}
function getCurrentMS(){
        return currMilliseconds;
}
function getInitialMS(){
        return initialSettings;
}
function setSongPlayer(playerFunction, audioElement){
        loopPlayer = playerFunction;
        audio = audioElement;
}

module.exports = {
    updateTimerDisplay,
    startTimer,
    setTimer,
    pauseTimer,
    getCurrentMS,
    getInitialMS,
    setSongPlayer
}
