import { ActionTypes, ActionDurations, GamePhases, StatusEffectDuration, SourceOfDeathTypes } from "$lib/shared-lib/GamePhases"
import { roomCode } from "../../stores/online/local/room"
import { InfoTypes } from "$lib/shared-lib/GamePhases"
import { getNightlyRolePriority, getRole, getRoleNumbersByPlayers, getSetupRolePriority } from "$lib/shared-lib/SharedDatabase"
import { createRandomCode, popArrayElementFind, randomOf, randomizeArray, swapElementsAt } from "./utils"
import { randomInt } from "crypto"
import { percentChance } from "$lib/shared-lib/shared-utils"


let IS_DEBUG = false

export function setIsDebug(val) {
    IS_DEBUG = val
}
export function getIsDebug() {
    return IS_DEBUG
}


function generateRandomRoomCode() {
    let randomRoomCode
    do {
        randomRoomCode = createRandomCode(2)
    } while (randomRoomCode in games)
    return randomRoomCode
}


const SOURCE_OF_DEATH_TEMPLATE = {
    type: SourceOfDeathTypes.DEMON_KILL,
    playerName: null
}

const INFO_TEMPLATE = {
    type: InfoTypes.ROLES,
    buttonText: 'Secret Info',
    buttonColor: null,  // Default is a shade of blue
    roles: ['Professor', 'Investigator'],
    showsRoleDescriptions: false,
    text: ''
}
const AVAILABLE_ACTION_TEMPLATE = {
    type: ActionTypes.CHOOSE_PLAYER
}
const STATUS_EFFECT_TEMPLATE = {
    name: 'Protected',
    duration: StatusEffectDuration.UNTIL_NIGHT,
    isPoisoned: false,
    onDeath: (game, me, source) => true,    // Returns true if should continue death
}


class Player {
    constructor({ name, src, emoji='❓', color='hsl(0, 70%, 60%)', privateKey }, roomCode) {
        this.name = name
        this.src = src
        this.emoji = emoji
        this.color = color
        this.privateKey = privateKey
        this.roomCode = roomCode

        this.role = null
        this.isPoisoned = false
        
        this.isDead = false
        this.changedAlignment = null
        
        this.info = null
        this.availableAction = null

        this.statusEffects = []

        this.poisonEffectHistory = []

        this.secretRole = null
        this.hasOnlySecretRolePowers = false
    }

    inspectRole() {
        const trueRole = this.getTrueRole()
        if (trueRole?.onInspected != null) {
            return trueRole.onInspected(this)
        }
        return trueRole
    }

    useAction(game, actionData) {
        const actionFunc = this.hasOnlySecretRolePowers?
            this.secretRole?.onPlayerAction
            :this?.role?.onPlayerAction
        if (actionFunc == null) {
            return
        }
        if (this.availableAction == null) {
            return
        }
        this.availableAction = null
        actionFunc(game, this, actionData)
    }

    assignRoleLater(game, role, options = {}) {
        const { ignoreAssignEvent } = options 
        role = role.name == null? getRole(role): role
        this.role = role
        if (ignoreAssignEvent) {
            return
        }
        if (this.role.afterAssignRole != null) {
            this.role.afterAssignRole(game, this)
        }
    }
    reassignRole(game, role, options={}) {
        const { ignoreAssignEvent } = options 
        role = role.name == null? getRole(role): role

        this.role = role
        this.secretRole = null
        this.info = null
        this.availableAction = null
        this.hasOnlySecretRolePowers = false
        if (ignoreAssignEvent) {
            return
        }
        this.role?.afterAssignRole?.(game, this)
    }


    isEvil() {
        if (this.changedAlignment == 'evil') {
            return true
        }
        return this.secretRole == null?
            this.role?.isEvil
            :this.secretRole.isEvil
    }

    isRegisteredAsEvil() {
        return this.inspectRole()?.isEvil
    }

    isOutsider() {  // Role is outsider, or secretRole is outsider (Drunk, Recluse)
        return this.getTrueRole()?.isOutsider
    }

