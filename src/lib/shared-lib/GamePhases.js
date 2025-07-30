export const GamePhases = {
    NOT_STARTED: 'not-started',
    COUNTDOWN: 'countdown-starting',
    SETUP: 'setup',
    DAY: 'day',
    NIGHT: 'night'
}

export const TimerDurations = {
    SETUP: 10 * 1000,
    NIGHT: 20 * 1000
}

export const StatusEffectDuration = {
    PERMANENT: 'permanent',
    UNTIL_MORNING: 'until-morning',
    UNTIL_NIGHT: 'until-night'
}

export const SourceOfDeathTypes = {
    EXECUTION: 'execution',
    DEMON_KILL: 'demon-kill',
    OTHER: 'other'
}