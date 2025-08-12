export const GamePhases = {
    NOT_STARTED: 'not-started',
    COUNTDOWN: 'countdown-starting',
    SETUP: 'setup',
    DAY: 'day',
    NIGHT: 'night'
}

export const InfoTypes = {
    ROLES: 'roles',
    PLAYERS_WITH_ROLES: 'players-with-roles'
}

export const ActionTypes = {
    CHOOSE_PLAYER: 'choose-player',
    JUST_CLICK: 'just-click'
}
export const ActionDurations = {
    UNTIL_USED: 'until-used',
    UNTIL_USED_OR_DAY: 'until-used-or-day'
}

export const TimerDurations = {
    SETUP: 10 * 1000,
    NIGHT: 20 * 1000
}

export const StatusEffectDuration = {
    PERMANENT: 'permanent',

    UNTIL_MORNING: 'until-morning',
    UNTIL_DUSK: 'until-dusk',           // Immediately before UNTIL_NIGHT
    UNTIL_NIGHT: 'until-night'
}

export const SourceOfDeathTypes = {
    EXECUTION: 'execution',
    DEMON_KILL: 'demon-kill',
    MAYOR_REDIRECT: 'mayor-redirect',   // Only used for mayor redirect to self
    OTHER: 'other'
}