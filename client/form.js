song = require('./song.js')
genreToCheckboxIdMapping = require('./checkboxes')

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

// return list of genreNames, based off current status of genre form checkboxes
function populateGenres(genreList) {
    let genres = [];
    for (let genre in genreList.counts) {
        genres.push(genre);
    }

    let genrePreferences = [];
    let genreNames = Object.keys(genreToCheckboxIdMapping);
    let checkboxIds = Object.values(genreToCheckboxIdMapping);
    $('.genreGroup').each(function () {
        // only add genres that are checked off
        if (this.checked) {
            let checkboxId = this.id;
            // do the weird ones first
            if (checkboxId === 'hipHopBox') {
                genrePreferences.push("Hip Hop");
                genrePreferences.push("Hip-Hop");
                genrePreferences.push("Rap");
                genrePreferences.push("Gangsta");
            } else if (checkboxId === 'otherBox') {
                genrePreferences.push("Ska");
                genrePreferences.push("Acoustic");
            } else { // otherwise use the genreToCheckboxId mappings
                let genreIndex = checkboxIds.indexOf(checkboxId);
                if (genreIndex > -1) {
                    let genreName = genreNames[genreIndex];
                    genrePreferences.push(genreName);
                }
            }
        }
    });

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
