import { getGame } from "../../../../../lib/server/games";
import { getRequestUser } from "../../../../../lib/server/utils";


export async function POST({ request, params }) {
    const user = getRequestUser(request)
    const game = getGame(params.roomCode)
    
    if (game == null) {
        
    }
}