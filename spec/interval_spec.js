// Function copied to avoid front end environment set up during testing.
function updateInterval(interval) {
  if (interval < 3600 || interval > 7200000) {
    return null;
  }
  return "Current Interval: " + (((interval) / 1000) / 60) + " minutes.";
}

describe("updateInterval", function () {
  it("should update interval when valid", function () {
    expect(updateInterval(2700000)).toBe("Current Interval: 45 minutes.");
  });
  it("should return null when interval is too low", function () {
    expect(updateInterval(3000)).toBe(null);
  });
  it("should return null when interval is too high", function () {
    expect(updateInterval(7200045)).toBe(null);
  });
});