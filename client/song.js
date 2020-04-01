/** Returns a list of songs with the given genre and decade preferences.
 *  Also used to get a count of how many songs pass the filter for sanity checks.
 *  Do not call this function if both are null, but it's fine if one or the other is null.
 *  @param {*} genreArray
 *  @param {*} decadeArray
 *  @returns an array containing all songs that pass the filter
 * */
function makeSongList(genreList, genreArray, decadeArray) {
    let songList = [];

    if (genreArray != null && decadeArray != null) {
        for (key in genreList.songs) {
            if (genreArray.includes(genreList.songs[key].genre) && decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                songList.push(genreList.songs[key]);
            }
        }
    } else if (decadeArray == null) {
        for (key in genreList.songs) {
            if (genreArray.includes(genreList.songs[key].genre)) {
                songList.push(genreList.songs[key]);
            }
        }
    } else {
        for (key in genreList.songs) {
            if (decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                songList.push(genreList.songs[key]);
            }
        }
    }
    return songList;
}

function chooseNextSongWithPreferences(genreList, genreArray, decadeArray) {
    let songList=[];
    //if there are no preferences, makes a dummy array to get makeSongList to function
    if (genreArray == null && decadeArray == null) {
        tempArray=[1940,2019];
        songList = makeSongList(genreList, genreArray, tempArray);
    } else {
        //run through the whole JSON file and get the list of songs that match those genres, and randomize through the list
        songList = makeSongList(genreList, genreArray, decadeArray);
    }
    let name = '';
    index = parseInt(Math.random() * songList.length);
    name = songList[index].filename;
    console.log('findNextSongWithPreferences: ', name);
    return {
        title: songList[index].title+" ",
        artist: songList[index].artist,
        fileName: name
    }
}


module.exports = {
    makeSongList: makeSongList,
    chooseNextSongWithPreferences: chooseNextSongWithPreferences,
}
