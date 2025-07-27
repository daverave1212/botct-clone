import { browser } from '$app/environment'
import { writable, get } from 'svelte/store'
import { getBOTCTRoles, getBOTCTRolesByPeople, getBOTCTSetupRolePriority } from '../lib/BOTCTDatabase'
import { rolesDistribution } from './roles-store'

export const isSecretBOTCT = writable(false)

export function autochooseBOTCTRoles(nPlayers) {
    const allAvailableRoles = getBOTCTRoles()
    const isRoleInGame = role => rolesInGame.find(roleInGame => roleInGame.name == role.name) != null
    let rolesInGame = getBOTCTRolesByPeople(nPlayers).map(role => ({...role, isInGame: true}))
        rolesInGame = rolesInGame.sort((a, b) => getBOTCTSetupRolePriority(a) - getBOTCTSetupRolePriority(b))
    let rolesNotInGame = allAvailableRoles.filter(role => isRoleInGame(role) == false).map(role => ({...role, isInGame: false}))
    rolesDistribution.set([...rolesInGame, ...rolesNotInGame])
}