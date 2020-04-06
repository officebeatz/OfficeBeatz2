
function getSongFile(songFileName) {
    return $.ajax({
        url: '/api/song',
        data: null,
        headers: {
            'song': songFileName
        },
        type: "POST",
        success: function (responseData) {
            console.log('getSongFile: ', responseData);
            return responseData;
        }, error: console.error
    });
}

/**
 * Creates the genre preferences based on id3 information from getGenres().
 */
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

module.exports = {
    getSongFile: getSongFile,
    getGenres: getGenres
}
