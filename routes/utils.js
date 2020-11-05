const axios = require('axios');
const nodeID3 = require('node-id3');
const dbx = require('./dbx')

var admin = require('firebase-admin');
var serviceAccount = process.env.GOOGLE_FIREBASE_AUTH;


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://officebeatz-1918b.firebaseio.com"
});

var defaultDatabase = admin.database();

// Given a dropbox filename, returns a URL to the corresponding dropbox file.
function getLinkToFile(filename) {
    return dbx.filesGetTemporaryLink({ path: '/' + filename })
        .then(response => {
            return response.link;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

// Given a list of songs, returns a config file based off the songs ID3 info
 function makeConfig(songs) {
     let config = {
         "counts":{},
         "songs":{}
     };
     songs.forEach(song => {
         extractID3(song, config);
     })
     return config;
 }

// Given a song's filename, returns the config file with the song's info added
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

// Returns a URL to a randomly selected song
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

// Creates a new config file based off the dropbox contents, and uploads it
// WARNING: This doesn't work anymore, because nodeID3 fails to read tags.year
exports.updateDBX = function() {
    return dbx.filesListFolder({path: ''})
        .then(response => makeConfig(response.entries))
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

// Returns a JSON object of the config file (genres and counts of all songs)
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
 * Returns if user is allowed to be on the website
 * @param {Request}
 * @returns int if user's has access (0=success, 1=key does not exist, 2=key has expired)
 */
exports.hasValidAccess = function (req) {
    if (req.session.hasAccess && req.session.hasAccess===true) {
        return Promise.resolve([new Date(req.session.expire_date) ]).then(function (res) {
            if (res[0]>= new Date()) return 0;
            else return 2;
        });
    }
    if (req.session.fire_key && req.session.fire_key.length > 0)
    {
        return defaultDatabase.ref('/users/' + req.session.fire_key + '/expires').once('value').then(function(snapshot) {

            if (snapshot.exists())
            {
                const expiration_date = snapshot.val();
                var exp_date = new Date(expiration_date);
                var today = new Date();
                req.session.expire_date = expiration_date;
                req.session.hasAccess = true;
                if (!(exp_date >= today)) return 2;
                else return 0;
            } else {
                req.session.hasAccess = false;
                return 1;
            }
            return 1;
        });
    }
    return Promise.resolve().then(function(f) {return 1;});
}

// Given a song name, returns a URL to the corresponding song
  exports.getSong = getLinkToFile;
