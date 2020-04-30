song = require('./song.js')
genreToCheckboxIdMapping = require('./checkboxes')

function submitForm(genreList) {
    let selectedGenres = getGenrePreferences(genreList);
    let selectedDecades = getDecadePreferences();
    let selectedInterval = getTimeInterval();
    let isValid = song.makeSongList(genreList, selectedGenres, selectedDecades).length > 5;
    $("#formFeedback").html(function () {
        if (isValid) {
            let successMessage = "<span id='successMessage'> Success! </span>"
            return successMessage + "Click the skip icon to load a song with your new preferences."
        } else {
            let errorMessage = "<span id='errorMessage'> Error! </span>"
            return errorMessage + "Fewer than five songs available, please broaden your preferences."
        }
    });
    feedbackAnimation();
    return {
        genres: selectedGenres,
        decades: selectedDecades,
        interval: selectedInterval,
        isValid: isValid
    }
}

// return list of genreNames, based off current status of genre form checkboxes
function getGenrePreferences(genreList) {
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
        return Object.values(genreList.counts);
    }
    return genrePreferences;
}

function getDecadePreferences() {
    let decadePreferences = [];
    let startingDecade = parseInt($('#startingDecade').val()) || 1940;
    let endingDecade = parseInt($('#endingDecade').val()) || 2019;
    decadePreferences.push(startingDecade);
    decadePreferences.push(endingDecade);
    return decadePreferences;
}

function getTimeInterval() {
    let radioCheck = $('input[name=intervalGroup]:checked', '#advancedSettingsForm').val();
    if (radioCheck == 'custom') {
        let customValue = $('#customIntervalValue').val();
        return customValue * 60 * 1000;
    } else {
        return radioCheck * 60 * 1000;
    }
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
