$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.tabs').tabs();
    $('.collapsible').collapsible({ accordion : false });

    let TIME_INTERVAL = localStorage.getItem("TIME_INTERVAL") || 2700000 // Defaults to 45 minutes if not previously set
    let activeInterval = false;

    var audioElement = $('#audioSource')[0]; // jQuery syntax to grab the first child of the audio object

    $('#play').click(function () {
        // Updates autoplay after an action has taken place
        audioElement.autoplay = true;
        audioElement.play();

        // If the interval is already determined, do not set another one
        if(!active) {
            timeout();
        }
    });

    // Makes an API request for a new song every TIME_INTERVAL milliseconds
    let timeout = () => {
        activeInterval = true;
        setTimeout(function () {
            loopPlayer(audioElement);
        }, TIME_INTERVAL);
    }

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

        // Delay to prevent overlap while changing audio source
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
            }
        } else {
            TIME_INTERVAL = radioCheck * 60 * 1000;
            localStorage.setItem("TIME_INTERVAL", TIME_INTERVAL)
        }

    });
});
