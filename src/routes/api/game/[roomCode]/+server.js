import { getGame, getGames } from "../../../../lib/server/games";
import { response } from "../../../../lib/server/utils";

export async function GET({ request, params }) {
    const game = getGame(params.roomCode)

    if (game == null) {
        return response({
            ok: false,
            message: `Failed to get game. Games state printed in this request's data.`,
            params,
            games: getGames()
        }, 404)
    }

    return response(game.toJsonObject(), 200)
}