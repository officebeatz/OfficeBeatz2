const timer = require('client/timer.js');
jest.useFakeTimers();

test('counts down correctly after starting', () => {
    timer.setTimerInterval(900000)
    timer.startTimer();
    jest.advanceTimersByTime(500000);
    expect(timer.getCurrentMS()).toBe(400000);
  });


test('plays song when timer hits 0', () => {
    timer.setTimerInterval(900000);
    jest.advanceTimersbyTime(902000);
    expect(timer.loopPlayer).toBeCalled();
  });

test('pauses after starting and stopping', () => {
    timer.setTimerInterval(900000)
    timer.startTimer();
    timer.pauseTimer();
    jest.advanceTimersByTime(500000);
    expect(timer.getCurrentMS().toBe(400000));
  });

test('pauses after starting and resetting', () => {
    timer.setTimerInterval(900000)
    timer.startTimer();
    timer.resetTimer();
    jest.advanceTimersByTime(500000);
    expect(timer.getCurrentMS().toBe(900000));
  });

test('correctly resets interval', () => {
    timer.setTimerInterval(900000);
    timer.startTimer();
    jest.advanceTimersByTime(500000);
    timer.resetTimer();
    timer.startTimer();
    jest.advanceTimersByTime(402000);
    //expect loopPlayer to not be called
    //at what would be the end of the first interval
    expect(timer.loopPlayer).not.toBeCalled();
    jest.advanceTimersByTime(502000);
    //expect loopPlayer to have been called
    // at the end of the second interval
    expect(timer.loopPlayer).toBeCalled();
});