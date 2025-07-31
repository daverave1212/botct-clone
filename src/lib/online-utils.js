import { get } from "svelte/store";
import { me } from "../stores/online/local/me";
import { playersInRoom } from "../stores/online/local/room";
import { goto } from '$app/navigation';
import { browser } from '$app/environment'

// On each request, always send the user data as a header
export async function fetchGame(method, url, data) {
    if (!browser) {
        throw `Not in browser`
    }
    const fullUrl = window.location.origin + url
    const response = await fetch(fullUrl, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "name": get(me).name,
            "src": get(me).src,
            "privateKey": get(me).privateKey,
        },
        body: data == null? null: JSON.stringify(data)
    })
    
    const responseObject = await response.json()

    if (response.status != 200) {
        goto(`/error?statusCode=${response.status}&message=Unabble to ${method} resource ${url}`)
        return { status: response.status }
    }

    return {...responseObject, status: response.status}
}

export async function getPlayersInRoom(roomCode) {
    if (roomCode == null)
        throw `Null roomCode given to refreshRoom`
    const response = await fetchGame('GET', `/api/game/${roomCode}`)
    return response.playersInRoom
}