import { localStorageWritable } from "../../../lib/svelteUtils";

export const roomCode = localStorageWritable('roomCode', 'default')

export const playersInRoom = localStorageWritable('playersInRoom', [])

