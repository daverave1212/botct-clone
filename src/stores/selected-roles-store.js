import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'
import { COMPLETE, getNightlyRolePriority, getNormalRolePriority, getRole, getRolesByDifficulty, getSetupRolePriority, getSortRolesWithPriorityFunction } from '$lib/shared-lib/SharedDatabase'
import { getLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'

export const selectedRoles = localStorageWritable('selectedRoles', [])