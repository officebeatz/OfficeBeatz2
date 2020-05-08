require('isomorphic-fetch');

// Mock the module dependencies
jest.mock('axios');
jest.mock('../routes/dbx');
const axios = require('axios');
const dbx = require('../routes/dbx');
dbx.filesGetTemporaryLink = jest.fn((path) => Promise.resolve({link: 'http://test-link.com'}))

// before importing the module to test
const utils = require('../routes/utils.js');

const mockConfig =
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

describe('getGenresList', () => {
	const goodResponse = {
		statusCode: 200,
		data: mockConfig
	};
	const badResponse = new Error('badResponse error message');

	test('should return data field of 200 response',  async () => {
		axios.get.mockResolvedValueOnce(goodResponse);
		const result = await utils.getGenresList();
		await expect(result).toStrictEqual(mockConfig);
	});

	test('should throw error for non-200 response', async () => {
		axios.get.mockRejectedValueOnce(badResponse);
		await expect(utils.getGenresList()).rejects.toThrow('badResponse');
	});

	// Example test to make sure its possible to fail:

	// test('should fail', async done => {
	// 	axios.get.mockResolvedValueOnce(goodResponse);
	// 	const result = await utils.getGenresList();
	// 	expect(result).toStrictEqual({});
	// 	done();
	// });
});
