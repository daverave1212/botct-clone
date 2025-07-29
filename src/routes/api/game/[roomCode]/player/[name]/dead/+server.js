import { findGameAndPlayerST } from "../../../../../../../lib/server/games"
import { isAuthorizedForGame, response } from "../../../../../../../lib/server/utils"

export async function POST({ request, params }) {

    if (!isAuthorizedForGame(request, params.roomCode)) {
        return response(null, 401)
    }

    const { game, player, statusCode } = findGameAndPlayerST(params)

    if (statusCode != 200) {
        return response(null, statusCode)
    }

    player.isDead = player.isDead == null? false: !player.isDead

    return response(null, 200)
}