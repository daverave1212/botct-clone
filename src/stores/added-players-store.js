import { get, writable } from 'svelte/store'
import { getLocalStorageObject, hasLocalStorageObject, localStorageWritable, setLocalStorageObject } from '../lib/svelteUtils'
import { NO_PRIORITY, getNightlyRolePriority, getRole, getRoles, getSetupRolePriority } from '../lib/Database'
import { isSecretBOTCT } from './secret-botct-store'
import { getBOTCTNightlyRolePriority, getBOTCTSetupRolePriority } from '../lib/BOTCTDatabase'

export const addedPlayers = localStorageWritable('addedPlayers', [])

export function getAddedPlayerRoleDifficulties() {
    const rolesInGame = get(addedPlayers)
        .map(player => player.role != null? getRole(player.role): null)
        .filter(role => role != null)
    let foundDifficulties = []
    for (const role of rolesInGame) {
        if (foundDifficulties.includes(role.difficulty) == false) {
            foundDifficulties.push(role.difficulty)
        }
    }
    return foundDifficulties
}

export function addPlayer(extraProps) {
    let newContact = {
        subtitle: '',
        src: 'images/user.png',
        role: null,
        name: null,

        isPortraitCentered: true,
        isExpanded: false,
        hasSpaceUnderneath: false,
        isEditMode: true
    }
    if (extraProps != null) {
        newContact = {...newContact, ...extraProps}
    }
    addedPlayers.set([...get(addedPlayers), newContact])
    if (newContact == null) {
        console.log(extraProps)
        console.error('ERROR: Null newContact!')
        console.log(new Error())
    }
    return newContact
}
export function addPlayerAdded(extraProps, name) {
    return addPlayer({
        subtitle: name,
        isEditMode: false,
        ...extraProps
    })
}
export function addPlayerTemporary(roleName) {
    return addPlayer({
        role: roleName,
        name: roleName,
        subtitle: '--',
        src: `images/roles/${roleName}.png`,
    })
}
export function isPlayerTemporary(player) {
    return player.subtitle == '--'
}
export function removePlaceholderRoles() {
    addedPlayers.set(get(addedPlayers).filter(player => isPlayerTemporary(player) == false))
}

export function setPlayerStateI(i, newState) {
    const newAddedPlayers = get(addedPlayers)
    newAddedPlayers[i] = newState
    addedPlayers.set(newAddedPlayers)
}

export function removePlayer(i) {
    const newAddedPlayers = get(addedPlayers)
    newAddedPlayers.splice(i, 1)
    addedPlayers.set(newAddedPlayers)
}

export function test_addPlayers(nPlayers) {
    addedPlayers.set([])
    for (let i = 0; i < nPlayers; i++) {
        addPlayer({ isEditMode: false, subtitle: 'Player' + i})
    }
}

export function sortCurrentRolesSetup() {
    const getRolePriority = getSetupRolePriority
    const addedPlayersSorted = get(addedPlayers)
        .sort((a,b) => getRolePriority(a.role) - getRolePriority(b.role))
        .map(player => ({...player, hasSpaceUnderneath: false}))
    const firstPlayerWithNoPriorityI = addedPlayersSorted.findIndex(player => getRolePriority(player.role) == NO_PRIORITY) - 1
    if (firstPlayerWithNoPriorityI >= 0) {
        addedPlayersSorted[firstPlayerWithNoPriorityI].hasSpaceUnderneath = true
    }
    addedPlayers.set(addedPlayersSorted)
}

export function sortCurrentRolesNightly() {
    const getRolePriority = getNightlyRolePriority
    console.log(get(addedPlayers))
    const addedPlayersSorted = get(addedPlayers)
        .sort((a,b) => getRolePriority(a.role) - getRolePriority(b.role))
        .map(player => ({...player, hasSpaceUnderneath: false}))
    console.log({addedPlayersSorted})
    const firstPlayerWithNoPriorityI = addedPlayersSorted.findIndex(player => {
        const priority = getRolePriority(player.role)
        console.log(`Role ${player.role} priority: ${priority}`)
        return priority == NO_PRIORITY
    }) - 1
    console.log({firstPlayerWithNoPriorityI})
    if (firstPlayerWithNoPriorityI >= 0) {
        addedPlayersSorted[firstPlayerWithNoPriorityI].hasSpaceUnderneath = true
    }
    addedPlayers.set(addedPlayersSorted)
}

export function getResetPlayer(player) {
    return {
        ...player,
        role: null,
        src: 'images/user.png',
        hasSpaceUnderneath: false,
        statusEffects: null,
        isDead: false
    }
}