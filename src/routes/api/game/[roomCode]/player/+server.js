import { addPlayerToGameST, getGame } from "../../../../../lib/server/games";
import { getRequestUser, response } from "../../../../../lib/server/utils";


export async function POST({ request, params }) {
    const player = getRequestUser(request)
    const game = getGame(params.roomCode)
    
    if (game == null) {
        return response(null, 404)
    }

    const statusCode = addPlayerToGameST(player, game.roomCode)
    if (statusCode == 409) {
        return response(game.getPlayer(player.name), 200)
    }

    return response(player, 200)
}