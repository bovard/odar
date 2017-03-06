// note: ga should be defined in the global scope in the gh-pages branch ONLY

var ga = window && window.ga;

function startNewGame(mode) {
    if (ga) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Game',
            eventAction: 'Select',
            eventLabel: mode
        });
    }
}

function levelStart(mode, level) {
    if (ga) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Level',
            eventAction: 'Start',
            eventLabel: mode + String(level),
            eventValue: level
        });
    }
}

function levelGameOver(mode, level, round) {
    if (ga) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Level',
            eventAction: 'GameOver',
            eventLabel: mode + String(level),
            eventValue: round
        });
    }
}

function levelComplete(mode, level, round) {
    if (ga) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Level',
            eventAction: 'Complete',
            eventLabel: mode + String(level),
            eventValue: round
        });
    }
}

module.exports = {
    "startNewGame": startNewGame,
    "levelStart": levelStart,
    "levelGameOver": levelGameOver,
    "levelComplete": levelComplete
};