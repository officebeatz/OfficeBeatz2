require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });

function getFile(name) {
    return new Promise(function (resolve, reject){
        dbx.filesDownload({path: '/'+name}).then(function(response){
            resolve(response.fileBinary);
        }).catch(function(error){
            console.log(error);
            reject(error);
        });
    })
    
};

exports.getRandomFile = function(){
    return new Promise(function(resolve, reject){
        dbx.filesListFolder({path: ''}).then(function(response) {
            let name = '';
            while (!name.endsWith('.mp3')){
                index = parseInt(Math.random()*response.entries.length);
                name = response.entries[index].name;
            }
            var buff = getFile(name).then(function(result){
                resolve(result);
            });
        }).catch(function(error) {
            console.error(error);
            reject(error);
        });
    })
    

}