import { addPlayerToGameST, createNewGame, games } from "../../../lib/server/games"
import { getRequestUser, response } from "../../../lib/server/utils"


export async function POST({ request, url, params }) {

    const player = getRequestUser(request)

    const game = createNewGame(player)
    addPlayerToGameST(player, game.roomCode)

    console.log({request})

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