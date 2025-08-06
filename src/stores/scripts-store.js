import { getLocalStorageObject, hasLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'

export const chosenScriptName = localStorageWritable('chosenScriptName', null)
export const chosenScriptRoleNames = localStorageWritable('chosenScriptRoleNames', null)