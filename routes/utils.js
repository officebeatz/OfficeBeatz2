require('isomorphic-fetch');
const https = require('https');
const fs = require('fs');
const nodeID3 = require('node-id3');
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });
/**
 * Utils module
 * @module utils
 */

/**
 * Takes in dropbox file sharing link and returns the download link
 * @param {string} url sharing url
 * @returns download url
 */
function convertLink(url){
    return url.substring(0, url.length - 1) + "1";
}

/**
 * If a sharing link does not exist for a certain file, the method will generate a sharing link for the file
 * @param {string} name filename
 * @returns link to the file
 */

function generateSharingLink(name) {
    return new Promise(function (resolve, reject) {
        dbx.sharingCreateSharedLinkWithSettings({ path: '/' + name, settings: { requested_visibility: "public" } }).then(function (response) {
            var link = convertLink(response.url);
            resolve(link);
        }).catch(function (error) {
            console.log(error);
            reject(error);
        });
    });
}

/**
 * Takes in a filename as a string and returns a shareable link to the corresponding dropbox file.
 * @param {string} name filename
 * @returns link to the file
 */

function getFile(name) {
    return new Promise(function (resolve, reject) {
        dbx.sharingListSharedLinks({ path: '/' + name }).then(function (response) {
            if (response.links[0]) {
                var link = convertLink(response.links[0].url);
                resolve(link);
            } else {
                generateSharingLink(name).then(function (resp) {
                    resolve(resp);
                });
            }
        }).catch(function (error) {
            console.log(error);
            reject(error);
        });
    });
};

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
                let buffer = new Buffer(result);
                console.log(buffer);
                let tags = nodeID3.read(buffer);
                console.log(tags);
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
            resolve(response);
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
            var file = fs.createWriteStream('config.json');
            https.get(response, resp => {
                console.log(resp);
                // var stream = resp.pipe(file);
                // stream.on('finish', function(){

                // })
            })
            resolve(response);
        }).catch(function(error){
            console.error(error);
            reject(error);
        });
     });
 }