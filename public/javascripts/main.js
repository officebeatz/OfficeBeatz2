$(document).ready(function () {
    // Initializes Materialize components.
    $('.tabs').tabs();
    $('.collapsible').collapsible();

    let TIME_INTERVAL = localStorage.getItem("TIME_INTERVAL") || 2700000 // Defaults to 45 minutes if not previously set.
    let activeInterval = false;
    let audioElement = $('#audioSource')[0]; // jQuery syntax to grab the first child of the audio object.
    let volumeControl = $('.volSlider');
    let tempVol = 50;
    var genreList;
    var genrePreferences;
    var decadePreferences;
    getGenres().then((result) => {
        genreList = result;
        console.log(genreList.counts);
        var genres = [];
        for (var key in genreList.counts) {
            genres.push(key);
        }
        //This iterates through the genre stuff, add in making checkboxes out of this later~
        for (var i = 0; i < genres.length; i++) {
            console.log(genres[i] + ": " + genreList.counts[genres[i]]);
        }

    });





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
        findNextSongWithPreferences(genrePreferences, decadePreferences);
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
        if (audioElement.volume != 0) {
            volumeControl.val(0);
            audioElement.volume = 0;
        } else {
            audioElement.volume = tempVol / 100;
            volumeControl.val(tempVol);
        }
    });
    //Updates volume when slider is changed.
    $('#vol-control').on("input change", function () {
        tempVol = this.value;
        audioElement.volume = this.value / 100
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
        if (interval < 3600 || interval > 7200000) {
            return null;
        }
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

    function getGenres() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/api/genres',
                data: null,
                type: "POST",
                success: function (responseData) {
                    console.log(responseData)
                }, error: console.error
            }).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                console.log(error);
                reject(error);
            });
        });
    }

    function submitGenres(event) {
        event.preventDefault();
        var genres = [];
        for (var key in genreList.counts) {
            genres.push(key);
        }
        //Need to be hooked up to the front end.
        //genrePreferences=$('input[name=genreGroup]:checked', '#advancedSettingsForm').val();
        genrePreferences = [];

        //temporarily hardcoding them to R&B and Blues Rock for testing
        genrePreferences.push(genres[3]);
        genrePreferences.push(genres[7]);
        if (makeSongList(genrePreferences, decadePreferences).length < 5) {
            console.log("Fewer than five songs available, change your preferences.");
        } else {
            findNextSongWithPreferences(genrePreferences, decadePreferences);
        }
    }

    function submitYears(event) {
        event.preventDefault();
        //It'll just store a range, so two values. Think that's easier.
        decarePreferences = [];
        decadePreferences.push(1980);
        decadePreferences.push(1985);
        if (makeSongList(genrePreferences, decadePreferences).length < 5) {
            console.log("Fewer than five songs available, change your preferences.");
        }

    }

    function findNextSongWithPreferences(genreArray, decadeArray) {
        //if there are no preferences, just makes a call to /api/next which selects from the whole database
        if (typeof genreArray == "undefined" && typeof decadeArray == "undefined") {
            $.ajax({
                url: '/api/next',
                data: null,
                type: "POST",
                success: function (responseData) {
                    console.log(responseData);
                    audioElement.src = responseData;
                }, error: console.error
            });
        } else {
            //run through the whole JSON file and get the list of songs that match those genres, and randomize through the list
            var songList = makeSongList(genreArray, decadeArray);

            console.log(songList);
            let name = '';
            index = parseInt(Math.random() * songList.length);
            name = songList[index];
            console.log(name);

            // post request to /api/song in the headers make a tag called song, put name there
            $.ajax({
                url: '/api/song',
                data: null,
                headers: {
                    'song': name
                },
                type: "POST",
                success: function (responseData) {
                    console.log(responseData)
                    audioElement.src = responseData;
                }, error: console.error
            });
        }
    }

    function makeSongList(genreArray, decadeArray) {
        var songList = [];
        if (typeof genreArray != "undefined" && typeof decadeArray != "undefined") {
            for (key in genreList.songs) {
                if (genreArray.includes(genreList.songs[key].genre) && decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                    songList.push(genreList.songs[key].filename);
                }
            }
        } else if (typeof decadeArray == "undefined") {
            for (key in genreList.songs) {
                if (genreArray.includes(genreList.songs[key].genre)) {
                    songList.push(genreList.songs[key].filename);
                }
            }
        } else {
            for (key in genreList.songs) {
                if (decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                    songList.push(genreList.songs[key].filename);
                }
            }
        }
        return songList;
    }
});
