const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({ accessToken: process.env.OFFICEBEATZ2_DBX_TOKEN, fetch: fetch });
//const dbx = new Dropbox({ accessToken: 'KcKrppgde04AAAAAAAAAARJ1GRybLtfEVso3iS-rlMN76rZ346pd7j9XmIwJF0aJ'});
module.exports = dbx;

