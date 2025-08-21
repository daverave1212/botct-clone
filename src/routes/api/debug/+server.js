import { getIsDebug, setIsDebug } from "../../../lib/server/games"
import { response } from "../../../lib/server/utils"


export async function PUT({ request, params }) {
    
    setIsDebug(!getIsDebug())

    return response({}, 200)
}