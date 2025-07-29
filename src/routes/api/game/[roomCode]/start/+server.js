import { findGameST } from "../../../../../lib/server/games"
import { response } from "../../../../../lib/server/utils"

export async function POST({ request, url, params }) {

    const { game, statusCode } = findGameST(params)

    if (statusCode != 200) {
        return response(null, statusCode)
    }

    game.start()
    
    return response(null, 200)
}