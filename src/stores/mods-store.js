import { get } from "svelte/store";
import { getMods } from "../lib/ModsDatabase";
import { localStorageWritable } from "../lib/svelteUtils";
import { randomizeArray } from "../lib/utils";

export const WITH_MODS = 'Mods!'
export const NO_MODS = 'No Mods'

export const mods = [
    {
        name: NO_MODS,
        imageName: 'No Mod',
        description: 'Standard game play, no fancy rules.'
    },{
        name: WITH_MODS,
        imageName: 'Conspiracy',
        description: 'Each game will have an extra mod!'
    }
]

export const selectedModOption = localStorageWritable('selectedModOption', 'No Mod')
console.log(`O--- Creating store 'currentlySelectedMod'`)
export const currentlySelectedMod = localStorageWritable('currentlySelectedMod', {})

export function getUnusedMods() {
    return getMods().filter(mod => mod.name != get(currentlySelectedMod).name)
}

export function autochooseMod() {
    console.log(`Choosing mod!`)
    const mod = randomizeArray(getMods())[0]
    console.log(`Chose this mod:`)
    console.log({mod})
    currentlySelectedMod.set(mod)
}

currentlySelectedMod.subscribe(newMod => {
    console.log(`SET NEW MOD TO:`)
    console.log({newMod})
})