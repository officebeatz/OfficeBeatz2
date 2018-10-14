// Initializes SideNav for mobile
$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.tabs').tabs();

    var audioElement = $('#audioSource')[0]

    $('#play').click(function () {
        audioElement.play();
    });

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