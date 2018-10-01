window.onload = function(buffer) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioCtx.createBufferSource();
    audioCtx.decodeAudioData(buffer, function(buffer) {
      source.buffer = buffer;
      source.connect(audioCtx.destination);
    })
    source.start(0);
}