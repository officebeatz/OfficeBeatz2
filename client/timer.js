
var initialSettings = 900000;
var currMilliseconds = 900000;
var intervalEnd;
var timer_display;

function timeToString(totalSeconds){
        var hours = Math.floor(totalSeconds/3600);
        if(hours < 10){hours = "0"+hours;}
        var minutes = Math.floor((totalSeconds%3600)/60);
        if(minutes < 10){minutes = "0"+minutes};
        var seconds = Math.floor(totalSeconds%60);
        if(seconds<10){seconds="0"+seconds};
        return hours + ":" + minutes + ":" + seconds;
}   
function displayTimer(){
        var seconds_remaining = Math.floor((intervalEnd-new Date())/1000);
        var timer = timeToString(seconds_remaining);
        if(seconds_remaining > 0){
            document.getElementById("timer-time").innerHTML = timer;
            currMilliseconds=currMilliseconds-500;
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
module.exports = {
    timeToString,
    startTimer,
    setTimer,
    pauseTimer,
    getCurrentMS,
    getInitialMS
}