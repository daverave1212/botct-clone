import { get, writable } from 'svelte/store'
import { getLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'

export const hasAddPlayerTooltip = localStorageWritable('hasAddPlayerTooltip', true)
export const hasRegenerateRolesTooltip = localStorageWritable('hasRegenerateRolesTooltip', true)
export const hasSetRoleTooltip = localStorageWritable('hasSetRoleTooltip', true)
export const hasInspectTooltip = localStorageWritable('hasInspectTooltip', true)
export const hasExpandTooltip = localStorageWritable('hasExpandTooltip', true)
export const hasSortTooltip = localStorageWritable('hasSortTooltip', true)


