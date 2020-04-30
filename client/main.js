api = require('./api.js');   // AJAX requests to back-end API
form = require('./form.js'); // form submission
page = require('./page.js'); // page display updates
song = require('./song.js'); // choose next song
timer = require('./timer.js'); // handles interval timer
clicks = require('./clicks.js'); // on-click functionality of elements

$(document).ready(function () {

    // Initializes Materialize components.
    $('.tabs').tabs();
    $('.collapsible').collapsible();
    // Make the corner logo also work as the 'Home' tab
    $('#clickable-home').click(function() {
        $('.tabs').tabs('select', 'home');
    });

    let timeInterval = parseInt(localStorage.getItem("TIME_INTERVAL")) || 900000; // Defaults to 15 minutes if not previously set.
    let audioElement = $('#audioSource')[0]; // jQuery syntax to grab the first child of the audio object.
    let volumeControl = $('.volSlider');
    let tempVol = 50;
    let genreList;
    let genres = []
    let genrePreferences = [];
    let decadePreferences = [];
    try {
        genrePreferences = JSON.parse(localStorage.getItem("GENRE_PREFERENCES"));
        decadePreferences = JSON.parse(localStorage.getItem("DECADE_PREFERENCES"));
    } catch (error) { }

    let settingsElement = $('#advSetForm');
    let stopButton = $('#stop-timer');
    let startButton = $('#start-timer');
    let volumeButton = $('#vol-control');
    let titleDisplay = $('#current-song-display');
    let blueGearIcon = $('#settings-icon-blue');
    let grayGearIcon = $('#settings-icon-grey');

    // Load initial song
    api.getGenres().then((result) => {
        genreList = result;
        findNextSongWithPreferences(genrePreferences, decadePreferences)
    });

    // Initialize dynamic page displays
    page.determineRadioButton(timeInterval);
    page.determineCheckboxes(genrePreferences);
    page.determineDecadeInputs(decadePreferences);
    page.updateIntervalDisplay(timeInterval);
    page.updateGenreDisplay(genrePreferences);
    page.updateDecadeDisplay(decadePreferences);
    page.allSelectedOrNot();



    /* HELPER FUNCTIONS */

    // Makes an AJAX request for a new song and then replaces current song with the response.
    function loopPlayer(audioElement) {
        findNextSongWithPreferences(genrePreferences, decadePreferences);
        // Delay to prevent overlap while changing audio source.
        setTimeout(function () {
            audioElement.play();
            page.updatePlayIcon(audioElement);
        }, 1500);
    }
    // Makes a post request to get the next song based on preferences.
    // It works even if the preferences are null.
    function findNextSongWithPreferences(genreArray, decadeArray) {
        nextSong = song.chooseNextSongWithPreferences(genreList, genreArray, decadeArray);
        page.updateSongDisplay(nextSong.title, nextSong.artist);
        // post request to /api/song in the headers make a tag called song, put name there
        api.getSongFile(nextSong.fileName).then((songFile) => {
            audioElement.src = songFile;
        });
    }



    /* TIMER CONTROLS */

    // TIMER SET UP //
    timer.setTimerDisplay(timeInterval);
    timer.setTimerInterval(timeInterval);
    timer.setSongPlayer(loopPlayer, audioElement);

    // TIMER LOGIC //
    $("#start-timer").click(function() {
        timer.startTimer();
    });
    $("#stop-timer").click(function() {
        timer.pauseTimer();
    });
    $("#reset-timer").click(function() {
        timer.resetTimer();
    });

    // TIMER DISPLAY //
    $('#start-timer').click(function () {
        let shown = startButton[0].style["display"];
        if (shown == "none") {
            startButton[0].style["display"] = "inline-block";
            stopButton[0].style["display"] = "none";
        } else {
            startButton[0].style["display"] = "none";
            stopButton[0].style["display"] = "inline-block";
        }
    });
    $('#stop-timer').click(function () {
        let shown = startButton[0].style["display"];
        if (shown == "none") {
            startButton[0].style["display"] = "inline-block";
            stopButton[0].style["display"] = "none";
        } else {
            startButton[0].style["display"] = "none";
            stopButton[0].style["display"] = "inline-block";
        }
    });
    $('#reset-timer').click(function (){
        startButton[0].style["display"] = "inline-block";
        stopButton[0].style["display"] = "none";
    });
    // clear the button highlight after reset is clicked (for readability)
    $("#reset-timer").mouseup(function() { this.blur(); });



    /* SONG CONTROLS */

    // SONG CONTROLS LOGIC //
    $('#play').click(function () {
        audioElement.autoplay = true; // Updates autoplay after an action has taken place.
        if(audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
        page.updatePlayIcon(audioElement);
    });
    $('#skip').click(function () {
        // Get new song, retaining pause/play state.
        if (audioElement.paused) {
            findNextSongWithPreferences(genrePreferences, decadePreferences);
        } else {
            audioElement.pause();
            findNextSongWithPreferences(genrePreferences, decadePreferences);
            audioElement.play();
        }
    });
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

    // SONG CONTROLS DISPLAY
    $('#vol-change').click(function () {
        let shown = volumeButton[0].style["display"];
        if (shown == "none") {
            volumeButton[0].style["display"] = "inline-block";
            titleDisplay[0].style["display"] = "none";
        } else {
            volumeButton[0].style["display"] = "none";
            titleDisplay[0].style["display"] = "inline-block";
        }
    });
    $('#vol-control').on("input change", function () {
        tempVol = this.value;
        audioElement.volume = this.value / 100;
        page.updateVolIcon(audioElement);
    });



    /* SETTINGS / FORM */

    // FORM DISPLAY //
    $('#pop-settings').click(function () {
        // toggle display of settings tab
        let shown = settingsElement[0].style["display"];
        if (shown == "none") {
            settingsElement[0].style["display"] = "block";
        } else {
            settingsElement[0].style["display"] = "none";
        }
        // toggle color of settings icon
        blueGearIconDisplay = blueGearIcon[0].style.display;
        if (blueGearIconDisplay == "block") {
            grayGearIcon[0].style["display"] = "block";
            blueGearIcon[0].style["display"] = "none";
        } else if (blueGearIconDisplay == "none") {
            blueGearIcon[0].style["display"] = "block";
            grayGearIcon[0].style["display"] = "none";
        }
    });
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
    function intervalHandler() {
        let radioCheck = $('input[name=intervalGroup]:checked', '#advancedSettingsForm').val();
        if (radioCheck == 'custom') {
            let customValue = $('#customIntervalValue').val();
            if (customValue < 1 || customValue > 120) {
                event.preventDefault();
                console.error("Custom intervals must be between 1 and 120 minutes.");
            } else {
                timeInterval = customValue * 60 * 1000;
                localStorage.setItem("TIME_INTERVAL", timeInterval);
                page.updateIntervalDisplay(timeInterval);
                timer.setTimerInterval(timeInterval);
            }
        } else {
            timeInterval = radioCheck * 60 * 1000;
            localStorage.setItem("TIME_INTERVAL", timeInterval);
            page.updateIntervalDisplay(timeInterval);
            timer.setTimerInterval(timeInterval);
        }
    }
});
