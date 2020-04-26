api = require('./api.js');   // AJAX requests to back-end API
form = require('./form.js'); // form submission
page = require('./page.js'); // page display
song = require('./song.js'); // choose next song
timer = require('./timer.js');

$(document).ready(function () {
    // Initializes Materialize components.
    $('.tabs').tabs();
    $('.collapsible').collapsible();

    let timeLeft = localStorage.getItem("TIME_INTERVAL") || 900000; // Defaults to 15 minutes if not previously set.
    let activeInterval = false;
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

    var songTimeout;

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

        // If the interval is already determined, do not set another one.
        if (!activeInterval) {
            timeout();
        }

        page.updatePlayIcon(audioElement);
    });

    // Makes an API request for a new song every timeLeft milliseconds.
    let timeout = () => {
        activeInterval = true;
        songTimeout = setTimeout(function () {
            loopPlayer(audioElement);
        }, timeLeft);
        timer.startTimer();
    }

    $("#start-timer").click(function() {
        timeLeft=timer.getCurrentMS();
        timeout();
    });
    $("#reset-timer").click(function() {
        timeLeft = timer.getInitialMS();
        timer.setTimer(timeLeft);
        timer.pauseTimer();
        document.getElementById("timer-time").innerHTML =
            timer.timeToString(Math.floor(timeLeft/1000));
    });
    $("#stop-timer").click(function() {
        clearTimeout(songTimeout);
        timer.pauseTimer();
    });

    // Makes an AJAX request for a new song and then replaces current song with the response.
    function loopPlayer(audioElement) {
        findNextSongWithPreferences(genrePreferences, decadePreferences);
        // Delay to prevent overlap while changing audio source.
        setTimeout(function () {
            audioElement.play();
        }, 1500);
        timeout();
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

    // Get new song, retaining pause/play state.
    $('#skip').click(function () {
        if (audioElement.paused) {
            findNextSongWithPreferences(genrePreferences, decadePreferences);
        } else {
            audioElement.pause();
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
                timer.setTimer(timeLeft);
            }
        } else {
            timeLeft = radioCheck * 60 * 1000;
            localStorage.setItem("TIME_INTERVAL", timeLeft);
            page.updateIntervalDisplay(timeLeft);
            timer.setTimer(timeLeft);
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
