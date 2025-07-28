import { getGame } from "./games"


export function response(data, status) {
    return new Response(JSON.stringify(data), { status })
}

export function getRequestUser(request) {
    const headers = request.headers

    const name = headers.get('name')
    const src = headers.get('src')
    const privateKey = headers.get('privateKey')

    return { name, src, privateKey }
}

export function isAuthorizedForGame(request, roomCode) {
    const user = getRequestUser(request)
    const game = getGame(roomCode)
    console.log(`Is user ${user.name} ${user.privateKey} authorized for game ${roomCode} ${game.privateKey}`)
    if (user == null || game == null) {
        return false
    }
    if (user.privateKey == game.privateKey && user.name == game.ownerName) {
        return true
    }
    return false
}

export function assertGameRequestST(request, roomCode, playerI='unset') {
    if (roomCode == null) {
        return 422
    }
    const game = getGame(roomCode)
    if (game == null) {
        return 404
    }

    if (request.method != 'GET') {
        if (!isAuthorizedForGame(request, roomCode)) {
            return 401
        }
    }

    // TODO: from here, it's weird. don't do it like this
    
    if (playerI == 'unset') {
        return 200
    }

    // TODO: 
    const player = game.playersInRoom[playerI]
    if (player == null) {
        return 404
    }


}