    getTrueRole() {
        if (this.secretRole == null && this.role == null) {
            const msg = `Player ${this.name} has no role!`
            console.error(`⭕ ${msg}`)
        }
        if (this.secretRole != null) {
            return this.secretRole
        }
        return this.role
    }

    isTownsfolk() {
        return !this.isOutsider() && !this.isEvil()
    }

    isDrunkOrPoisoned() {
        const poisonStatus = this.statusEffects.find(se => se.isPoisoned)
        const amI = this.isPoisoned || poisonStatus != null
        if (amI) {
            this.poisonEffectHistory.push({
                roundNumber: getGame(this.roomCode)?.roundNumber,
                name: poisonStatus.name
            })
        }
        return amI
    }

    getLastPoisonEffect() {
        return this.poisonEffectHistory[this.poisonEffectHistory.length - 1]
    }

    removeStatus(statusEffectName) {
        this.statusEffects = this.statusEffects.filter(s => s.name != statusEffectName)
    }

    poison(statusName='Poisoned', eventName='afterNightStart') {
        const clearStatusFunc = (game, me) => {
            me.removeStatus(statusName)
        }
        this.statusEffects.push({
            name: statusName,
            isPoisoned: true,
            [eventName]: clearStatusFunc
        })
    }


    addStatus(obj) {
        this.statusEffects.push(obj)
    }

    hasStatus(name) {
        return this.statusEffects.some(se => se.name == name)
    }

    getPower() {
        const game = getGame(this.roomCode) ?? null
        if (game == null) {
            console.error(`❌ unable to find game room ${this.roomCode}`)
            return 0
        }
        if (this.getTrueRole() == null) {
            return 0
        }
        if (this.getTrueRole().getPower == null) {
            return 0
        }
        return this.getTrueRole()?.getPower(game, this)
    }

    applyAllMyDeathEventsAt(game, eventName, source) {
        const usedRole = this.hasOnlySecretRolePowers? this.getTrueRole(): this.role
        const player = this
        for (const statusEffect of [...player.statusEffects]) {
            if (statusEffect[eventName] != null) {
                const shouldContinue = statusEffect[eventName](game, player, source)
                if (shouldContinue == false) {  // true or null should both continue
                    return false
                }
            }
        }

        // console.log(`Killing through role onDeath...`)
        if (usedRole?.[eventName] != null) {
            const shouldContinue = usedRole[eventName](game, player, source)
            if (shouldContinue == false) {
                return false
            }
        }
        return true
    }

    applyAllMyEventsAt(game, eventName) {
        const usedRole = this.hasOnlySecretRolePowers? this.getTrueRole(): this.role
        if (usedRole.actionDuration == eventName) {
            this.availableAction = null
        }
        if (usedRole.infoDuration == eventName) {
            this.info = null
        }

        let skipsRoleEvent = false
        for (const statusEffect of [...this.statusEffects]) {
            const eventFuncToCall = statusEffect[eventName]
            if (eventFuncToCall == null) {
                continue
            }
            skipsRoleEvent = eventFuncToCall(game, this) == false
            if (skipsRoleEvent) {
                break
            }
        }
        if (!skipsRoleEvent) {
            usedRole?.[eventName]?.(game, this)
        }
    }
}


export const games = {}
export const getGames = () => games
class Game {

    ownerName
    
    roomCode
    scriptName
    scriptRoleNames
    privateKey

    playersInRoom

    phase
    countdownRemaining

    countdownStart
    countdownDuration

    killHistory
    roundNumber

    winner

    lastNotification

    constructor(ownerName, options={}) {
        const { customRoomCode } = options
        this.ownerName = ownerName
        this.roomCode = customRoomCode ?? generateRandomRoomCode()
        this.scriptName = 'A Custom Script'
        this.scriptRoleNames = []
        this.privateKey = createRandomCode(6)

        this.playersInRoom = []
        this.phase = GamePhases.NOT_STARTED

        this.killHistory = []

        this.roundNumber = 0

        this.pregameDuration = 10
        this.nightDuration = 30
    }

    sendNotification(type, text) {
        this.lastNotification = {
            type,
            text
        }
    }

