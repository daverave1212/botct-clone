import { ActionTypes } from "$lib/shared-lib/GamePhases";
import { getGame } from "./games";

const roomAdmin = (user, params) => getGame(user.roomCode)?.privateKey == user.privateKey
const anyone = () => true
const userWithChoosePlayerAction = (user, params) =>
    getGame(user?.roomCode)?.
    getPlayer(user?.name)?.
    availableAction?.type == ActionTypes.CHOOSE_PLAYER
const meWithAction = (user, params) => {
    const me = getGame(user?.roomCode)?.getPlayer(user?.name)
    return (me?.name == user.name && me?.availableAction?.type == ActionTypes.JUST_CLICK)
}

const rules = {
    'default': {
        GET: anyone,
        POST: anyone,
        PUT: anyone,
        DELETE: anyone,
    },
    'api': {
        'game': {
            GET: anyone,
    
            '*': {
                GET: anyone,
                POST: anyone,

                'player': {
                    POST: anyone,

                    '*': {
                        DELETE: roomAdmin,

                        'action': {
                            POST: meWithAction,
                        },
                        'choose': {
                            POST: userWithChoosePlayerAction
                        },
                        'dead': {
                            POST: roomAdmin
                        }
                    }
                },
                'end-day': {
                    POST: roomAdmin
                },
                'start': {
                    POST: roomAdmin
                }
            }
        },
    }
}



export function getRuleByUrlParts(urlParts) {
    if (urlParts.length == 0) {
        return rules.default
    }

    let urlPartsRemaining = [...urlParts]
    let currentUrlRuleObj = rules
    do {
        const currentUrlPart = urlPartsRemaining.shift()
        if (currentUrlRuleObj['*'] != null) {
            currentUrlRuleObj = currentUrlRuleObj['*']
        } else if (currentUrlPart in currentUrlRuleObj) {
            currentUrlRuleObj = currentUrlRuleObj[currentUrlPart]
        } else {
            return rules.default
        }
    } while (urlPartsRemaining.length > 0)

    return currentUrlRuleObj
}