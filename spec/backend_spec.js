utils = require('../routes/utils.js');

describe("Dropbox Test", function () {
    it("Get File With Name Test", function () {
        utils.getSong("config.json").then((result) => {
            expect(result).toContain("dl.dropboxusercontent.com");
        });
    });

    it("Get Random File Test", function () {
        utils.getRandomFile().then((result) => {
            expect(false).toBeTruthy();
            expect(result).toContain("dl.dropboxusercontent.com");
        });
    });

    it("Get Genres List Test", function () {
        utils.getGenresList().then((result) => {
            expect(result).toEqual(jasmine.any(Object));
        });
    });


});