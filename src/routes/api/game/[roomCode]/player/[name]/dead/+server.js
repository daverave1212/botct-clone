import { findGameAndPlayerST } from "../../../../../../../lib/server/games"
import { isAuthorizedForGame, response } from "../../../../../../../lib/server/utils"
import { SourceOfDeathTypes } from "$lib/shared-lib/GamePhases"

export async function POST({ request, params }) {

    console.log(`Getting a dead player: ${params.name}`)
    if (!isAuthorizedForGame(request, params.roomCode)) {
        return response(null, 401)
    }

    const { game, player, statusCode } = findGameAndPlayerST(params)

    if (statusCode != 200) {
        return response(null, statusCode)
    }

    game.tryKillPlayer(player, { type: SourceOfDeathTypes.EXECUTION })

    return response(null, 200)
}