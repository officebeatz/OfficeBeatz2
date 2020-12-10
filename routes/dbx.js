const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const token = process.env.DBX_TOKEN;
const dbx = new Dropbox({ accessToken: token, fetch: fetch });

module.exports = dbx;

