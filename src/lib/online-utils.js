import { get } from "svelte/store";
import { me } from "../stores/online/local/me";
import { playersInRoom } from "../stores/online/local/room";

// On each request, always send the user data as a header
export async function fetchGame(method, url) {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "name": get(me).name,
            "src": get(me).src,
            "privateKey": get(me).privateKey,
        }
    })
    return {...(await response.json()), status: response.status}
}

export async function getGame(roomCode) {
    if (roomCode == null) throw `Null roomCode given to refreshRoom`
    const response = await fetchGame('GET', `/api/game/${roomCode}`)
    return response
}

export async function getPlayersInRoom(roomCode) {
    if (roomCode == null)
        throw `Null roomCode given to refreshRoom`
    const response = await fetchGame('GET', `/api/game/${roomCode}`)
    console.log({response})
    return response.playersInRoom
}