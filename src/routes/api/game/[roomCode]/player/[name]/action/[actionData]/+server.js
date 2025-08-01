import { findGameAndPlayerST } from "../../../../../../../../lib/server/games";
import { getRequestUser, response } from "../../../../../../../../lib/server/utils";

export async function POST({ request, params }) {
    const { game, player, statusCode } = findGameAndPlayerST(params)
    if (statusCode != 200) {
        return response(null, statusCode)
    }
    const user = getRequestUser(request)
    const actionData = params.actionData

    const sc = game.onPlayerActionST(user, player, actionData)

    return response(null, sc)
}