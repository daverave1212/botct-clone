import { ActionTypes, ActionDurations, GamePhases, StatusEffectDuration, SourceOfDeathTypes } from "$lib/shared-lib/GamePhases"
import { roomCode } from "../../stores/online/local/room"
import { getNightlyRolePriority, getRole, getRoleNumbersByPlayers, getSetupRolePriority } from "./ServerDatabase"
import { createRandomCode, popArrayElementFind, randomizeArray, swapElementsAt } from "./utils"


const IS_DEBUG = true


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
    roles: ['Professor', 'Investigator'],
    showsRoleDescriptions: false,
    text: ''
}
const AVAILABLE_ACTION_TEMPLATE = {
    type: ActionTypes.CHOOSE_PLAYER,
    clientDuration: ActionDurations.UNTIL_USED_OR_DAY   // Only used in client to prevent multiple requests
}
const STATUS_EFFECT_TEMPLATE = {
    name: 'Protected',
    duration: StatusEffectDuration.UNTIL_NIGHT,
    onDeath: (source) => true,    // Returns true if should continue death
}

const PLAYER_DEFAULT = {
    name: 'Default',
    src: 'user.png',
    privateKey: null,

    isDead: false,
    role: null,
    info: null,             // if info != null, on client side, it shows exactly the info as rendered HTML
    availableAction: null,  // if availableAction != null, on client side, it shows the action based on the object. See template above.

    changedAlignment: null, // 'evil' 'good'
    isDrunk: false,
    statusEffects: []
}
class Player {
    constructor({ name, src, privateKey }) {
        this.name = name
        this.src = src
        this.privateKey = privateKey

        this.role = null
        this.isDrunk = false
        
        this.isDead = false
        this.changedAlignment = null
        
        this.info = null
        this.availableAction = null

        this.statusEffects = []
    }

    isEvil() {
        return this.role?.isEvil || this.changedAlignment == 'evil'
    }

    removeStatus(statusEffectName) {
        this.statusEffects = this.statusEffects.filter(s => s.name != statusEffectName)
    }

    addStatus(obj) {
        this.statusEffects.push(obj)
    }
}


export const games = {}
class Game {

    ownerName
    
    roomCode
    scriptRoleNames
    privateKey

    playersInRoom

    phase
    countdownRemaining

    countdownStart
    countdownDuration

    killHistory

    winner

    constructor(ownerName) {
        this.ownerName = ownerName
        this.roomCode = generateRandomRoomCode()
        this.scriptRoleNames = []
        this.privateKey = createRandomCode(6)

        this.playersInRoom = []
        this.phase = GamePhases.NOT_STARTED

        this.killHistory = []
    }

    goToNightThenDayAsync() {
        this.startNight()
        this.doAfterCountdown(5000, () => {
            this.startDay()
        })
    }
    startNight() {
        // console.log(`🌙 Starting night`)
        this.#applyAllEventsAt('onDayEnd')
        this.phase = GamePhases.NIGHT
        this.#applyAllEventsAt('onNightStart')
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
        for (const player of this.playersInRoom) {

            if (player.role.actionDuration == eventName) {
                player.availableAction = null
            }
            if (player.role.infoDuration == eventName) {
                player.info = null
            }

            let skipsRoleEvent = false
            for (const statusEffect of player.statusEffects) {
                const eventFuncToCall = statusEffect[eventName]
                if (eventFuncToCall == null) {
                    continue
                }
                skipsRoleEvent = eventFuncToCall(this, player) == false
                if (skipsRoleEvent) {
                    break
                }
            }
            if (!skipsRoleEvent) {
                player.role?.[eventName]?.(this, player)
            }
        }
    }



    start() {
        this.phase = GamePhases.COUNTDOWN
        this.assignRoles()

        this.doAfterCountdown(4000, () => {
            this.doRolesSetup()
            this.goToNightThenDayAsync()
        })
    }

