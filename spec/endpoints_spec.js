request = require("request");

describe("Endpoints Test", function () {
    it("Base Page Test", function () {
        request.get("http://localhost:3752/", function(err, resp, body) {
            if (err) {
                fail(err);
            }
            expect(resp.statusCode).toEqual(200);
        });
    });

    it("Next Endpoint Test", function () {
        request.post("http://localhost:3752/api/next", function(err, resp, body) {
            if (err) {
                fail(err);
            }
            expect(resp.statusCode).toEqual(200);
            expect(body).toContain("dl.dropboxusercontent.com");
        });
    });

    it("Request Song Test", function () {
        request.post("http://localhost:3752/api/song", {song: "config.json"}, function(err, resp, body) {
            if (err) {
                fail(err);
            }
            expect(resp.statusCode).toEqual(200);
            expect(body).toContain("dl.dropboxusercontent.com");
        });
    });

    it("Get Genres Test", function () {
        request.post("http://localhost:3752/api/genres", function(err, resp, body) {
            if (err) {
                fail(err);
            }
            expect(resp.statusCode).toEqual(200);
            expect(body).toEqual(jasmine.any(Object));
        });
    });
});