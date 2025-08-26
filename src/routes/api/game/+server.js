import { addPlayerToGameST, createNewGame, games } from "../../../lib/server/games"
import { getRequestUser, response } from "../../../lib/server/utils"


export async function POST({ request, url, params }) {
    const data = await request.json()
    const { emoji, color } = data.me
    const { pregameDuration, nightDuration } = data

    const player = { ...getRequestUser(request), emoji, color }
    console.log(player.emoji)

    const game = createNewGame(player)
    game.pregameDuration = pregameDuration
    game.nightDuration = nightDuration
    addPlayerToGameST({...player, privateKey: game.privateKey}, game.roomCode)
    console.log(game.playersInRoom[0].emoji)

    game.scriptRoleNames = data.scriptRoleNames
    game.scriptName = data.scriptName

    return response({
        roomCode: game.roomCode,
        privateKey: game.privateKey
    }, 200)
}

export async function GET({ request, url, params }) {
    const allGames = Object.keys(games)
        .map(roomCode => games[roomCode].toJsonObject())
    return response(allGames, 200)
}