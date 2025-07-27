import { getGame } from "../../../../lib/server/games";
import { response } from "../../../../lib/server/utils";

export async function GET({ request, params }) {
    const game = getGame(params.roomCode)

    if (game == null) {
        return response(null, 404)
    }

    return response(game.toJsonObject(), 200)
}