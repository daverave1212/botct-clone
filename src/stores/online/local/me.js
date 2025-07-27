import { localStorageWritable } from "../../../lib/svelteUtils";


export const me = localStorageWritable('me', {
    name: 'Default',
    src: 'none',
    isDead: false,
    privateKey: null    // For checking if I am the admin of a certain game
})