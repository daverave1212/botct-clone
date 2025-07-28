import { addPlayerToGameST, getGame } from "../../../../../lib/server/games";
import { getRequestUser, response } from "../../../../../lib/server/utils";


export async function POST({ request, params }) {
    const player = getRequestUser(request)
    const game = getGame(params.roomCode)
    
    if (game == null) {
        return response(null, 404)
    }

    addPlayerToGameST(player, game.roomCode)

    return response(null, 200)
}