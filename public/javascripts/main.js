$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.tabs').tabs();

    const TIME_INTERVAL = 15000; // 15 Seconds for testing purposes

    var audioElement = $('#audioSource')[0]; // jQuery syntax to grab the first child of the audio object

    $('#play').click(function () {
        // Updates autoplay after an action has taken place
        audioElement.autoplay = true;
        audioElement.play();

        // Makes an API request for a new song every TIME_INTERVAL milliseconds
        setInterval(function () {
            loopPlayer(audioElement);
        }, TIME_INTERVAL);
    });

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
        audioElement.play();
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
});
