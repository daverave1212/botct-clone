import { browser } from '$app/environment'
import { get, writable } from 'svelte/store'
import { COMPLETE, getNightlyRolePriority, getNormalRolePriority, getRole, getRolesByDifficulty, getSetupRolePriority, getSortRolesWithPriorityFunction } from '$lib/shared-lib/SharedDatabase'
import { getLocalStorageObject, localStorageWritable } from '../lib/svelteUtils'

export const rolesDistribution = localStorageWritable('rolesDistribution', [])

export function setupCustomDifficultyRoles() {
    const allAvailableRoles = getRolesByDifficulty(COMPLETE)
    const paddedRoles = [...allAvailableRoles,
        getRole('Peasant'),
        getRole('Peasant'),
        getRole('Peasant'),
        getRole('Peasant'),
        getRole('Peasant'),
        getRole('Peasant'),
        getRole('Cultist'),
        getRole('Cultist'),
        getRole('Strigoy'),
        getRole('Strigoy')
    ]
    const roles = getSortRolesWithPriorityFunction(paddedRoles, getNormalRolePriority)
        .map(role => ({...role, isInGame: true}))
    rolesDistribution.set(roles)
    
}

if (browser) {
    window.patchRole = function(oldRoleName, newRoleName) {
        const newRolesDistribution = get(rolesDistribution)
        const role = newRolesDistribution.find(role => role.name == oldRoleName)
        const newRole = getRole(newRoleName)
        role.name = newRoleName
        role.effect = newRole.effect
        role.notes = newRole.notes
        role.narratorNotes = newRole.narratorNotes
        role.isValid = true
        console.log({role})
        rolesDistribution.set(newRolesDistribution)
    }
}