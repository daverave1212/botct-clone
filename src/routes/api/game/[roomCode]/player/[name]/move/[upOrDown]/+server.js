import { findGameAndPlayerST } from "../../../../../../../../lib/server/games"
import { response } from "../../../../../../../../lib/server/utils"


export async function POST({ request, params }) {

    const { game, player, statusCode } = findGameAndPlayerST(params)

    if (statusCode != 200) {
        return response(null, statusCode)
    }

    game.movePlayerUpOrDown(player, params.upOrDown)

    return response(null, 200)
}