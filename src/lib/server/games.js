import { ActionTypes, ActionDurations, GamePhases, StatusEffectDuration, SourceOfDeathTypes } from "$lib/shared-lib/GamePhases"
import { roomCode } from "../../stores/online/local/room"
import { getNightlyRolePriority, getRole, getSetupRolePriority } from "./ServerDatabase"
import { createRandomCode, randomizeArray } from "./utils"


const IS_DEBUG = true


function generateRandomRoomCode() {
    let randomRoomCode
    do {
        randomRoomCode = createRandomCode(3)
    } while (randomRoomCode in games)
    return randomRoomCode
}


const SOURCE_OF_DEATH_TEMPLATE = {
    type: SourceOfDeathTypes.DEMON_KILL,
    player: null
}

const INFO_TEMPLATE = {
    roles: ['Professor', 'Investigator'],
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
    constructor({ name, src }) {
        this.name = name
        this.src = src
        this.privateKey = null

        this.role = null
        this.isDrunk = false
        
        this.isDead = false
        this.changedAlignment = null
        
        this.info = null
        this.availableAction = null

        this.statusEffects = []
    }
}


export const games = {}
class Game {

    ownerName
    
    roomCode
    privateKey

    playersInRoom

    phase
    countdownRemaining

    countdownStart
    countdownDuration

    constructor(ownerName) {
        this.ownerName = ownerName
        this.roomCode = generateRandomRoomCode()
        this.privateKey = createRandomCode(6)

        this.playersInRoom = []
        this.phase = GamePhases.NOT_STARTED
    }

    goToNightThenDayAsync() {
        this.startNight()
        this.doAfterCountdown(20000, () => {
            this.startDay()
        })
    }
    startNight() {
        console.log(`🌙 Starting night`)
        this.phase = GamePhases.NIGHT
        const sortedPlayers = this.getPlayersSortedForNight()
        for (const player of sortedPlayers) {
            player.role?.onNightStart?.(this, player)
        }
    }
    startDay() {
        this.phase = GamePhases.DAY
        for (const player of this.playersInRoom) {
            player.role?.onDayStart?.(this, player)
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
            this.setPlayersAndRoles(['Spy', 'Investigator', 'Mutant', 'Fool'])
            this.playersInRoom[0].role = getRole('Monk')
            this.playersInRoom[1].role = getRole('Imp')
        }
    }

    doRolesSetup() {
        const sortedPlayers = this.getPlayersSortedForSetup()
        for (const player of sortedPlayers) {
            player.role?.onSetup?.(this, player)
        }
    }


    getPlayers() { return this.playersInRoom }
    getPlayersExcept(nameOrNames) { 
        const names = Array.isArray(nameOrNames)? nameOrNames: [nameOrNames]
        return this.playersInRoom.filter(p => !names.includes(p.name))
    }
    getPlayerAt(i) {
        return this.playersInRoom[i]
    }

    getPlayer(name) {
        return this.playersInRoom.find(p => p.name == name)
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
            (p.role.isEvil || p.changedAlignment == 'evil') &&
            !p.role.isDemon
        ))
    }
    getTownsfolk() {
        return randomizeArray(this.playersInRoom.filter(p => !p.role.isEvil))
    }
    getOutsiders() {
        return randomizeArray(this.playersInRoom.filter(p => p.role.isOutsider || p.isDrunk))
    }
    getDemon() {
        return this.playersInRoom.find(p => p.isDemon)
    }
    getNextPlayer(player) {
        const i = this.playersInRoom.findIndex(p => p.name == player.name)
        let nextI = i + 1
        if (nextI >= this.playersInRoom.length) {
            nextI = 0
        }
        return nextI
    }
    getPreviousPlayer(player) {
        const i = this.playersInRoom.findIndex(p => p.name == player.name)
        let prevI = i + 1
        if (prevI < 0) {
            prevI = this.playersInRoom.length - 1
        }
        return prevI
    }

    tryKillPlayer(playerOrName, source) {
        const player = typeof playerOrName === 'string'? this.getPlayer(playerOrName): this.getPlayer(playerOrName.name)

        const playerStatusEffects = [...player.statusEffects]

        for (const statusEffect of playerStatusEffects) {
            if (statusEffect.onDeath != null) {
                const result = statusEffect.onDeath(source)
                if (result == false) {
                    return
                }
            }
        }

        if (player.role.onDeath != null) {
            const result = player.role.onDeath(source)
            if (result == false) {
                return
            }
        }

        player.isDead = true
    }

    doPlayerActionST(p, actionData) {
        const player = this.getPlayer(p?.name || p)
        if (player == null) {
            return 404
        }
        const actionFunc = player?.role?.doPlayerAction
        if (actionFunc == null) {
            return 400
        }
        console.log(`Doing player action...`)
        actionFunc(this, player, actionData)
    }


    // Technical Utils
    toJsonObject() {
        return {
            ownerName: this.ownerName,
            roomCode: this.roomCode,
            privateKey: this.privateKey,
            playersInRoom: this.playersInRoom,

            countdownRemaining: this.countdownRemaining,
            countdownStart: this.countdownStart,
            countdownDuration: this.countdownDuration,
            phase: this.phase,
        }
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