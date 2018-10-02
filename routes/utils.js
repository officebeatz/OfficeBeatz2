require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });

exports.getFile = function(name) {
    dbx.filesDownload({path: '/'+name+'.mp3'})
        .then(function(response){
            console.log(response);
            return response.fileBinary;
        })
        .catch(function(error){
            console.log(error);
        });
};

exports.getRandomFile = function(){
    dbx.filesListFolder({path: ''})
    .then(function(response) {
      console.log(response.entries);
      name = '';
      while (!name.endsWith('.mp3')){
        index = int(Math.random()*response.entries.length);
        name = response.entries[index];
      }
      return getFile(name);
    })
    .catch(function(error) {
      console.error(error);
    });

}