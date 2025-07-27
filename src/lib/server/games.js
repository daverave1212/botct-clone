

const games = {}

function createRandomCode(length=3) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateRandomRoomCode() {
    let randomRoomCode
    do {
        randomRoomCode = createRandomCode(3)
    } while (randomRoomCode in games)
    return randomRoomCode
}

class Game {

    ownerName
    
    roomCode
    privateKey

    playersInRoom

    constructor(ownerName) {
        this.ownerName = ownerName
        this.roomCode = generateRandomRoomCode()
        this.privateKey = createRandomCode(6)

        this.playersInRoom = []
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
            playersInRoom: this.playersInRoom
        }
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

    game.addPlayer(player)
    return 200
}

export function getGame(roomCode) {
    const game = games[roomCode]
    return game
}