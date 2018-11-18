$(document).ready(function () {
    // Initializes Materialize components.
    $('.tabs').tabs();
    $('.collapsible').collapsible();

    let TIME_INTERVAL = localStorage.getItem("TIME_INTERVAL") || 2700000 // Defaults to 45 minutes if not previously set.
    let activeInterval = false;
    let audioElement = $('#audioSource')[0]; // jQuery syntax to grab the first child of the audio object.

    // Updates entries requiring TIME_INTERVAL
    determineRadioButton(TIME_INTERVAL);
    updateInterval(TIME_INTERVAL);

    $('#play').click(function () {
        // Updates autoplay after an action has taken place.
        audioElement.autoplay = true;
        audioElement.play();

        // If the interval is already determined, do not set another one.
        if (!activeInterval) {
            timeout();
        }
    });

    // Makes an API request for a new song every TIME_INTERVAL milliseconds.
    let timeout = () => {
        activeInterval = true;
        setTimeout(function () {
            loopPlayer(audioElement);
        }, TIME_INTERVAL);
    }

    // Makes an AJAX request for a new song and then replaces current song with the response.
    function loopPlayer(audioElement) {
        $.ajax({
            url: '/api/next',
            data: null,
            type: "POST",
            success: function (responseData) {
                console.log(responseData);
                audioElement.src = responseData;
            }, error: console.error
        });

        // Delay to prevent overlap while changing audio source.
        setTimeout(function () {
            audioElement.play();
        }, 1500);
        timeout();
    }

    $('#pause').click(function () {
        audioElement.pause();
    });

    $('#mute').click(function () {
        if (audioElement.muted == false) {
            audioElement.muted = true;
        } else {
            audioElement.muted = false;
        }
    });
    //Loads up a new song if a song is already playing, otherwise does nothing.
    $('#skip').click(function () {
        if (!audioElement.paused) {
            $.ajax({
                url: '/api/next',
                data: null,
                type: "POST",
                success: function (responseData) {
                    console.log(responseData);
                    audioElement.src = responseData;
                }, error: console.error
            });
            audioElement.play();

    });

    // Submits and updates interval between songs.
    $("#advancedSettingsForm").submit(function (event) {
        event.preventDefault();

        let radioCheck = $('input[name=intervalGroup]:checked', '#advancedSettingsForm').val();
        if (radioCheck == 'custom') {
            let customValue = $('#customIntervalValue').val();
            if (customValue < 1 || customValue > 120) {
                event.preventDefault();
                console.error("Custom intervals must be between 1 and 120 minutes.");
            } else {
                TIME_INTERVAL = customValue * 60 * 1000;
                localStorage.setItem("TIME_INTERVAL", TIME_INTERVAL)
                updateInterval(TIME_INTERVAL);
            }
        } else {
            TIME_INTERVAL = radioCheck * 60 * 1000;
            localStorage.setItem("TIME_INTERVAL", TIME_INTERVAL)
            updateInterval(TIME_INTERVAL);
        }

    });

    // Updates interval display in option bar.
    function updateInterval(interval) {
        $("#intervalDisplay").html(function () {
            let spannedInterval = "<span id='spannedInterval'>" + (((interval) / 1000) / 60) + "</span>";
            return "Current Interval: " + spannedInterval + " minutes.";
        });
    }

    // Selects the proper option depending on what the current time interval is.
    function determineRadioButton(TIME_INTERVAL) {
        if (TIME_INTERVAL == 900000) {
            $("#shortInterval").prop("checked", true);
        } else if (TIME_INTERVAL == 1800000) {
            $("#mediumInterval").prop("checked", true);
        } else if (TIME_INTERVAL == 2700000) {
            $("#longInterval").prop("checked", true);
        } else {
            $("#customInterval").prop("checked", true);
            $("#customIntervalValue").val((((TIME_INTERVAL) / 1000) / 60));
        }
    }
});
