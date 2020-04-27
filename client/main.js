api = require('./api.js');   // AJAX requests to back-end API
form = require('./form.js'); // form submission
page = require('./page.js'); // page display
song = require('./song.js'); // choose next song
//timer = require('./timer.js');
$(document).ready(function () {

    //timer components
    var initialSettings = parseInt(localStorage.getItem("TIME_INTERVAL")) || 900000; 
    var currMilliseconds = parseInt(localStorage.getItem("TIME_INTERVAL")) || 900000; 
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
        } else{
                //play song
                loopPlayer(audioElement);
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

    // Initializes Materialize components.
    $('.tabs').tabs();
    $('.collapsible').collapsible();
    let timeLeft = localStorage.getItem("TIME_INTERVAL") || 900000; // Defaults to 15 minutes if not previously set.
    let audioElement = $('#audioSource')[0]; // jQuery syntax to grab the first child of the audio object.
    let volumeControl = $('.volSlider');
    let tempVol = 50;
    let genreList;
    let genres = []
    let genrePreferences = [];
    let decadePreferences = [];

    let settingsDisplay = $('#advSetForm');
    let stopDisplay = $('#stop-timer');
    let startDisplay = $('#start-timer');
    let volumeDisplay = $('#vol-control');
    let titleDisplay = $('#current-song-display');


    document.getElementById("timer-time").innerHTML =
            timeToString(Math.floor(timeLeft/1000));

    try {
        genrePreferences = JSON.parse(localStorage.getItem("GENRE_PREFERENCES"));
    } catch (error) {

    }

    try {
        decadePreferences = JSON.parse(localStorage.getItem("DECADE_PREFERENCES"));
    } catch (error) {

    }

    api.getGenres().then((result) => {
        genreList = result;
        console.log(genreList.counts);
        for (let key in genreList.counts) {
            genres.push(key);
        }
        //This iterates through the genre stuff, add in making checkboxes out of this later~
        for (let i = 0; i < genres.length; i++) {
            console.log(genres[i] + ": " + genreList.counts[genres[i]]);
        }
        findNextSongWithPreferences(genrePreferences, decadePreferences)
    });

    // Updates entries requiring timeLeft
    page.determineRadioButton(timeLeft);
    page.determineCheckboxes(genrePreferences);
    page.determineDecadeInputs(decadePreferences);
    page.updateIntervalDisplay(timeLeft);
    page.updateGenreDisplay(genrePreferences);
    page.updateDecadeDisplay(decadePreferences);
    page.allSelectedOrNot();

    $('#play').click(function () {
        // Updates autoplay after an action has taken place.
        audioElement.autoplay = true;

        if(audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }


        page.updatePlayIcon(audioElement);
    });


    $("#start-timer").click(function() {
        timeLeft=getCurrentMS();
        startTimer();
    });
    $("#reset-timer").click(function() {
        timeLeft = getInitialMS();
        setTimer(timeLeft);
        pauseTimer();
        document.getElementById("timer-time").innerHTML =
            timeToString(Math.floor(timeLeft/1000));
    });
    $("#stop-timer").click(function() {
        pauseTimer();
    });

    // Makes an AJAX request for a new song and then replaces current song with the response.
    function loopPlayer(audioElement) {
        findNextSongWithPreferences(genrePreferences, decadePreferences);
        // Delay to prevent overlap while changing audio source.
        setTimeout(function () {
            audioElement.play();
        }, 1500);
    }

    $('#mute').click(function () {
        if (audioElement.volume != 0) {
            volumeControl.val(0);
            audioElement.volume = 0;
        } else {
            audioElement.volume = tempVol / 100;
            volumeControl.val(tempVol);
        }

        page.updateVolIcon(audioElement);
    });


    $('#pop-settings').click(function () {
        let shown = settingsDisplay[0].style["display"];
        if (shown == "none") {
            settingsDisplay[0].style["display"] = "block";
        } else {
            settingsDisplay[0].style["display"] = "none";
        }
    });

    $('#start-timer').click(function () {

        let shown = startDisplay[0].style["display"];

        if (shown == "none") {
            startDisplay[0].style["display"] = "inline-block";
            stopDisplay[0].style["display"] = "none";
        } else {
            startDisplay[0].style["display"] = "none";
            stopDisplay[0].style["display"] = "inline-block";
        }
    });


    $('#stop-timer').click(function () {

        let shown = startDisplay[0].style["display"];

        if (shown == "none") {
            startDisplay[0].style["display"] = "inline-block";
            stopDisplay[0].style["display"] = "none";
        } else {
            startDisplay[0].style["display"] = "none";
            stopDisplay[0].style["display"] = "inline-block";
        }
    });

    $('#reset-timer').click(function (){
        startDisplay[0].style["display"] = "inline-block";
        stopDisplay[0].style["display"] = "none";
    });

    $('#vol-change').click(function () {

        let shown = volumeDisplay[0].style["display"];
        if (shown == "none") {
            volumeDisplay[0].style["display"] = "inline-block";
            titleDisplay[0].style["display"] = "none";
        } else {
            volumeDisplay[0].style["display"] = "none";
            titleDisplay[0].style["display"] = "inline-block";
        }
    });

    //Updates volume when slider is changed.
    $('#vol-control').on("input change", function () {
        tempVol = this.value;
        audioElement.volume = this.value / 100;

        page.updateVolIcon(audioElement);
    });

    //Loads up a new song if a song is already playing, otherwise does nothing.
    $('#skip').click(function () {
        if (!audioElement.paused) {
            findNextSongWithPreferences(genrePreferences, decadePreferences);
            audioElement.play();
        }
    });

    // Submits and updates interval between songs.
    $("#advancedSettingsForm").submit(function (event) {
        event.preventDefault();
        intervalHandler();
        let formSubmission = form.submitForm(genreList);
        if (formSubmission.isValid) {
            genrePreferences = formSubmission.genrePreferences;
            decadePreferences = formSubmission.decadePreferences;
            page.updateGenreDisplay(genrePreferences);
            page.updateDecadeDisplay(decadePreferences);
            localStorage.setItem("GENRE_PREFERENCES", JSON.stringify(genrePreferences));
            localStorage.setItem("DECADE_PREFERENCES", JSON.stringify(decadePreferences));
            findNextSongWithPreferences(genrePreferences, decadePreferences);
        }
    });

    /**
     * Makes a post request to get the next song based on preferences.
     * It works even if the preferences are null.
     * @param {*} genreArray
     * @param {*} decadeArray
     */
    function findNextSongWithPreferences(genreArray, decadeArray) {
        nextSong = song.chooseNextSongWithPreferences(genreList, genreArray, decadeArray);
        page.updateSongDisplay(nextSong.title, nextSong.artist);
        // post request to /api/song in the headers make a tag called song, put name there
        api.getSongFile(nextSong.fileName).then((songFile) => {
            audioElement.src = songFile;
        });
    }

    function intervalHandler() {
        let radioCheck = $('input[name=intervalGroup]:checked', '#advancedSettingsForm').val();
        if (radioCheck == 'custom') {
            let customValue = $('#customIntervalValue').val();
            if (customValue < 1 || customValue > 120) {
                event.preventDefault();
                console.error("Custom intervals must be between 1 and 120 minutes.");
            } else {
                timeLeft = customValue * 60 * 1000;
                localStorage.setItem("TIME_INTERVAL", timeLeft);
                page.updateIntervalDisplay(timeLeft);
                setTimer(timeLeft);
            }
        } else {
            timeLeft = radioCheck * 60 * 1000;
            localStorage.setItem("TIME_INTERVAL", timeLeft);
            page.updateIntervalDisplay(timeLeft);
            setTimer(timeLeft);
        }
    }

    $("#selectBox").change(function () {
        if (this.checked) {
            $(".genreGroup").each(function () {
                this.checked = true;
            });
        } else {
            $(".genreGroup").each(function () {
                this.checked = false;
            });
        }
    });

    $(".genreGroup").click(function () {
        if ($(this).is(":checked")) {
            page.allSelectedOrNot();
        }
        else {
            $("#selectBox").prop("checked", false);
        }
    });

});
