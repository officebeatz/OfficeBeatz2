// Initializes SideNav for mobile
$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.tabs').tabs();

    var audioElement = $('#audioSource')[0]

    $('#play').click(function () {
        audioElement.autoplay = true;
        audioElement.play();
        setInterval(function () {
            loopPlayer(audioElement);
        }, 5000);

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