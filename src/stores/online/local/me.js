import { localStorageWritable } from "../../../lib/svelteUtils";


export const me = localStorageWritable('me', {
    name: 'Default',
    src: 'none',
    emoji: '❓',
    color: 'hsl(0, 100%, 100%)',
    isDead: false,
    privateKey: null    // For checking if I am the admin of a certain game
})

