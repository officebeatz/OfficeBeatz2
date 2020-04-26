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

    let genrePreferences = [];
    if ($('#reggaeBox').is(':checked')) {
        genrePreferences.push(genres[0]);
    }
    if ($('#popBox').is(':checked')) {
        genrePreferences.push(genres[1]);
    }
    if ($('#rAndBBox').is(':checked')) {
        genrePreferences.push(genres[3]);
    }
    if ($('#rockBox').is(':checked')) {
        genrePreferences.push(genres[4]);
    }
    if ($('#latinBox').is(':checked')) {
        genrePreferences.push(genres[5]);
    }
    if ($('#hipHopBox').is(':checked')) {
        genrePreferences.push(genres[6]);
    }
    if ($('#bluesBox').is(':checked')) {
        genrePreferences.push(genres[7]);
    }
    if ($('#rockPopBox').is(':checked')) {
        genrePreferences.push(genres[8]);
    }
    if ($('#rapBox').is(':checked')) {
        genrePreferences.push(genres[9]);
    }
    if ($('#otherBox').is(':checked')) {
        genrePreferences.push(genres[2]);
        genrePreferences.push(genres[10]);
    }

    // If no genres selected, then default to select all
    if (genrePreferences.length == 0) {
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