    assignRoles() {
        if (IS_DEBUG) {
            this.setTestPlayersWithRoles(['Spy', 'Investigator', 'Mutant', 'Fool'])
        }

        const rolesToAssign = randomizeArray(this.getRolesToAssign())
        console.log({rolesToAssign})
        for (let i = 0; i < rolesToAssign.length; i++) {
            this.playersInRoom[i].role = rolesToAssign[i]
        }

        this.#applyAllEventsAt('onAssignRole')

        



        // if (IS_DEBUG) {
        //     this.playersInRoom[0].role = getRole('Imp')
        //     this.playersInRoom[1].role = getRole('Dreamer')
        // }
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
    getPlayers() { return this.playersInRoom }
    getPlayersExcept(nameOrNames) { 
        const names = Array.isArray(nameOrNames)? nameOrNames: [nameOrNames]
        console.log(`CHecking names: ${names.join(', ')}`)
        return this.playersInRoom.filter(p => !names.includes(p.name))
    }
    getPlayerAt(i) {
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
    getPlayersSortedForSetup() {
        return this.playersInRoom.sort((a, b) => getSetupRolePriority(a.role) - getSetupRolePriority(b.role))
    }
    getPlayersSortedForNight() {
        return this.playersInRoom.sort((a, b) => getNightlyRolePriority(a.role) - getNightlyRolePriority(b.role))
    }
    getMinions() {
        return randomizeArray(this.playersInRoom.filter(p =>
            (p.isEvil()) &&
            !p.role.isDemon
        ))
    }
    getEvils() {
        return randomizeArray(this.playersInRoom.filter(p => p.isEvil()))
    }
    getAliveEvils() {
        return randomizeArray(this.playersInRoom.filter(p => p.isEvil() && !p.isDead))
    }
    getAliveMinions() { return this.getMinions().filter(p => !p.isDead)}
    getTownsfolk() {
        return randomizeArray(this.playersInRoom.filter(p => !p.isEvil()))
    }
    getNonOutsiderTownsfolk() {
        return this.getTownsfolk().filter(p => !p.role?.isOutsider && !p.isDrunk)
    }
    getAliveTownsfolk() { return this.getTownsfolk().filter(p => !p.isDead)}
    getOutsiders() {
        return randomizeArray(this.playersInRoom.filter(p => p.role.isOutsider || p.isDrunk))
    }
    getAliveOutsiders() { return this.getOutsiders().filter(p => !p.isDead)}
    getDemon() {
        return this.playersInRoom.find(p => p.isDemon)
    }
    getLastExecutedPlayer() {
        for (let i = this.killHistory.length - 1; i >= 0; i--) {
            const { playerName, source } = this.killHistory[i]
            if (source.type == SourceOfDeathTypes.EXECUTION) {
                return this.getPlayer(playerName)
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
    getRolesNotInGame() {
        const playerRoleNames = this.playersInRoom.map(p => p.role.name)
        const cleanedPlayerRoleNames = playerRoleNames.filter(rn => rn != null) // For safety

        const isRoleInGame = rn => cleanedPlayerRoleNames.includes(rn)

        return this.scriptRoleNames
            .filter(rn => !isRoleInGame(rn))
            .map(rn => getRole(rn))
    }
    getRolesInGame() {
        return this.playersInRoom.map(p => p.isDrunk? getRole('Drunk'): p.role)
    }
    checkWinConditions() {
        const demons = this.playersInRoom.filter(p => p.role?.isDemon)
        const areDemonsDead = demons.length == demons.filter(p => p.isDead).length
        const aliveEvils = this.getAliveEvils()
        const aliveTownsfolk = [...this.getAliveTownsfolk(), ...this.getAliveOutsiders()]


        if (aliveEvils.length == 0 && aliveTownsfolk.length == 0) {
            winner = 'Evil'
            return
        }
        if (aliveEvils.length > aliveTownsfolk.length) {
            winner = 'Evil'
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
            // console.error(`\nERROR: Player ${playerOrName} not found to kill!`)
        }
        if (player.role == null) {
            // console.error(`\nERROR: Player ${playerOrName} has no role!`)
        }

        const playerStatusEffects = [...player.statusEffects]

        // console.log(`Killing through status effects...`)
        for (const statusEffect of playerStatusEffects) {
            if (statusEffect.onDeath != null) {
                const shouldContinue = statusEffect.onDeath(source, player)
                if (shouldContinue == false) {  // true or null should both continue
                    return
                }
            }
        }

        // console.log(`Killing through role onDeath...`)
        if (player?.role?.onDeath != null) {
            const shouldContinue = player.role.onDeath(source, player)
            if (shouldContinue == false) {
                return
            }
        }

        // console.log(`${player.role?.name} Is dead!`)
        player.isDead = true
        this.killHistory.push({
            playerName: player.name,
            source
        })

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
        const actionFunc = player?.role?.onPlayerAction
        if (actionFunc == null) {
            return 400
        }
        if (p.availableAction == null) {    // Prevent multiple requests
            return 200
        }
        player.availableAction = null
        actionFunc(this, player, actionData)
    }


    // Technical Utils
    toJsonObject() {
        return {...this}
        // return {
        //     ownerName: this.ownerName,
            
        //     roomCode: this.roomCode,
        //     privateKey: this.privateKey,
        //     playersInRoom: this.playersInRoom,
            
        //     scriptRoleNames: this.scriptRoleNames,

        //     countdownRemaining: this.countdownRemaining,
        //     countdownStart: this.countdownStart,
        //     countdownDuration: this.countdownDuration,
        //     phase: this.phase,
        //     winner: this.winner
        // }
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
            const playerName = 'TestPlayer' + i
            // console.log(playerName)
            const playerIndex = this.playersInRoom.findIndex(p => p.name == playerName)
            // console.log(playerIndex)
            const playerTemplate = { src: '/images/role-thumbnails/Alchemist.webp', name: playerName }
            // console.log(playerTemplate)
            if (playerIndex == -1) {
                const result = addPlayerToGameST(playerTemplate, this.roomCode)
                // console.log(`Result: ${result}`)
            } else {
                this.playersInRoom[playerIndex] = new Player(playerTemplate)
            }

            console.log(`Getting player ${playerName} from players ${this.playersInRoom.map(p => p.name).join(', ')}`)
            const player = this.getPlayer(playerName)
            player.role = getRole(arr[i])
        }
    }
    setPlayersAndRoles(arr) {
        for (let i = 0; i < arr.length; i++) {
            addPlayerToGameST({ src: '/images/role-thumbnails/Alchemist.webp', name: 'Player' + i }, this.roomCode)
            this.playersInRoom[i].role = getRole(arr[i])
        }
        
    }

}



export function createNewGame(player) {
    const game = new Game(player.name)
    games[game.roomCode] = game
    return game
}

export function makeTestGame() {
    const player = { name: 'Dave', src: 'none.png' }
    const game = new Game(player.name)
    games[game.roomCode] = game

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

    const gamePlayer = new Player(player)
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