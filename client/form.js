song = require('./song.js')

function submitForm(genreList) {
    genrePreferences = populateGenres(genreList);
    decadePreferences = populateDecades();
    let isValid;
    if (song.makeSongList(genreList, genrePreferences, decadePreferences).length < 5) {
        $("#formFeedback").html(function () {
            let errorMessage = "<span id='errorMessage'> Error! </span>"
            return errorMessage + "Fewer than five songs available, please broaden your preferences."
        });
        feedbackAnimation();
        isValid = false;
    } else {
        $("#formFeedback").html(function () {
            let successMessage = "<span id='successMessage'> Success! </span>"
            return successMessage + "Settings successfully updated!"
        });
        feedbackAnimation();
        isValid = true;
    }
    return {
        genrePreferences: genrePreferences,
        decadePreferences: decadePreferences,
        isValid: isValid
    }
}

function populateGenres(genreList) {
    let genres = [];
    for (let genre in genreList.counts) {
        genres.push(genre);
    }

    let unfiltered = true;

    let genrePreferences = [];
    if ($('#reggaeBox').is(':checked')) {
        genrePreferences.push(genres[0]);
        unfiltered = false;
    }
    if ($('#popBox').is(':checked')) {
        genrePreferences.push(genres[1]);
        unfiltered = false;
    }
    if ($('#rAndBBox').is(':checked')) {
        genrePreferences.push(genres[3]);
        unfiltered = false;
    }
    if ($('#rockBox').is(':checked')) {
        genrePreferences.push(genres[4]);
        unfiltered = false;
    }
    if ($('#latinBox').is(':checked')) {
        genrePreferences.push(genres[5]);
        unfiltered = false;
    }
    if ($('#hipHopBox').is(':checked')) {
        genrePreferences.push(genres[6]);
        unfiltered = false;
    }
    if ($('#bluesBox').is(':checked')) {
        genrePreferences.push(genres[7]);
        unfiltered = false;
    }
    if ($('#rockPopBox').is(':checked')) {
        genrePreferences.push(genres[8]);
        unfiltered = false;
    }
    if ($('#rapBox').is(':checked')) {
        genrePreferences.push(genres[9]);
        unfiltered = false;
    }
    if ($('#otherBox').is(':checked')) {
        genrePreferences.push(genres[2]);
        genrePreferences.push(genres[10]);
        unfiltered = false;
    }

    // If no genres selected, then default to select all
    if (unfiltered) {
        return genres;
    }
    return genrePreferences;
}

function populateDecades() {
    let decadePreferences = [];
    let startingDecade = parseInt($('#startingDecade').val()) || 1940;
    let endingDecade = parseInt($('#endingDecade').val()) || 2019;
    decadePreferences.push(startingDecade);
    decadePreferences.push(endingDecade);
    return decadePreferences;
}

function feedbackAnimation() {
    $("#formFeedback").fadeIn(1000);
    setTimeout(function () {
        $("#formFeedback").fadeOut(1000);
    }, 5000)
}

module.exports = {
    submitForm
}
