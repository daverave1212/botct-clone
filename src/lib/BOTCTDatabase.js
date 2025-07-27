// http://bignose.whitetree.org/projects/botc/diy/

import { browser } from '$app/environment'
import { popArrayElementAt, randomizeArray } from './utils'

export const SETUP_GOOD = 'SETUP_GOOD'
export const NIGHTLY_GOOD = 'NIGHTLY_GOOD'
export const NORMAL = 'NORMAL'
export const SETUP_EVIL = 'SETUP_EVIL'
export const NIGHTLY_EVIL = 'NIGHTLY_EVIL'

export const TOWNSFOLK = 'townsfolk'
export const OUTSIDERS = 'outsiders'
export const MINIONS = 'minions'
export const DEMONS = 'demons'

export const NO_PRIORITY = 99


export const scripts = {
    TROUBLE_BREWING: 'Trouble Brewing',
    SECTS_AND_VIOLETS: 'Sects and Violets',
    BAD_MOON_RISING: 'Bad Moon Rising'
}


export function getBOTCTRoles(script = scripts.TROUBLE_BREWING) {
    switch (script) {
        case scripts.TROUBLE_BREWING: return getTroubleBrewingRoles()
    }
}

export const getTroubleBrewingRoles = () => [
    {
        name: "Washerwoman",
        type: TOWNSFOLK,
        isGood: true,
        category: SETUP_GOOD,
        effect: 'Show 2 people and a Townsfolk role. One of them is that role.'
    },
    {
        name: "Librarian",
        type: TOWNSFOLK,
        isGood: true,
        category: SETUP_GOOD,
        effect: 'Show 2 people and an Outsider role. One of them is that role.'
    },
    {
        name: "Investigator",
        type: TOWNSFOLK,
        isGood: true,
        category: SETUP_GOOD,
        effect: 'Show 2 people and a Minion role. One of them is that role.'
    },
    {
        name: "Chef",
        type: TOWNSFOLK,
        isGood: true,
        category: SETUP_GOOD,
        effect: 'Show how many evil pairs there are.'
    },
    {
        name: "Empath",
        type: TOWNSFOLK,
        isGood: true,
        category: NIGHTLY_GOOD,
        effect: 'Show how many of their alive neighbors is evil.'
    },
    {
        name: "Fortune Teller",
        type: TOWNSFOLK,
        isGood: true,
        category: NIGHTLY_GOOD,
        effect: 'Fortune Teller choose 2 players. Nod if either is a Demon.'
    },
    {
        name: "Undertaker",
        type: TOWNSFOLK,
        isGood: true,
        category: NIGHTLY_GOOD,
        effect: 'Show them the role of the person that died by execution.'
    },
    {
        name: "Monk",
        type: TOWNSFOLK,
        isGood: true,
        category: NIGHTLY_GOOD,
        effect: 'Monk points at someone. They are protected from the Evil.'
    },
    {
        name: "Ravenkeeper",
        type: TOWNSFOLK,
        isGood: true,
        category: NORMAL,
        effect: 'If Ravenkeeper dies, they wake up and choose a player. Show them their role.'
    },
    {
        name: "Virgin",
        type: TOWNSFOLK,
        isGood: true,
        category: NORMAL,
        effect: 'If you are nominated, the nominator dies if they are a Townsfolk.'
    },
    {
        name: "Slayer",
        type: TOWNSFOLK,
        isGood: true,
        category: NORMAL,
        effect: 'Once per game, choose a player. If they are the Demon, they die.'
    },
    {
        name: "Soldier",
        type: TOWNSFOLK,
        isGood: true,
        category: NORMAL,
        effect: 'You are safe from the Demon.'
    },
    {
        name: "Mayor",
        type: TOWNSFOLK,
        isGood: true,
        category: NORMAL,
        effect: 'If only 3 players live and no execution occurs, you win. If Mayor is eaten, somone else might be eaten.'
    },

    {
        name: "Butler",
        type: OUTSIDERS,
        isGood: true,
        category: NIGHTLY_GOOD,
        effect: 'Butler chooses a player. They can only vote if they vote.'
    },
    {
        name: "Drunk",
        type: OUTSIDERS,
        isGood: true,
        category: NORMAL,
        effect: 'Drunk believes is a role, but is actually not. They get wrong or random information.'
    },
    {
        name: "Recluse",
        type: OUTSIDERS,
        isGood: true,
        category: NORMAL,
        effect: 'Recluse might register as Evil, even if dead.'
    },
    {
        name: "Saint",
        type: OUTSIDERS,
        isGood: true,
        category: NORMAL,
        effect: 'If Saint dies by execution, Townsfolk lose.'
    },

    {
        name: "Poisoner",
        type: MINIONS,
        isGood: false,
        category: NIGHTLY_EVIL,
        effect: 'Poisoner chooses a player. That player becomes poisoned this night and the following day.'
    },
    {
        name: "Spy",
        type: MINIONS,
        isGood: false,
        category: NIGHTLY_EVIL,
        effect: 'Spy can see all roles. Spy might register as Good, even if dead.'
    },
    {
        name: "Scarlet Woman",
        type: MINIONS,
        isGood: false,
        category: NORMAL,
        effect: 'If Imp dies, Scarleet Woman becomes Imp (only if there are 5 or more people alive)'
    },
    {
        name: "Baron",
        type: MINIONS,
        isGood: false,
        category: NORMAL,
        effect: 'There are 2 extra Outsiders.'
    },
    {
        name: "Imp",
        type: DEMONS,
        isGood: false,
        category: NIGHTLY_EVIL,
        effect: 'Imp points at someone. They die.'
    }
]



