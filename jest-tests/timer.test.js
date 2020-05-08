const timer = require('../client/timer.js');

// https://www.npmjs.com/package/jest-date-mock
// mocks out Date library
const dateMock = require('jest-date-mock'); // advanceBy(ms)
const advanceTimeByMs = function(ms) {
    dateMock.advanceBy(ms);
    jest.advanceTimersByTime(ms);
}

// Helper matcher function
// modified from https://jestjs.io/docs/en/expect#expectextendmatchers
expect.extend({
  toBeAround(received, expected, wiggle) {
    const floor = expected - wiggle;
    const ceiling = expected + wiggle;
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

const pug = require('pug');
const path = require('path');
const timerSnippetFilePath = path.join(__dirname, '../views/components/timer.pug');
const renderTimer = pug.compileFile(timerSnippetFilePath);

beforeEach(() => {
    // must be called before each test to reset usage
    jest.useFakeTimers(); // mocks out setInterval / clearInterval
    dateMock.advanceTo();

    document.body.innerHTML = renderTimer({});

    const mockLoopPlayer = jest.fn();
    const mockAudioElement = {};
    timer.setSongPlayer(mockLoopPlayer, mockAudioElement);
});

afterEach(() => {
    // make sure no lingering timers accidentally affect later tests
    jest.clearAllTimers();
})

describe('timer controls uses setInterval and clearInterval as expected', () => {
    beforeEach(() => {
        timer.setTimerInterval(60*1000)
    });
    test('startTimer', () => {
        timer.startTimer();
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).not.toHaveBeenCalled();
    });
    test('pauseTimer', () => {
        timer.startTimer();
        timer.pauseTimer();
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
    test('resetTimer', () => {
        timer.startTimer();
        timer.resetTimer();
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });
});

describe('timer tracks time', () => {
    const initialSettings = 60*1000;
    beforeEach(() => {
        timer.setTimerInterval(initialSettings);
    });
    afterEach(() => {
        dateMock.advanceTo();
        timer.resetTimer();
    })
    test('after starting', () => {
        timer.startTimer();
        expect(timer.getCurrentMS()).toBeAround(initialSettings, 1);
        advanceTimeByMs(5*1000);
        expect(timer.getCurrentMS()).toBeAround(initialSettings-(5*1000), 1);
    });
    test('after starting and stopping', () => {
        timer.startTimer();
        timer.pauseTimer();
        advanceTimeByMs(6*1000);
        expect(timer.getCurrentMS()).toBeAround(initialSettings, 1);
    });
    test('after starting and resetting', () => {
        timer.startTimer();
        timer.resetTimer();
        expect(timer.getCurrentMS()).toBeAround(initialSettings, 1);
        advanceTimeByMs(5*1000);
        expect(timer.getCurrentMS()).toBeAround(initialSettings, 1);
    });
});

describe('plays song correctly', () => {
    test('when timer hits 0', () => {
        timer.setTimerInterval(5*1000);
        timer.startTimer();
        advanceTimeByMs(6*1000);
        expect(timer.getLoopPlayer()).toBeCalled();
    });
    test('after resetting interval', () => {
        timer.setTimerInterval(5*1000);
        timer.startTimer();
        advanceTimeByMs(3*1000);
        timer.resetTimer();
        timer.startTimer();
        advanceTimeByMs(3*1000);
        //expect loopPlayer to not be called
        //at what would be the end of the first interval
        expect(timer.getLoopPlayer()).not.toBeCalled();
        advanceTimeByMs(3*1000);
        //expect loopPlayer to have been called
        // at the end of the second interval
        expect(timer.getLoopPlayer()).toBeCalled();
    });
})

describe('timer display', () => {
    beforeEach(() => {
        timer.setTimerInterval(5*1000);
    });
    afterEach(() => {
        timer.resetTimer();
    });
    test('defaults to 15:00', () => {
        expect(document.getElementById('timer-time').innerHTML).toEqual('15:00');
    })
    test('responds to timer starts, pauses, and restarts', () => {
        timer.startTimer();
        advanceTimeByMs(2*1000);
        expect(document.getElementById('timer-time').innerHTML).toEqual('00:03');

        timer.pauseTimer();
        advanceTimeByMs(2*1000);
        expect(document.getElementById('timer-time').innerHTML).toEqual('00:03');

        timer.resetTimer();
        expect(document.getElementById('timer-time').innerHTML).toEqual('00:05');

        timer.startTimer();
        advanceTimeByMs(2*1000);
        expect(document.getElementById('timer-time').innerHTML).toEqual('00:03');
    });
})
