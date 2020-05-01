// Returns a list of songs with the given genre and decade preferences.
// Also used to get a count of how many songs pass the filter for sanity checks.
function makeSongList(genreList, genreArray, decadeArray) {
    let songList = [];
    if (genreArray === null && decadeArray === null) {
        songList = Object.keys(genreList.songs);
    } else if (decadeArray === null) {
        for (key in genreList.songs) {
            if (genreArray.includes(genreList.songs[key].genre)) {
                songList.push(genreList.songs[key]);
            }
        }
    } else if (genreArray === null || genreArray.length === 0) {
        for (key in genreList.songs) {
            if (decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                songList.push(genreList.songs[key]);
            }
        }
    } else {
        for (key in genreList.songs) {
            if (genreArray.includes(genreList.songs[key].genre) && decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                songList.push(genreList.songs[key]);
            }
        }
    }
    return songList;
}

function chooseNextSongWithPreferences(genreList, genreArray, decadeArray) {
    let songList = makeSongList(genreList, genreArray, decadeArray);
    let randomIndex = parseInt(Math.random() * songList.length);
    let chosenSong = songList[randomIndex];
    console.log('findNextSongWithPreferences: ', chosenSong.filename);
    return {
        title: chosenSong.title+" ",
        artist: chosenSong.artist,
        fileName: chosenSong.filename
    }
}


module.exports = {
    makeSongList: makeSongList,
    chooseNextSongWithPreferences: chooseNextSongWithPreferences,
}
