import { get, writable } from 'svelte/store'
import { getLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'
import { isNumber } from '../lib/utils'
import { BAD_MOON_RISING, SECTS_AND_VIOLETS, TROUBLE_BREWING, getRoleByI, getRoles } from '$lib/shared-lib/SharedDatabase'

const DEFAULT_SCRIPTS = {
    'Trouble Brewing': getRoles().filter(role => role.difficulty == TROUBLE_BREWING).map(role => role.name),
    'Bad Moon Rising': getRoles().filter(role => role.difficulty == BAD_MOON_RISING).map(role => role.name),
    'Sects and Violets': getRoles().filter(role => role.difficulty == SECTS_AND_VIOLETS).map(role => role.name),
    'My Custom Script': [    // TODO: Remove this and replace it
        'Librarian',
        'Investigator',
        'Clockmaker',
        'Grandmother',
        
        'Chef',     // Not tested
        'Empath',
        'Dreamer',
        'Monk',
        'Undertaker',
        'Fool',
        'Soldier',
        'Virgo',    // Not tested

        'Saint',
        'Drunk',
        'Moonchild',
        'Mutant',

        'Scarlet Woman',
        'Baron',
        'Intoxist', // Not implemented
        'Assassin', // Not tested
        'Spy',

        'Imp'
    ]
}

export const customScripts = localStorageWritable('customScripts', DEFAULT_SCRIPTS)

export function resetCustomScripts() {
    customScripts.set(DEFAULT_SCRIPTS)
}

export function getCustomScriptRoleNames(scriptName) {
    return get(customScripts)[scriptName] || []     // To work when preloading
}
export function setCustomScript(scriptName, roleNamesOrIs) {
    if (!Array.isArray(roleNamesOrIs)) {
        console.log({roleNamesOrIs})
        alert(`Internal error: roles given are not an array but ${typeof roleNamesOrIs}. Printed object to console.`)
    }
    if (roleNamesOrIs == null || roleNamesOrIs.length == 0) {
        alert("No roles given.")
        return
    }
    console.log({roleNamesOrIs})
    let roleNames = roleNamesOrIs
    if (isNumber(roleNamesOrIs[0])) {
        roleNames = roleNamesOrIs.map(i => getRoleByI(i).name)
    }

    const newCustomScripts = {...get(customScripts)}
    newCustomScripts[scriptName] = roleNames
    customScripts.set(newCustomScripts)
}
