import { findGameAndPlayerST } from "../../../../../../../lib/server/games";
import { getRequestUser, response } from "../../../../../../../lib/server/utils";


export async function POST({ request, params }) {
    const { game, player, statusCode } = findGameAndPlayerST(params)
    if (statusCode != 200) {
        return response(null, statusCode)
    }
    const user = getRequestUser(request)
    const userPlayer = game.getPlayer(user.name)

    const sc = game.doPlayerActionST(userPlayer, player)

    return response(null, sc)
}