require('isomorphic-fetch');
var request = require('request');
const nodeID3 = require('node-id3');
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });
/**
 * Utils module
 * @module utils
 */

/**
 * Takes in a filename as a string and returns a shareable link to the corresponding dropbox file.
 * @param {string} name filename
 * @returns link to the file
 */

function getFile(name) {
    return new Promise(function (resolve, reject) {
        dbx.filesGetTemporaryLink({ path: '/' + name }).then(function (response) {
            resolve(response.link);
        }).catch(function (error) {
            console.log(error);
            reject(error);
        });
    });
};

/**
 * 
 * @param {Array} songs
 * @param {function} function
 * @param {JSON} config
 * @return updated_config
 */

function extractAllID3(songs, fn, config){
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

function extractID3(song, config){
    return new Promise((resolve, reject) => {
        if (song.name.endsWith('.mp3')){
            getFile(song.name).then(function(link){
                request({url: link, encoding: null }, (err, resp, buffer) => {
                    if (!err && resp.statusCode == 200){
                        var tags = nodeID3.read(buffer);
                        if (config.counts[tags.genre]){
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
                        resolve(config);
                    } else {
                        resolve(config);
                    }
                });
            }).catch(function(error){
                console.log(error);
                reject(error);
            });
        } else {
            resolve(config);
        }
    })
    
}

/** 
 * Takes in nothing, and generates a randomly selected filename from the dropbox
 * which is passed into getFile, and returns the result of calling getFile. 
 * @returns link to a random file
 */

exports.getRandomFile = function () {
    return new Promise(function (resolve, reject) {
        dbx.filesListFolder({ path: '' }).then(function (response) {
            let name = '';
            while (!name.endsWith('.mp3')) {
                index = parseInt(Math.random() * response.entries.length);
                name = response.entries[index].name;
            }
            getFile(name).then(function (result) {
                resolve(result);
            });
        }).catch(function (error) {
            console.error(error);
            reject(error);
        });
    });
}

/**
 * Takes in nothing and updates the dropbox genre file
 * @returns Success or Failure
 */

 exports.updateDBX = function(){
    return new Promise(function (resolve, reject){
        dbx.filesListFolder({path: ''}).then(function(response){
            var config = {
                "counts":{},
                "songs":{}
            };
            extractAllID3(response.entries, extractID3, config).then(result => {
                dbx.filesUpload({contents: JSON.stringify(result, null, "\t"), path: "/config.json", mode: {".tag": "overwrite"}}).then((response) => {
                    resolve();
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            });
        }).catch(function(error){
            console.error(error);
            reject(error);
        });
     });
 }

/**
 * Takes in nothing and returns a JSON object with list of all genres and counts of all the songs in the dropbox
 * @returns JSON object of all genres and counts
 */

 exports.getGenresList = function(){
     return new Promise(function (resolve, reject){
        dbx.filesGetTemporaryLink({ path: '/config.json'}).then(function(response){
            request(response.link, function(error, resp, body){
                if (!error && resp.statusCode == 200){
                    var config = JSON.parse(body);
                    resolve(config);
                } else {
                    console.log(error);
                    reject(error);
                }
            });
        }).catch(function(error){
            console.error(error);
            reject(error);
        });
     });
 }

 /**
  * Takes a song name and returns temp link for song
  * @param {string} name
  * @returns {url} link
  */

  exports.getSong = function(name){
      return new Promise(function(resolve, reject){
          getFile(name).then((result) => {
              resolve(result);
          }).catch((err) => {
              console.log(err);
              reject(err);
          });
      })
  }