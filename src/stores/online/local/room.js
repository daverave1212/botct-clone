import { localStorageWritable } from "../../../lib/svelteUtils";

export const roomCode = localStorageWritable('roomCode', 'default')

export const playersInRoom = localStorageWritable('playersInRoom', [])

export const phase = localStorageWritable('phase', null)

export const countdownRemaining = localStorageWritable('countdownRemaining', null)

