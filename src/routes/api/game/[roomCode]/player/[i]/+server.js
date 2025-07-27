import { getGame } from "../../../../../../lib/server/games"
import { getRequestUser, isAuthorizedForGame, response } from "../../../../../../lib/server/utils"


export async function DELETE({ request, params }) {

    if (!isAuthorizedForGame(request, params.roomCode)) {
        return response(null, 401)
    }

    const game = getGame(params.roomCode)
    const playerI = params.i

    if (game == null || playerI == null || playerI < 0 || playerI >= game.playersInRoom.length) {
        return response(null, 404)
    }

    game.playersInRoom = game.playersInRoom.filter((_, i) => i != params.i)

    return response(null, 200)
}