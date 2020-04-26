genreToCheckboxIdMapping = require('./checkboxes')

function updateSongDisplay(title, artist) {
    $("#titleID").html(function () {
        return title;
    });

    $("#artistID").html(function () {
        return artist;
    });
}

// Updates interval display in option bar.
function updateIntervalDisplay(interval) {
    if (interval < 3600 || interval > 7200000) {
        return null;
    }
    $("#intervalDisplay").html(function () {
        let spannedInterval = "<span id='spannedInterval'>" + (((interval) / 1000) / 60) + "</span>";
        return "Current Interval: " + spannedInterval + " minutes.";
    });
}

/**
 * Updates the UI with the current genre preferences.
 * @param {*} genrePreferences
 * @returns a list of the current genre preferences to be displayed
 */
function updateGenreDisplay(genrePreferences) {
    $("#genreDisplay").html(function () {
        if (!genrePreferences || genrePreferences.length === 0) {
            let spannedGenre = "<span id='spannedGenre'> Hip-Hop, Rock, Reggae, Pop, Electronic, Alternative, Blues, Latin, Jazz, Country, Miscellaneous </span>";
            return "Current Genres: " + spannedGenre + ".";
        }
        let parsedGenres = []
        for (let i = 0; i < genrePreferences.length; i++) {
            let genre = genrePreferences[i];
            if (genre === "Hip Hop" || genre === "Gangsta" || genre === "Rap") {
                continue;
            } else if (genre === 'Acoustic' || genre === 'Ska') {
                if (parsedGenres.includes("Miscellaneous")) {
                    // Avoids adding Misc tag twice.
                } else {
                    parsedGenres.push("Miscellaneous");
                }
            } else {
                parsedGenres.push(genrePreferences[i]);
            }
        }
        let spannedGenre = "<span id='spannedGenre'>" + parsedGenres.join(", ") + "</span>";
        return "Current Genres: " + spannedGenre;
    });
}

/**
 * Updates the UI with the current year preferences.
 * @param {*} decadePreferences
 * @returns a range with the current year preferences
 */
function updateDecadeDisplay(decadePreferences) {
    $("#decadeDisplay").html(function () {
        if (!decadePreferences) {
            let spannedDecades = "<span id='spannedDecades'> 1940 </span> - <span id='spannedDecades'> 2019 </span>";
            return "Current Timespan: " + spannedDecades;
        }
        if (decadePreferences.length > 0) {
            let spannedDecades = "<span id='spannedDecades'>" + decadePreferences[0] + "</span>" + " - " + "<span id='spannedDecades'>" + decadePreferences[1] + "</span>";
            return "Current Timespan: " + spannedDecades;
        } else {
            let spannedDecades = "<span id='spannedDecades'> 1940 </span> - <span id='spannedDecades'> 2019 </span>";
            return "Current Timespan: " + spannedDecades;
        }
    });
}

function allSelectedOrNot() {
    var isAllChecked = 0;

    $(".genreGroup").each(function () {
        if (!this.checked)
            isAllChecked = 1;
    });

    if (isAllChecked == 0) {
        $("#selectBox").prop("checked", true);
    }
}

function updatePlayIcon (audioElement) {
    if(audioElement.paused) {
        $("#play").html(function () {
            let currentIcon = "<i class='material-icons'>play_arrow</i>";
            return currentIcon;
        });
    }

    if(!audioElement.paused) {
        $("#play").html(function () {
            let currentIcon = "<i class='material-icons'>pause</i>";
            return currentIcon;
        });
    }
}

function updateVolIcon (audioElement) {
    let volIcon;
    if (audioElement.volume == 0) {
        volIcon = "<i class='material-icons'>volume_off</i>";
    } else {
        volIcon = "<i class='material-icons'>volume_up</i>";
    }

    $("#mute").html(function () {
        return volIcon;
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

/**
 * Creates the genre checkboxes for advanced settings.
 * Uses genreName -> checkboxId mapping
 * @param {*} genrePreferences
 */
function determineCheckboxes(genrePreferences) {
    if (!genrePreferences || genrePreferences.length === 0) {
        // check all
        for (let [genreName, checkboxId] of Object.entries(genreToCheckboxIdMapping)) {
            $('#' + checkboxId).prop('checked', true);
        }
    } else {
        // check only ones in the list
        for (let [genreName, checkboxId] of Object.entries(genreToCheckboxIdMapping)) {
            if (genrePreferences.indexOf(genreName) > -1) {
                $('#' + checkboxId).prop('checked', true);
            }
        }
    }
}

function determineDecadeInputs(decadePreferences) {
    if (decadePreferences) {
        $("#startingDecade").val(decadePreferences[0])
        $("#endingDecade").val(decadePreferences[1])
    }
}

module.exports = {
    updateSongDisplay,
    updateIntervalDisplay,
    updateGenreDisplay,
    updateDecadeDisplay,
    allSelectedOrNot,
    updatePlayIcon,
    updateVolIcon,
    determineRadioButton,
    determineCheckboxes,
    determineDecadeInputs,
}
