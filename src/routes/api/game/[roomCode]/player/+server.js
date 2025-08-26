import { addPlayerToGameST, getGame, getGames } from "../../../../../lib/server/games";
import { getRequestUser, response } from "../../../../../lib/server/utils";


export async function POST({ request, params }) {
    const data = await request.json()
    const player = {...getRequestUser(request), ...data.me}
    const game = getGame(params.roomCode)
    
    if (game == null) {
        return response({
            ok: false,
            message: `Failed to get game. Games state printed in this request's data.`,
            params,
            games: getGames()
        }, 404)
    }

    const statusCode = addPlayerToGameST(player, game.roomCode)
    if (statusCode == 409) {
        return response(game.getPlayer(player.name), 200)
    }

    return response(player, 200)
}