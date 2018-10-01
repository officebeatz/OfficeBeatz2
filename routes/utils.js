require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });

exports.getFile = function(name) {
    dbx.filesDownload({path: '/'+name})
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
      let name = '';
      while (!(name.endsWith('.mp3'))){
        index = parseInt(Math.random()*response.entries.length);
        name = response.entries[index].name;
        console.log(name);
      }
      return exports.getFile(name);
    })
    .catch(function(error) {
      console.error(error);
    });

}