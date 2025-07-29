import { GamePhases } from "$lib/shared-lib/GamePhases"
import { getNightlyRolePriority, getRole, getSetupRolePriority } from "./ServerDatabase"
import { createRandomCode, randomizeArray } from "./utils"




function generateRandomRoomCode() {
    let randomRoomCode
    do {
        randomRoomCode = createRandomCode(3)
    } while (randomRoomCode in games)
    return randomRoomCode
}



const INFO_TEMPLATE = {
    roles: ['Professor', 'Investigator'],
    text: ''
}

const PLAYER_DEFAULT = {
    name: 'Default',
    src: 'user.png',
    privateKey: null,

    isDead: false,
    role: null,
    info: null,             // if info != null, on client side, it shows exactly the info as rendered HTML

    changedAlignment: null  // 'evil' 'good'
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

    nextDay() {
        this.phase = GamePhases.NIGHT
        this.countdownRemaining = 8 * 1000

        this.countdownStart = Date.now()
        this.countdownDuration = 8 * 1000

        let startCountdownIntervalId
        startCountdownIntervalId = setInterval(() => {
            if (this.countdownRemaining <= 0) {
                clearInterval(startCountdownIntervalId)
                this.countdownRemaining = null
                
                this.countdownStart = null
                this.countdownDuration = null
                this.phase = GamePhases.DAY
                return
            }
            this.countdownRemaining -= 1000
        }, 1000)
    }

    start() {
        this.phase = GamePhases.COUNTDOWN
        this.countdownRemaining = 8 * 1000

        this.countdownStart = Date.now()
        this.countdownDuration = 8 * 1000

        this.assignRoles()

        let startCountdownIntervalId
        startCountdownIntervalId = setInterval(() => {
            if (this.countdownRemaining <= 0) {
                this.doRolesSetup()

                clearInterval(startCountdownIntervalId)
                this.countdownRemaining = null

                this.countdownStart = null
                this.countdownDuration = null

                this.nextDay()
                return
            }
            this.countdownRemaining -= 1000
        }, 1000)
    }

    assignRoles() {
        this.playersInRoom[0].role = getRole('Dreamer')
        this.playersInRoom[1].role = getRole('Investigator')
        this.playersInRoom[2].role = getRole('Spy')
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

}



export function createNewGame(player) {
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

    game.addPlayer({
        ...PLAYER_DEFAULT,
        ...player,
    })
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