    goToNightThenDayAsync() {
        this.startNight()
        this.doAfterCountdown(this.nightDuration * 1000, () => {
            this.startDay()
        })
    }
    startNight() {
        this.#applyAllEventsAt('onDayEnd')
        this.roundNumber += 1
        this.phase = GamePhases.NIGHT
        this.#applyAllEventsAt('onNightStart')
        this.#applyAllEventsAt('afterNightStart')
    }
    startDay() {
        for (const player of this.playersInRoom) {
            player.info = null
        }
        this.#applyAllEventsAt('onNightEnd')
        this.phase = GamePhases.DAY
        this.#applyAllEventsAt('onDayStart')
    }

    #applyAllEventsAt(eventName) {
        for (const player of this.getAlivePlayers()) {
            player.applyAllMyEventsAt(this, eventName)
        }
    }



    start() {
        this.phase = GamePhases.COUNTDOWN
        this.assignRoles()
        this.doRolesSetup()

        this.doAfterCountdown(this.pregameDuration * 1000, () => {
            this.goToNightThenDayAsync()
        })
    }

    assignRoles() {
        if (IS_DEBUG) {
            this.setTestPlayersWithRoles(['Fool', 'Fool', 'Fool', 'Fool', 'Fool'])
        }

        const rolesToAssign = randomizeArray(this.getRolesToAssign())
        for (let i = 0; i < rolesToAssign.length; i++) {
            this.playersInRoom[i].role = rolesToAssign[i]
        }

        if (IS_DEBUG) {
            const makeMeRole = (roleName) => {
                const dude = this.playersInRoom.find(p => p.role?.name == roleName)
                const dudeRole = dude.role
                dude.role = this.playersInRoom[0].role
                this.playersInRoom[0].role = dudeRole
            }

            this.playersInRoom[0].role = getRole('Fortune Teller')

        }

        this.#applyAllEventsAt('onAssignRole')

        if (IS_DEBUG) {
            // this.playersInRoom[0].assignRoleLater(this, 'Imp')
            // this.playersInRoom[1].assignRoleLater(this, 'Recluse')
        }

        this.#applyAllEventsAt('afterAssignRole')
    }

    getRolesToAssign() {
        const { nTownsfolk, nOutsiders, nMinions, nDemons } = getRoleNumbersByPlayers(this.playersInRoom.length)
        const scriptRoles = randomizeArray(this.scriptRoleNames.map(rn => getRole(rn)))
        const rolesInThisGame = []

        for (let i = 0; i < nDemons; i++) {
            const role = popArrayElementFind(scriptRoles, r => r.isDemon)
            if (role) {
                rolesInThisGame.push(role)
            }
        }
        for (let i = 0; i < nMinions; i++) {
            const role = popArrayElementFind(scriptRoles, r => r.isEvil && !r.isDemon)
            if (role) {
                rolesInThisGame.push(role)
            }
        }
        for (let i = 0; i < nOutsiders; i++) {
            const role = popArrayElementFind(scriptRoles, r => r.isOutsider)
            if (role) {
                rolesInThisGame.push(role)
            }
        }
        for (let i = 0; i < nTownsfolk; i++) {
            const role = popArrayElementFind(scriptRoles, r => !r.isOutsider && !r.isEvil)
            if (role) {
                rolesInThisGame.push(role)
            }
        }
        
        return rolesInThisGame
    }

    doRolesSetup() {
        this.#applyAllEventsAt('onSetup')
    }

    getScriptRoleObjects() { return this.scriptRoleNames.map(rn => getRole(rn)) }
    getScriptEvilRoleNames() { return this.getScriptRoleObjects().filter(r => r.isEvil).map(r => r.name) }
    getScriptGoodRoleNames() { return this.getScriptRoleObjects().filter(r => !r.isEvil).map(r => r.name) }
    getPlayers() { return this.playersInRoom }
    getPlayersExcept(nameOrNames) { 
        const names = Array.isArray(nameOrNames)? nameOrNames: [nameOrNames]
        return this.playersInRoom.filter(p => !names.includes(p.name))
    }
    getPlayerAt(i) {
        return this.playersInRoom[i]
    }
    at(i) {
        return this.playersInRoom[i]
    }
    getPlayer(nameOrPlayer) {
        if (nameOrPlayer == null) {
            console.warn('⚠️ getPlayer given null parameter.')
            return null
        }
        const playerName = (typeof nameOrPlayer === 'string')? nameOrPlayer: nameOrPlayer.name
        return this.playersInRoom.find(p => p.name == playerName)
    }
    addPlayer(player) {
        this.playersInRoom.push(player)
    }
    hasPlayer(playerName) { 
        const playersByThatName = this.playersInRoom.filter(p => p.name == playerName)
        if (playersByThatName.length == 0) {
            return false
        }
        return true
    }
    filter(func) {
        return this.playersInRoom.filter(func)
    }

    getPlayersSortedForSetup() {
        return this.playersInRoom.sort((a, b) => getSetupRolePriority(a.getTrueRole()) - getSetupRolePriority(b.getTrueRole()))
    }
    getPlayersSortedForNight() {
        return this.playersInRoom.sort((a, b) => getNightlyRolePriority(a.getTrueRole()) - getNightlyRolePriority(b.getTrueRole()))
    }
    getMinions() {
        return randomizeArray(this.playersInRoom.filter(p =>
            (p.isEvil()) &&
            !p.getTrueRole().isDemon
        ))
    }
    getEvils() {
        return randomizeArray(this.playersInRoom.filter(p => p.isEvil()))
    }
    getPlayersThatRegisterAsEvil() {
        return randomizeArray(this.playersInRoom.filter(p => p.isRegisteredAsEvil()))
    }
    getPlayersThatRegisterAsGood() {
        return randomizeArray(this.playersInRoom.filter(p => !p.inspectRole().isEvil || p.changedAlignment == 'evil'))
    }
    getAlivePlayers() {
        return this.playersInRoom.filter(p => !p.isDead)
    }
    getAliveEvils() {
        return randomizeArray(this.playersInRoom.filter(p => p.isEvil() && !p.isDead))
    }
    getAliveMinions() { return this.getMinions().filter(p => !p.isDead)}
    getTownsfolk() {
        return randomizeArray(this.playersInRoom.filter(p => !p.isEvil()))
    }
    getNonOutsiderTownsfolk() {
        return this.getTownsfolk().filter(p => !p.isOutsider())
    }
    getAliveTownsfolk() { return this.getTownsfolk().filter(p => !p.isDead)}
    getOutsiders() {
        return randomizeArray(this.playersInRoom.filter(p => p.isOutsider()))
    }
    getAliveOutsiders() { return this.getOutsiders().filter(p => !p.isDead)}
    getDemon() {
        return this.playersInRoom.find(p => p.isDemon)
    }
    getLastExecutedPlayer() {
        const usedHistory = this.killHistory?.filter(e => e != null) ?? []
        for (let i = usedHistory?.length - 1; i >= 0; i--) {
            const { playerName, source } = usedHistory[i]
            if (source?.type == SourceOfDeathTypes.EXECUTION) {
                return this.getPlayer(playerName)
            }
        }
        return null
    }
    getLastExecution() {
        const usedHistory = this.killHistory?.filter(e => e != null) ?? []
        for (let i = usedHistory.length - 1; i >= 0; i--) {
            console.log({i})
            const { playerName, source } = usedHistory[i]
            if (source?.type == SourceOfDeathTypes.EXECUTION) {
                return usedHistory[i]
            }
        }
        return null
    }
    getNextPlayer(player) {
        const i = this.playersInRoom.findIndex(p => p.name == player.name)
        let nextI = i + 1
        if (nextI >= this.playersInRoom.length) {
            nextI = 0
        }
        return nextI
    }
    getNextAlivePlayer(player) {
        let tries = 1
        let i = this.playersInRoom.findIndex(p => p.name == player.name)
        do {
            i += 1
            if (i >= this.playersInRoom.length) {
                i = 0
            }
            if (!this.getPlayerAt(i).isDead) {
                return this.getPlayerAt(i)
            }
        } while (tries <= this.playersInRoom.length)
        return null
    }
    getPreviousAlivePlayer(player) {
        let tries = 1
        let i = this.playersInRoom.findIndex(p => p.name == player.name)
        do {
            i -= 1
            if (i < 0) {
                i = this.playersInRoom.length - 1
            }
            if (!this.getPlayerAt(i).isDead) {
                return this.getPlayerAt(i)
            }
        } while (tries <= this.playersInRoom.length)
        return null
    }
    getPreviousPlayer(player) {
        const i = this.playersInRoom.findIndex(p => p.name == player.name)
        let prevI = i + 1
        if (prevI < 0) {
            prevI = this.playersInRoom.length - 1
        }
        return prevI
    }

    getRandomEvilRoleNameInScript() {
        return randomOf(...(this.getScriptRoleObjects().filter(r => r.isEvil))).name
    }
    getRandomTownsfolkRoleAsPoisoned() {
        if (percentChance(50) && this.isRoleInScript('Drunk')) {
            return 'Drunk'
        }
        return this.getRandomEvilRoleNameInScript()
    }
    getRandomGoodRoleAsPoisoned() {
        const goodRolesNotInGame = this.getGoodsNotInGame()
        if (percentChance(50) && this.isRoleInScript('Drunk')) {
            return 'Drunk'
        }
        if (goodRolesNotInGame.length == 0) {
            return randomOf(...this.getScriptGoodRoleNames())
        } else {
            return randomOf(...goodRolesNotInGame).name
        }
    }
    
    getRolesNotInGame() {   // Includes secret roles
        const playerRoleNames = this.playersInRoom.map(p => p.role.name)
        const cleanedPlayerRoleNames = playerRoleNames.filter(rn => rn != null) // For safety

        const isRoleInGame = rn => cleanedPlayerRoleNames.includes(rn)

        return this.scriptRoleNames
            .filter(rn => !isRoleInGame(rn))
            .map(rn => getRole(rn))
    }
    getEvilsNotInGame() {
        return this.getRolesNotInGame().filter(r => r.isEvil)
    }
    getGoodsNotInGame() {
        return this.getRolesNotInGame().filter(r => !r.isEvil)
    }
    getRolesInGame() {
        return this.playersInRoom.map(p => p.getTrueRole())
    }
    isRoleInGame(roleOrRoleName) {  // Includes secret roles
        roleOrRoleName = roleOrRoleName.name ?? roleOrRoleName
        const thatPlayer = playersInRoom.find(p => p?.role?.name == roleOrRoleName || p?.secretRole?.name == roleOrRoleName)
        return thatPlayer != null
    }
    isRoleInScript(roleOrRoleName) {
        roleOrRoleName = roleOrRoleName.name ?? roleOrRoleName
        return this.scriptRoleNames.includes(roleOrRoleName)
    }
    checkWinConditions() {
        if (this.winner != null) {
            return
        }
        const demons = this.playersInRoom.filter(p => p.getTrueRole()?.isDemon)
        const areDemonsDead = demons.length == demons.filter(p => p.isDead).length
        const aliveEvils = this.getAliveEvils()
        const aliveTownsfolk = [...this.getAliveTownsfolk(), ...this.getAliveOutsiders()]


        if (aliveEvils.length == 0 && aliveTownsfolk.length == 0) {
            this.winner = 'Evil'
            return
        }
        if (aliveEvils.length == 1 && aliveTownsfolk.length == 1) {
            this.winner = 'Evil'
            return
        }
        if (aliveEvils.length > aliveTownsfolk.length) {
            this.winner = 'Evil'
            return
        }
        if (areDemonsDead) {
            this.winner = 'Townsfolk'
            return
        }
    }

    tryKillPlayer(playerOrName, source) {
        const player = typeof playerOrName === 'string'? this.getPlayer(playerOrName): this.getPlayer(playerOrName.name)
        if (source?.type == null) {
            console.log(source)
            throw `⭕ Null source or source.type for tryKillPlayer ${player.role?.name} (${player.name}). Source printed above.`
        }

        // console.log(`🗡️ Killing ${player.name} (${player.role?.name})`)

        if (player == null) {
            this.sendNotification('error', `Player ${playerOrName} not found.`)
        }
        if (player.role == null) {
            return
        }

        const shouldContinue = player.applyAllMyDeathEventsAt(this, 'onDeath', source)
        
        if (shouldContinue == false) {
            return
        }

        // console.log(`${player.role?.name} Is dead!`)
        player.isDead = true
        this.killHistory.push({
            playerName: player.name,
            roundNumber: this.roundNumber,
            source
        })
        this.sendNotification('info', `${player.name} has died.`)
        player.availableAction = null
        player.info = null
        player.applyAllMyDeathEventsAt(this, 'afterDeath', source)

        this.checkWinConditions()
    }
    movePlayerUp(playerOrName) {
        const player = this.getPlayer(playerOrName)
        const playerI = this.playersInRoom.findIndex(p => p.name == player.name)

        if (playerI == 0) {
            return
        }

        this.playersInRoom[playerI] = this.playersInRoom[playerI - 1]
        this.playersInRoom[playerI - 1] = player
    }
    movePlayerUpOrDown(playerOrName, upOrDown) {
        const player = this.getPlayer(playerOrName)
        const playerI = this.playersInRoom.findIndex(p => p.name == player.name)
        const otherPlayerI = upOrDown == 'up'? playerI - 1: (playerI + 1)
        swapElementsAt(this.playersInRoom, playerI, otherPlayerI)
    }

    movePlayerDown(playerOrName) {
        const player = this.getPlayer(playerOrName)
        const playerI = this.playersInRoom.findIndex(p => p.name == player.name)

        if (playerI == this.playersInRoom.length - 1) {
            return
        }

        this.playersInRoom[playerI] = this.playersInRoom[playerI + 1]
        this.playersInRoom[playerI + 1] = player
    }

    onPlayerActionST(user, p, actionData) {
        const player = this.getPlayer(p?.name || p)
        if (player == null) {
            return 404
        }
        const actionFunc = player.hasOnlySecretRolePowers?
            player?.secretRole?.onPlayerAction
            :player?.role?.onPlayerAction
        if (actionFunc == null) {
            return 400
        }
        if (p.availableAction == null) {    // Prevent multiple requests
            return 401
        }
        player.availableAction = null
        actionFunc(this, player, actionData)
        return 200
    }


    // Technical Utils
    toJsonObject() {
        return {...this}
    }
    doAfterCountdown(duration, cb) {
        if (this.countdownStart != null || this.countdownDuration != null) {
            throw `Can not start another countdown while one is already active.`
        }
        this.countdownStart = Date.now()
        this.countdownDuration = duration
        setTimeout(() => {
            this.countdownStart = null
            this.countdownDuration = null
            cb()
        }, duration)
    }
    getTotalPowerDynamics() {
        if (this.playersInRoom.some(p => p == null)) {
            console.log(this.playersInRoom)
            console.error('⭕ A player is null!!!')
        }
        try {
            const getPowers = players => players.map(p => p.getPower())
            const getTotalPower = players => players.map(p => p.getPower()).reduce((soFar, e) => soFar + e, 0)
            const goods = this.playersInRoom.filter(p => !p.isEvil())
            const goodPower = getTotalPower(goods)
            const evilPower = getTotalPower(this.playersInRoom.filter(p => p.isEvil()))
            return goodPower - evilPower
        } catch (e) {
            console.error('⭕ Error getting players power')
            console.error(e)
            return 0
        }
    }
    

    // Testing only
    setRoles(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.playersInRoom[i].role = getRole(arr[i])
        }
    }
    reset() {
        this.playersInRoom = []
        this.phase = GamePhases.NOT_STARTED
        return this
    }
    setTestPlayersWithRoles(arr) {
        for (let i = 0; i < arr.length; i++) {
            const playerName = randomOf('Si', 'Ca', 'A', 'Vi', 'Lu', 'Pe', 'Cata', 'Andre', 'Co', 'Ra') + randomOf('lviu', 'lin', 'lex', 'ola', 'ca', 'na', 'dro', 'lbert', 'i', 'ia', 'smin', 'du')
            // console.log(playerName)
            const playerIndex = this.playersInRoom.findIndex(p => p.name == playerName)
            // console.log(playerIndex)
            const playerTemplate = {
                name: playerName,
                emoji: randomOf(...'🦁🐯🦒🦊🦝🐮🐷🐗🐭🐹🐰🐻🐻‍❄️🐨🐼🐸🦓🐴🫎🫏🦄🐔🐲🐽🐾🐒🦍🦧🦮🐕‍🦺🐩🐕🐈🐈‍⬛🐅🐆🐎🦌🦬🦏🦛🦙🦣🐘🦡🦨'.split('')),
                color: `hsl(${randomInt(1, 359)}, 70%, 60%)`
            }
            // console.log(playerTemplate)
            if (playerIndex == -1) {
                const result = addPlayerToGameST(playerTemplate, this.roomCode)
                // console.log(`Result: ${result}`)
            } else {
                this.playersInRoom[playerIndex] = new Player(playerTemplate, this.roomCode)
            }

            const player = this.getPlayer(playerName)
            player.role = getRole(arr[i])
        }
    }
    setPlayersAndRoles(arr) {
        this.playersInRoom = []
        for (let i = 0; i < arr.length; i++) {
            addPlayerToGameST({ src: '/images/role-thumbnails/Alchemist.webp', name: 'Player' + i }, this.roomCode)
            this.playersInRoom[i].assignRoleLater(this, getRole(arr[i]), { ignoreAssignEvent: true })
        }
        for (const player of this.playersInRoom) {
            player.role?.afterAssignRole?.(this, player)
        }
    }
    _atHasInfoWith(i, text=null) {
        const player = this.getPlayerAt(i)
        const info = player?.info
        if (info == null) {
            return false
        }
        if (text == null) {
            return true
        }
        if (info.roles != null) {
            if (info.roles.includes == null) {
                return false
            }
            if (info.roles.includes('undefined')) {
                console.error(`Player at ${i} has undefined info role!`)
                return false
            }
            if (info.roles.includes('Object')) {
                console.error(`Player at ${i} has Object info role instead of role name!`)
                return false
            }
        }
        for (const key of Object.keys(info)) {
            const value = info[key]
            if (value.includes?.(text)) {   // Array or string
                return true
            }
        }
        return false
    }

}