const firstNightOrder = [
    'Imp',
    "Poisoner",
    'Spy',
    'Washerwoman',
    'Librarian',
    'Investigator',
    'Chef',
    'Empath',
    'Fortune Teller',
    'Butler'
]
export function getBOTCTSetupRolePriority(roleOrRoleName) {
    const roleName = roleOrRoleName.name != null? roleOrRoleName.name: roleOrRoleName
    const index = firstNightOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}

const everyNightOrder = [
    'Poisoner',
    'Monk',
    'Spy',
    'Scarlet Woman',
    'Imp',
    'Ravenkeeper',
    'Undertaker',
    'Empath',
    'Fortune Teller',
    'Butler'
]
export function getBOTCTNightlyRolePriority(roleOrRoleName) {
    const roleName = roleOrRoleName.name != null? roleOrRoleName.name: roleOrRoleName
    const index = everyNightOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}

export function getBOTCTRole(name) {
    return getBOTCTRoles().find(role => role.name == name)
}

function getNDemonsByPeople(nPeople) {
    return 1
}
function getNMinionsByPeople(nPeople) {
    if (nPeople <= 9) return 1
    if (nPeople <= 12) return 2
    return 3
}
function getNOutsidersByPeople(nPeople) {
    const nPlayersToOutsiders = {
        5: 0,
        6: 1,
        7: 0,
        8: 1,
        9: 2,
        10: 0,
        11: 1,
        12: 2,
        13: 0,
        14: 1,
        15: 2
    }
    return nPlayersToOutsiders[nPeople]
}

function getSomeMinionRoles(nPeople) {
    const minions = randomizeArray(getBOTCTRoles().filter(role => role.type == MINIONS))
    const nMinions = getNMinionsByPeople(nPeople)
    return minions.slice(0, nMinions)
}
function getSomeOutsidersRoles(rolesSoFar, nPeople) {
    const outsiders = randomizeArray(getBOTCTRoles().filter(role => role.type == OUTSIDERS))
    let nOutsiders = getNOutsidersByPeople(nPeople)
    const isBaronInPlay = rolesSoFar.filter(role => role.name == 'Baron').length == 1
    if (isBaronInPlay) {
        nOutsiders += 2
        console.log(`Baron is in play!`)
    }
    console.log({nOutsiders})
    console.log(outsiders)
    console.log(outsiders.slice(0, nOutsiders))
    return outsiders.slice(0, nOutsiders)
}
function getSomeTownsfolkRoles(nTownsfolk) {
    let townsfolk = randomizeArray(getBOTCTRoles().filter(role => role.type == TOWNSFOLK))
    const townsfolkSoFar = []
    let townsfolkCategories = [SETUP_GOOD, NIGHTLY_GOOD, NORMAL]

    while (townsfolkSoFar.length < nTownsfolk) {
        const currentTownsfolkCategory = townsfolkCategories.shift()
        townsfolkCategories.push(currentTownsfolkCategory)

        const foundRoleIndex = townsfolk.findIndex(role => role.category == currentTownsfolkCategory)
        const foundRole = popArrayElementAt(townsfolk, foundRoleIndex)
        townsfolkSoFar.push(foundRole)
    }
    return townsfolkSoFar
}
function getDrunkRole(rolesSoFar) {
    const isRoleUsed = role => rolesSoFar.find(roleSoFar => roleSoFar.name == role.name) != null
    const rolesNotUsed = getBOTCTRoles().filter(role => !isRoleUsed(role))

    let townsfolkCategories = [NIGHTLY_GOOD, SETUP_GOOD, NORMAL]
    for (const category of townsfolkCategories) {
        const foundRole = rolesNotUsed.find(role => role.category == category)
        if (foundRole != null) {
            return foundRole
        }
    }
    
    return null
}


export function getBOTCTRolesByPeople(nPeople) {
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)

    let rolesSoFar = [getBOTCTRole('Imp')]

    const minions = getSomeMinionRoles(nPeople)
    rolesSoFar = [...rolesSoFar, ...minions]

    const outsiders = getSomeOutsidersRoles(rolesSoFar, nPeople)
    rolesSoFar = [...rolesSoFar, ...outsiders]

    const nTownsfolk = nPeople - 1 - minions.length - outsiders.length
    const townsfolk = getSomeTownsfolkRoles(nTownsfolk)
    

    const isDrunkInGame = rolesSoFar.find(role => role.name == 'Drunk') != null
    if (isDrunkInGame) {
        console.log(`Yes drunk`)
        const differentRole = getDrunkRole(townsfolk)
        const drunkIndex = rolesSoFar.findIndex(role => role.name == 'Drunk')
        rolesSoFar[drunkIndex] = {...differentRole, isDrunk: true}
    }

    rolesSoFar = [...rolesSoFar, ...townsfolk]

    console.log({rolesSoFar})
    return rolesSoFar
}
if (browser) {

}


function get3RandomUnusedRolesByHTML() {
    throw "TODO get3RandomUnusedRolesByHTML"
    // const rolesThisGame = getHTMLRoleStates()
    // const isRoleInGame = (roleState) => rolesThisGame.find(role => role.name == roleState.name) != null
    // const townsfolkNotInGame = getBOTCTRoles().filter(role => isRoleInGame(role) == false).filter(role => role.isGood)
    // randomizeArray(townsfolkNotInGame)
    // return townsfolkNotInGame.slice(0, 3)
}
