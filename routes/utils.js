const axios = require('axios');
const nodeID3 = require('node-id3');
const dbx = require('./dbx')
/**
 * Utils module
 * @module utils
 */

/**
 * Takes in a filename as a string and returns a shareable link to the corresponding dropbox file.
 * @param {string} name filename
 * @returns link to the file
 */

function getLinkToFile(name) {
    return dbx.filesGetTemporaryLink({ path: '/' + name })
        .then(response => {
            return response.link;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

/**
 *
 * @param {Array} songs
 * @param {function} function
 * @param {JSON} config
 * @return updated_config
 */

function extractAllID3(songs, fn, config) {
    return songs.reduce((p, song) => {
        return p.then((conf) => {
            return fn(song, conf);
        });
    }, Promise.resolve(config));
}

/**
 * @param {JSON} song song
 * @param {JSON} config config
 * @returns {Promise}
 */

function extractID3(song, config) {
    // skip non-mp3 files (eg existing config.json)
    if (!song.name.endsWith('.mp3')) {
        Promise.resolve(config);
    }
    return getLinkToFile(song.name)
        // specify "null encoding" to get bits of mp3 file
        .then(link => axios.get(link, { responseType: 'arraybuffer'}))
        .then(response => {
            const buffer = response.data;
            const tags = nodeID3.read(buffer);
            if (config.counts[tags.genre]) {
                config.counts[tags.genre]++;
            } else {
                config.counts[tags.genre] = 1;
            }
            config.songs[tags.title] = {
                "title": tags.title,
                "artist": tags.artist,
                "genre": tags.genre,
                "year": tags.year,
                "filename": song.name
            }
            return config;
        })
        // axios will error on non 200 status codes
        .catch(error => {
            console.log(error);
            return config;
        });
}

/**
 * Takes in nothing, and generates a randomly selected filename from the dropbox
 * which is passed into getFile, and returns the result of calling getFile.
 * @returns link to a random file
 */

exports.getRandomFile = function() {
    return dbx.filesListFolder({ path: '' })
        .then(response => {
            let name = '';
            while (!name.endsWith('.mp3')) {
                index = parseInt(Math.random() * response.entries.length);
                name = response.entries[index].name;
            }
            return getLinkToFile(name);
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

/**
 * Takes in nothing and updates the dropbox genre file
 * @returns Success or Failure
 */

exports.updateDBX = function() {
    var config = {
        "counts":{},
        "songs":{}
    };
    return dbx.filesListFolder({path: ''})
        .then(response => extractAllID3(response.entries, extractID3, config))
        .then(result => dbx.filesUpload({
            contents: JSON.stringify(result, null, "\t"),
            path: "/config.json",
            mode: { ".tag": "overwrite" }
        }))
        .catch(error => {
            console.log(error);
            throw error;
        });
}

/**
 * Takes in nothing and returns a JSON object with list of all genres and counts of all the songs in the dropbox
 * @returns JSON object of all genres and counts
 */

 exports.getGenresList = function() {
    return getLinkToFile('config.json')
        .then(link => axios.get(link))
        .then(response => {
            return response.data;
        })
        // axios will error on non 200 status codes
        .catch(error => {
            console.log(error);
            throw error;
        });
 }

 /**
  * Takes a song name and returns temp link for song
  * @param {string} name
  * @returns {url} link
  */

  exports.getSong = getLinkToFile;
