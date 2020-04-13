require('isomorphic-fetch');
const nodeID3 = require('node-id3');

jest.mock('request');
const request = require('request');
request.get.mockResolvedValue({response: {}});


jest.mock('dropbox');
const Dropbox = require('dropbox').Dropbox;
//const dbx = new Dropbox({ accessToken: process.env.DBX_TOKEN });

const dbx = {
	filesGetTemporaryLink: jest.fn((param) => Promise.resolve({link: '/test_dbx.json'}))

};
Dropbox.mockResolvedValue(dbx);



const functions = require('../routes/utils.js');

test('getGenresList Test #1', async () => {

	result = functions.getGenresList();
	console.log(dbx);
	await expect(result).toBe()
})

test('dbx function test', () => {
	dbx.filesGetTemporaryLink({ path: '/config.json'}).then(function(response){
		expect(response).toBe({link: '/test_dbx.json'});
	})
})

	// const mockRequestFunction = jest.fn();
	// mockRequestFunction.mockImplementation(request);

	// const mockDBXFilesGetTemporaryLink = jest.fn();
	// mockDBXFilesGetTemporaryLink.mockImplementation(dbx.filesGetTemporaryLink());
	// mockDBXFilesGetTemporaryLink.mockReturnValueOnce('/config.json');
	// const path_to_file = dbx.filesGetTemporaryLink().then(function(response) {
	// 	console.log(response);
	// });
	// const mockRequestFunction = jest.fn( (url, callback) => {
	// 	data = "{counts: {rnb:1}}";
	// 	response = {statusCode: 200};
	// 	callback(false, reponse, data);
	// });
	
	
	
	
	//console.log(request());
	//console.log(mockRequestFunction());

	//const dbx_promise = dbx.filesGetTemporaryLink();
	//dbx_promise.then(function (response) {console.log(response)});
	//mockRequestFunction.mockReturnValueOnce('full_file/config.json');
	//console.log(request(path_to_file));
	//result = functions.getGenresList();
	//await expect(result).toBe(JSON);



const mock_data = 
{
	"counts": {
		"Genre-1": 1,
	},
	"songs": {
		"Song-1-filename": {
			"title": "54-46 Was My Number",
			"artist": "Toots & The Maytals",
			"genre": "Reggae",
			"year": "1998",
			"filename": "01 54-46 Was My Number.mp3"
        }
    }
}

