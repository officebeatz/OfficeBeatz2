
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
        if (!genrePreferences) {
            let spannedGenre = "<span id='spannedGenre'> Reggae, Pop, R&B, Rock, Latin, Hip-Hop, Blues, Pop Rock, Rap, Miscellaneous </span>";
            return "Current Genres: " + spannedGenre + ".";
        }
        if (genrePreferences.length > 0) {
            let parsedGenres = []

            for (let i = 0; i < genrePreferences.length; i++) {
                if (genrePreferences[i] == 'Blues Rock') {
                    parsedGenres.push("Blues");
                } else if (genrePreferences[i] == 'Rock/Pop') {
                    parsedGenres.push("Pop Rock");
                } else if (genrePreferences[i] == 'undefined' || genrePreferences[i] == 'Other') {
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
            return "Current Genres: " + spannedGenre + ".";
        } else {
            let spannedGenre = "<span id='spannedGenre'> Unfiltered </span>";
            return "Current Genres: " + spannedGenre + ".";
        }
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
            return "Current Timespan: " + spannedDecades + ".";
        }
        if (decadePreferences.length > 0) {
            let spannedDecades = "<span id='spannedDecades'>" + decadePreferences[0] + "</span>" + " - " + "<span id='spannedDecades'>" + decadePreferences[1] + "</span>";
            return "Current Timespan: " + spannedDecades + ".";
        } else {
            let spannedDecades = "<span id='spannedDecades'> 1940 </span> - <span id='spannedDecades'> 2019 </span>";
            return "Current Timespan: " + spannedDecades + ".";
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
 * Unfortunately hardcoded, so if a new genre was added you'd need to add it here.
 * @param {*} genrePreferences
 */
function determineCheckboxes(genrePreferences) {
    if (genrePreferences) {
        if (genrePreferences.indexOf('Reggae') > -1) {
            $('#reggaeBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Pop') > -1) {
            $('#popBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('R&B') > -1) {
            $('#rAndBBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Rock') > -1) {
            $('#rockBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Latin') > -1) {
            $('#latinBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Hip-Hop') > -1) {
            $('#hipHopBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Blues Rock') > -1) {
            $('#bluesBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Rock/Pop') > -1) {
            $('#rockPopBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('undefined') > -1) {
            $('#otherBox').prop('checked', true);
        }
        if (genrePreferences.indexOf('Rap') > -1) {
            $('#rapBox').prop('checked', true);
        }
    } else {
        $('#reggaeBox').prop('checked', true);
        $('#popBox').prop('checked', true);
        $('#rAndBBox').prop('checked', true);
        $('#rockBox').prop('checked', true);
        $('#latinBox').prop('checked', true);
        $('#hipHopBox').prop('checked', true);
        $('#bluesBox').prop('checked', true);
        $('#rockPopBox').prop('checked', true);
        $('#otherBox').prop('checked', true);
        $('#rapBox').prop('checked', true);
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
