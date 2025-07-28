import { gameAndPlayerIExist, getGame } from "../../../../../../../lib/server/games"
import { isAuthorizedForGame, response } from "../../../../../../../lib/server/utils"

export async function POST({ request, params }) {

    if (!isAuthorizedForGame(request, params.roomCode)) {
        return response(null, 401)
    }

    const game = getGame(params.roomCode)
    const playerI = params.i

    if (game == null || playerI == null) {
        return response(null, 404)
    }

    console.log(`This game:`)
    console.log(game)
    console.log(game.playersInRoom)

    if (playerI < 0 || playerI >= game.playersInRoom.length) {
        return response(null, 404)
    }

    const player = game.playersInRoom[playerI]
    player.isDead = player.isDead == null? false: !player.isDead

    return response(null, 200)
}