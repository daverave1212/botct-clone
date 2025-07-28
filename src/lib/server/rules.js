import { getGame } from "./games";

const isRoomAdmin = (user, params) => getGame(user.roomCode)?.privateKey == user.privateKey

const rules = {
    'default': {
        GET: () => true,
        POST: () => true,
        PUT: () => true,
        DELETE: () => true,
    },
    'api': {
        'game': {
            GET: _ => true,
    
            '*': {
                GET: _ => true,
                POST: _ => true,

                'player': {
                    POST: _ => true,

                    '*': {
                        DELETE: isRoomAdmin,

                        'dead': {
                            POST: isRoomAdmin
                        }
                    }
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