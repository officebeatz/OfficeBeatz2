// Function copied to avoid front end environment set up during testing.
function makeSongList(genreArray, decadeArray) {
    let songList = [];
    if (genreArray != null && decadeArray != null) {
        for (key in genreList.songs) {
            if (genreArray.includes(genreList.songs[key].genre) && decadeArray[0] <= genreList.songs[key].year && genreList.songs[key].year <= decadeArray[1]) {
                songList.push(genreList.songs[key].filename);
            }
        }
    } else if (decadeArray == null) {
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
//A hardcoded genre list for testing purposes.
var genreList = new Object();
genreList={
    songs: {
        song1: {
            artist: "Aretha Franklin",
            filename: "04 (You Make Me Feel Like) A Natural Woman.mp3",
            genre: "R&B",
            title: "(You Make Me Feel Like) A Natural Woman",
            year: "2005"
        },
        song2: {
            artist: "Crosby, Stills & Nash",
            filename: "10 49 Bye-Byes.mp3",
            genre: "Rock",
            title: "49 Bye-Byes",
            year: "1969"
        },
        song3: {
            artist: "The Doors",
            filename: "05 Alabama Song.mp3",
            genre: "Rock",
            title: "Alabama Song",
            year: "2007"
        },
        song4: {
            artist: "Gorillaz",
            filename: "10 All Alone.mp3",
            genre: "Hip-Hop",
            title: "All Alone",
            year: "2005"
        }
    }
}

describe("Make song list test", function(){
    it("Decade null test", function(){
        expect(makeSongList(["Hip-Hop"],null).length).toBe(1);
    })
    it("Genre null test", function(){
        expect(makeSongList(null,[2005,2007]).length).toBe(3);
    })
    it("Genre and decade preference test",function(){
        expect(makeSongList(["Pop","R&B","Rock"],[2005,2007]).length).toBe(2);
    })
})