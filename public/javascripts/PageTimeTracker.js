//Written by Alex Amin Zamani on Nov 16, 2020

function updatePageViewTime (timeSpent) {
    return $.ajax({
        url: '/api/timing',
        data: null,
        headers: {
            'timeSpent': timeSpent
        },
        type: "POST",
        success: function (responseData) {
            //Do nothing
        }, error: console.error
    })
}

/*
TimeMe.initialize({
    currentPageName: "homePage",
    idleTimeoutInSeconds: -1,
});
*/
var PLEASE_DO_NOT_TOUCH_THIS_VAR = new Date();
console.log("initialized");
var isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) ||navigator.userAgent.match(/iPod/i);
var eventName = isOnIOS ? "pagehide" : "beforeunload";

var socket = io.connect();
socket.on('connect', function(){
    console.log("CONNECTED");
});
/*
socket.on('disconnect', function(){
    updatePageViewTime((new Date() - PLEASE_DO_NOT_TOUCH_THIS_VAR)/1000);
    //TimeMe.resetAllRecordedPageTimes();
    PLEASE_DO_NOT_TOUCH_THIS_VAR = new Date();
});
*/

/*
window.addEventListener(eventName, function (event) {
    var message = 'Are you sure you want to leave or refresh?';
    if (typeof event == undefined)
        event = window.event;
    if (event) event.returnValue = message;
    //var timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
    updatePageViewTime((new Date() - PLEASE_DO_NOT_TOUCH_THIS_VAR)/1000);
    //TimeMe.resetAllRecordedPageTimes();
    PLEASE_DO_NOT_TOUCH_THIS_VAR = new Date();
    return message;
});
*/