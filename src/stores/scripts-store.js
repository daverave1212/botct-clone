import { get, writable } from 'svelte/store'
import { ADVANCED, BAD_MOON_RISING, COMPLETE, INTERMEDIATE } from '../lib/Database'
import { getLocalStorageObject, hasLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'
import { notNullOr, randomizeArray } from '../lib/utils'
import { getMods } from '../lib/ModsDatabase'

export const chosenScriptName = localStorageWritable('chosenScriptName', null)
export const chosenScriptRoleNames = localStorageWritable('chosenScriptRoleNames', null)