export function createNewGame(player) {
    const game = new Game(player.name)
    games[game.roomCode] = game
    return game
}

export function makeTestTBGame(options) {
    const player = { name: 'Dave', src: 'none.png' }
    const game = new Game(player.name, options)
    games[game.roomCode] = game
    game.scriptName = 'Trouble Brewing Modified'
    game.scriptRoleNames = [
        'Librarian',
        'Investigator',
        'Chef',
        'Washerwoman',
        
        'Empath',
        'Dreamer',
        'Monk',
        'Undertaker',
        'Soldier',
        'Ravenkeeper',
        'Virgo',
        'Slayer',
        'Mayor',

        'Saint',
        'Drunk',
        'Moonchild',
        'Recluse',

        'Scarlet Woman',
        'Baron',
        'Intoxist',
        'Spy',

        'Imp'
    ]

    return game
}

export function addPlayerToGameST(player, roomCode) {
    const game = games[roomCode]

    if (game == null) {
        return 404
    }
    if (game.hasPlayer(player.name)) {
        return 409
    }

    const gamePlayer = new Player(player, roomCode)
    game.addPlayer(gamePlayer)
    return 200
}

export function getGame(roomCode) {
    const game = games[roomCode]
    return game
}

export function gameAndPlayerIExist(params) {
    const game = getGame(params.roomCode)
    const playerI = params.i
    if (game == null || playerI == null || playerI < 0 || playerI >= game.playersInRoom.length) {
        return false
    }
    return true
}

export function findGameST(params) {
    const { roomCode, name } = params
    
    if (roomCode == null) {
        return { statusCode: 400 }
    }

    const game = getGame(roomCode)
    if (game == null) {
        return { statusCode: 404 }
    }

    return { game, statusCode: 200 }
}

export function findGameAndPlayerST(params) {
    const { game, statusCode } = findGameST(params)
    if (statusCode != 200) {
        return { statusCode }
    }
    
    if (params.name == null) {
        return { statusCode: 400 }
    }
    const player = game.playersInRoom.find(p => p.name == params.name)
    if (player == null) {
        return { statusCode: 400 }
    }
    return { game, player, statusCode: 200 }
}