import { getGame } from "../../../../../../lib/server/games"
import { getRequestUser, isAuthorizedForGame, response } from "../../../../../../lib/server/utils"


export async function DELETE({ request, params }) {

    if (!isAuthorizedForGame(request, params.roomCode)) {
        return response(null, 401)
    }

    const game = getGame(params.roomCode)
    const playerName = params.name

    if (game == null || playerName == null) {
        return response(null, 404)
    }
    
    const player = game.getPlayer(playerName)
    if (player == null) {
        return response(null, 404)
    }

    game.playersInRoom = game.playersInRoom.filter(p => p.name != playerName)

    return response(null, 200)
}