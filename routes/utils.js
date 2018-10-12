require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });
/**
 * Utils module
 * @module utils
 */

/**
 * If a sharing link does not exist for a certain file, the method will generate a sharing link for the file
 * @param {string} name filename
 * @returns link to the file
 */

function generateSharingLink(name){
    return new Promise(function(resolve, reject){
        dbx.sharingCreateSharedLinkWithSettings({path: '/'+name, settings: {requested_visibility: "public"}}).then(function(response){
            var link = response.url.substring(0, response.url.length-1) + "1";
            resolve(link);
        }).catch(function(error){
            console.log(error);
            reject(error);
        });
    })
}

/**
 * Takes in a filename as a string and returns a shareable link to the corresponding dropbox file.
 * @param {string} name filename
 * @returns link to the file
 */

function getFile(name) {
    return new Promise(function (resolve, reject){
        dbx.sharingListSharedLinks({path: '/'+name}).then(function(response){
            if (response.links[0]){
                var link = response.links[0].url.substring(0, response.links[0].url.length-1) + "1";
                resolve(link);
            } else {
                generateSharingLink(name).then(function(resp){
                    resolve(resp);
                });
            }
        }).catch(function(error){
            console.log(error);
            reject(error);
        });
    })
    
};
/** 
 * Takes in nothing, and generates a randomly selected filename from the dropbox
 * which is passed into getFile, and returns the result of calling getFile. 
 * @returns link to a random file
 */

exports.getRandomFile = function(){
    return new Promise(function(resolve, reject){
        dbx.filesListFolder({path: ''}).then(function(response) {
            let name = '';
            while (!name.endsWith('.mp3')){
                index = parseInt(Math.random()*response.entries.length);
                name = response.entries[index].name;
            }
            getFile(name).then(function(result){
                resolve(result);
            });
        }).catch(function(error) {
            console.error(error);
            reject(error);
        });
    })
    

}