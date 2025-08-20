import { percentChance, randomOf, randomFrom, randomizeArray, test } from "$lib/shared-lib/shared-utils"
import { StatusEffectDuration,SourceOfDeathTypes, ActionTypes, ActionDurations } from "$lib/shared-lib/GamePhases"
import { GamePhases } from "$lib/shared-lib/GamePhases"
import { randomInt } from "$lib/shared-lib/shared-utils"
import { InfoTypes } from "$lib/shared-lib/GamePhases"
import { maybeTest } from "./shared-utils"

export const EVILS = 'evils'
export const TOWNSFOLK = 'townsfolk'
export const OTHER = 'other'

export const CUSTOM_TEST = 0
export const TROUBLE_BREWING = 0.5
export const BAD_MOON_RISING = 1
export const SECTS_AND_VIOLETS = 1.5
export const INTERMEDIATE = 2
export const EXPERIMENTAL = 2.25
export const ADVANCED = 9
export const META_ROLES = 10

export const COMPLETE = -124172

export const difficultyNames = {
    [CUSTOM_TEST]: 'Trouble Screwing',
    [TROUBLE_BREWING]: 'Trouble Brewing',
    [BAD_MOON_RISING]: 'Bad Moon Rising',
    [SECTS_AND_VIOLETS]: 'Sects and Violets',
    [EXPERIMENTAL]: 'Experimental',
    [META_ROLES]: 'Other',
    
    [INTERMEDIATE]: '--Intermediate',
    [ADVANCED]: 'Zzz...',
    [COMPLETE]: '--Complete',
}

export function getFirstLetterOfDifficulty(difficulty) {
    return difficultyNames[difficulty].substring(0, 1)
}
export function getDifficultyByFirstLetter(firstLetter) {
    firstLetter = firstLetter.toUpperCase()
    for (const difficulty of Object.keys(difficultyNames)) {
        if (difficultyNames[difficulty].startsWith(firstLetter)) {
            return difficulty
        }
    }
    return BAD_MOON_RISING
}
export const difficultyDescriptions = {
    [TROUBLE_BREWING]: 'These are all the Evils in the game. Not all may be used in the game you are playing. For example, Vampires are only used for 7 or 8 players.',
    [BAD_MOON_RISING]: 'Use these roles for the base game. The app will help you keep the game running with tips!',
    [SECTS_AND_VIOLETS]: 'Add these simple roles to the game for extra spice!',
    [EXPERIMENTAL]: 'Balanced, easy to understand roles to make the game more intriguing! Who will be who?',
    [INTERMEDIATE]: 'Extra roles to add to make it more interesting. Every game, there should NOT be both a Town Guard and a Priest (unless there are more than 15 players). You don\'t have to play with all of them. Only choose which roles you like to play with.',
    [ADVANCED]: 'Roles for advanced players who know the game and want more challenge. Beware: having these roles in the game will make it more difficult to narrate!',
    [COMPLETE]: 'Complete',
    [META_ROLES]: 'These roles are not for playing, but are just special markers.'
}


export const REGULAR = 'regular'
export const REGULAR_NEGATIVE = 'regular-negative'
export const SETUP = 'setup'
export const NIGHTLY = 'nightly'
export const SPECIAL_SETUP = 'special-setup'
export const EVIL_SETUP = 'evil-setup'
export const SPECIAL_NIGHTLY = 'special-nightly'
export const OTHER_CATEGORY = 'other-category'

export const NIGHTLY_EVILS = 'nightly-evils'

export const EVIL_COLOR = 'rgb(194, 5, 30)'
export const SETUP_COLOR = 'rgb(90, 138, 0)'
export const NIGHTLY_COLOR = 'rgb(88, 50, 255)'
export const MORNING_COLOR = 'rgb(200, 175, 50)'
export const PINK_COLOR = '#CC55AA'
export const SPECIAL_COLOR = '#444444'

export const STRIGOY = 'Strigoy'
export const EVIL = 'Any Evil'
export const NEGATIVE = 'Any Evil'
// Rule of thumb: 25% of players are Strigoy
export const evilsByPlayers = {
    0:  [[STRIGOY]],
    1:  [[STRIGOY]],
    2:  [[STRIGOY]],
    3:  [[STRIGOY]],
    4:  [[STRIGOY]],
    5:  [[STRIGOY]],
    6:  [[STRIGOY, NEGATIVE]],
    7:  [[STRIGOY, NEGATIVE]],

    8:  [[STRIGOY, STRIGOY]],
    9:  [[STRIGOY, STRIGOY]],
    10: [[STRIGOY, STRIGOY, NEGATIVE]],
    11: [[STRIGOY, STRIGOY, NEGATIVE]],

    12: [[STRIGOY, STRIGOY, STRIGOY]],
    13: [[STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    14: [[STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    15: [[STRIGOY, STRIGOY, STRIGOY, NEGATIVE, NEGATIVE]],

    16: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY]],
    17: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    18: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    19: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, NEGATIVE, NEGATIVE]],

    20: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, STRIGOY]],
}

export const getRoles = () => {
    const roles = [
        {
            "name": "Acrobat",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, choose a player: if they are or become drunk or poisoned tonight, you die."
        },
        {
            "name": "Alchemist",
            "difficulty": EXPERIMENTAL,
            "effect": "You have a Minion ability. When using this, the Storyteller may prompt you to choose differently."
        },
        {
            "name": "Alsaahir",
            "difficulty": EXPERIMENTAL,
            "effect": "Each day, if you publicly guess which players are Minion(s) and which are Demon(s), good wins."
        },
        {
            "name": "Amnesiac",
            "difficulty": EXPERIMENTAL,
            "effect": "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are."
        },
        {
            "name": "Artist",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Once per game, during the day, privately ask the Storyteller any yes/no question."
        },
        {
            "name": "Atheist",
            "difficulty": EXPERIMENTAL,
            "effect": "The Storyteller can break the game rules, and if executed, good wins, even if you are dead. [No evil characters]"
        },
        {
            "name": "Balloonist",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, you learn a player of a different character type than last night. [+0 or +1 Outsider]"
        },
        {
            "name": "Banshee",
            "difficulty": EXPERIMENTAL,
            "effect": "If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination.”"
        },
        {
            "name": "Bounty Hunter",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]"
        },
        {
            "name": "Cannibal",
            "difficulty": EXPERIMENTAL,
            "effect": "You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution."
        },
        {
            "name": "Chambermaid",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability."
        },
        {
            "name": "Chef",
            "difficulty": TROUBLE_BREWING,
            "effect": "You start knowing how many pairs of evil players there are.",
            infoDuration: 'onNightEnd',
            getPower: (game, me) => me.isDead? 0.25: 1,
            onSetup(game, me) {
                if (game.playersInRoom?.length < 1) {
                    return
                }
                const playersPlus1 = [...game.playersInRoom, game.playersInRoom[0]]
                let nPairsFound = 0
                for (let i = 1; i < playersPlus1.length; i++) {
                    const prevPlayer = playersPlus1[i-1]
                    const thisPlayer = playersPlus1[i]
                    if (prevPlayer.isRegisteredAsEvil() && thisPlayer.isRegisteredAsEvil()) {
                        nPairsFound += 1
                    }
                }

                me.info = {
                    type: InfoTypes.ROLES,
                    text: `<em>${nPairsFound}</em>`
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Investigator', 'Chef', 'Intoxist', 'Fool', 'Imp'])
                game.doRolesSetup()
                test(`0 pairs`, game._atHasInfoWith(1, '0'))

                game.setPlayersAndRoles(['Investigator', 'Chef', 'Fool', 'Intoxist', 'Imp'])
                game.doRolesSetup()
                test(`1 pair`, game._atHasInfoWith(1, '1'))

                game.setPlayersAndRoles(['Scarlet Woman', 'Chef', 'Fool', 'Fool', 'Imp'])
                game.doRolesSetup()
                test(`1 pair (overflow)`, game._atHasInfoWith(1, '1'))

                game.setPlayersAndRoles(['Scarlet Woman', 'Chef', 'Fool', 'Intoxist', 'Imp'])
                game.doRolesSetup()
                test(`2 pairs`, game._atHasInfoWith(1, '2'))

                game.setPlayersAndRoles(['Scarlet Woman', 'Chef', 'Fool', 'Recluse', 'Imp'])
                game.doRolesSetup()
                test(`Recluse 2 pairs`, game._atHasInfoWith(1, '2'))

                game.setPlayersAndRoles(['Spy', 'Chef', 'Fool', 'Recluse', 'Imp'])
                game.doRolesSetup()
                test(`Recluse + Spy 1 pair`, game._atHasInfoWith(1, '1'))
            }
        },
        {
            "name": "Choirboy",
            "difficulty": EXPERIMENTAL,
            "effect": "If the Demon kills the King, you learn which player is the Demon. [+the King]"
        },
        {
            "name": "Clockmaker",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "You start knowing how many steps from the Demon to its nearest Minion.",
            getPower: (game, me) => me.isDead? 0.25: 1,
            onSetup: function(game, player) {
                if (player.isDrunkOrPoisoned()) {
                    player.info = {
                        text: `<h1>${randomInt(1, Math.floor(game.playersInRoom.length / 2))}</h1>`
                    }
                    return
                }
                
                const demonIndex = game.playersInRoom.findIndex(p => p.inspectRole()?.isDemon)

                if (demonIndex == -1) {
                    player.info = { text: 'There is no demon in this game.' }
                    return
                }

                if (game.getMinions().length == 0) {
                    player.info = { text: 'There are no minions in this game.' }
                    return
                }

                let answer = 0
                for (let step = 1; step < game.playersInRoom.length; step++) {
                    const prevI = (demonIndex - step + game.playersInRoom.length) % game.playersInRoom.length
                    const nextI = (demonIndex + step + game.playersInRoom.length) % game.playersInRoom.length
                    const prevPlayer = game.playersInRoom[prevI]
                    const nextPlayer = game.playersInRoom[nextI]
                    if (prevPlayer.isEvil() && !prevPlayer.inspectRole()?.isDemon) {
                        answer = step
                        break
                    }
                    if (nextPlayer.isEvil() && !nextPlayer.inspectRole()?.isDemon) {
                        answer = step
                        break
                    }
                }
                player.info = {
                    text: `<h1>${answer}</h1>`
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Spy', 'Fool', 'Fool', 'Fool', 'Imp'])
                const player = game.getPlayerAt(1)
                
                this.onSetup(game, player)
                test(`Spy first, imp last`, player.info?.text == `<h1>1</h1>`)

                game.setPlayersAndRoles(['Spy', 'Fool', 'Fool', 'Fool', 'Imp', 'Spy'])
                this.onSetup(game, player)
                test(`Spy first, imp > spy`, player.info?.text == `<h1>1</h1>`)

                game.setPlayersAndRoles(['Fool', 'Imp', 'Fool', 'Spy', 'Fool', 'Fool'])
                this.onSetup(game, player)
                test(`Spy first, imp between`, player.info?.text == `<h1>2</h1>`)

                game.setPlayersAndRoles(['Fool', 'Imp', 'Fool', 'Fool', 'Spy', 'Fool'])
                this.onSetup(game, player)
                test(`Spy first, imp low`, player.info?.text == `<h1>3</h1>`)

                game.setPlayersAndRoles(['Fool', 'Imp', 'Fool', 'Fool', 'Fool', 'Spy', 'Fool'])
                this.onSetup(game, player)
                test(`Spy first, imp equal`, player.info?.text == `<h1>3</h1>`)

                game.setPlayersAndRoles(['Fool', 'Spy', 'Fool', 'Fool', 'Fool', 'Spy', 'Fool'])
                this.onSetup(game, player)
                test(`No imp`, player.info?.text == `There is no demon in this game.`)

                game.setPlayersAndRoles(['Fool', 'Imp', 'Fool', 'Fool', 'Fool', 'Fool', 'Fool'])
                this.onSetup(game, player)
                test(`No minions`, player.info?.text == `There are no minions in this game.`)
                
                game.setPlayersAndRoles(['Imp', 'Spy'])
                this.onSetup(game, player)
                test(`2 players`, player.info?.text == `<h1>1</h1>`)
            }
        },
        {
            "name": "Courtier",
            "difficulty": BAD_MOON_RISING,
            "effect": "Once per game, at night, choose a character: they are drunk for 3 nights & 3 days."
        },
        {
            "name": "Cult Leader",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, you become the alignment of an alive neighbor. If all good players choose to join your cult, your team wins."
        },
        {
            "name": "Dreamer",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night, choose a player (not yourself or Travellers): you learn 1 good & 1 evil character, 1 of which is correct.",
            getPower: (game, me) => game.roundNumber * 0.4 + me.isDead? 0.2: 0,
            onNightStart(game, me) {
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER,
                    clientDuration: ActionDurations.UNTIL_USED_OR_DAY
                }
            },
            actionDuration: 'onNightEnd',
            infoDuration: 'onNightEnd',
            onPlayerAction(game, me, actionData) {
                const chosenPlayer = game.getPlayer(actionData?.name || actionData)
                let chosenPlayerRole = chosenPlayer.inspectRole()
                
                const allScriptRoles = game.getScriptRoleObjects().filter(r => !r.mayRegisterDifferently)
                let randomOppositeRole =
                    chosenPlayerRole.isEvil?
                        randomOf(...(allScriptRoles.filter(r => r.isEvil != true)))?.name
                    :randomOf(...(allScriptRoles.filter(r => r.isEvil)))?.name
                
                if (randomOppositeRole == null) {
                    me.info = {
                        text: "You dreamed nothing."
                    }
                    return
                }
                

                if (me.isDrunkOrPoisoned()) {
                    const scriptEvils = allScriptRoles.filter(r => r.isEvil && !r.mayRegisterDifferently)
                    const scriptNonEvils = allScriptRoles.filter(r => !r.isEvil && r.name != me.getTrueRole().name && !r.mayRegisterDifferently)
                    chosenPlayerRole = randomOf(...scriptEvils)
                    randomOppositeRole = randomOf(...scriptNonEvils).name
                }

                const the2roles = randomizeArray([chosenPlayerRole.name, randomOppositeRole])
                me.info = {
                    roles: the2roles,
                    text: ``
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Dreamer', 'Fool', 'Scarlet Woman', 'Recluse', 'Spy', 'Imp'])
                game.doRolesSetup()
                const me = game.at(0)

                me.role.onPlayerAction(game, me, game.at(1))
                test(`Normal (Fool)`, game._atHasInfoWith(0, 'Fool'))

                me.role.onPlayerAction(game, me, game.at(2))
                test(`Normal (SW)`, game._atHasInfoWith(0, 'Scarlet Woman'))

                me.role.onPlayerAction(game, me, game.at(3))
                test(`Recluse`, !game._atHasInfoWith(0, 'Recluse'))

                me.role.onPlayerAction(game, me, game.at(4))
                test(`Spy`, !game._atHasInfoWith(0, 'Spy'), `
                    Info roles: ${me.info.roles}
                `)
            }
        },
        {
            "name": "Empath",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night, you learn how many of your 2 alive neighbors are evil.",
            getPower: (game, me) => game.roundNumber * 0.25 + me.isDead? 0.45: 0,
            infoDuration: 'onNightEnd',
            onNightStart(game, me) {
                if (me.isDrunkOrPoisoned()) {
                    me.info = {
                        text: `<h1>${randomInt(0, 2)}</h1>`
                    }
                    return
                }

                const neighbors = [game.getPreviousAlivePlayer(me), game.getNextAlivePlayer(me)]
                if (neighbors[0] == null || neighbors[1] == null) {
                    return
                }
                const evilNeighbors = neighbors.filter(p => p.isRegisteredAsEvil())
                me.info = {
                    text: `${evilNeighbors.length}`
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                const player = game.getPlayerAt(1)
                
                game.reset().setPlayersAndRoles(['Scarlet Woman', 'Empath', 'Fool', 'Fool', 'Imp'])
                game.startNight()
                test(`Near Scarlet Woman and fool`, game.getPlayerAt(1).info.text == `1`)

                game.reset().setPlayersAndRoles(['Soldier', 'Empath', 'Fool', 'Fool', 'Imp'])
                game.startNight()
                test(`Near soldier and fool`, game.getPlayerAt(1).info.text == `0`)

                game.reset().setPlayersAndRoles(['Empath', 'Fool', 'Fool', 'Fool', 'Imp'])
                game.startNight()
                test(`Is first player`, game.getPlayerAt(0).info.text == `1`)

                game.reset().setPlayersAndRoles(['Empath', 'Poisoner', 'Fool', 'Fool', 'Imp'])
                game.startNight()
                test(`Is first player and 2 evils`, game.getPlayerAt(0).info.text == `2`)

                game.reset().setPlayersAndRoles(['Scarlet Woman', 'Poisoner', 'Fool', 'Fool', 'Empath'])
                game.startNight()
                test(`Is last player and 1 evil`, game.getPlayerAt(4).info.text == `1`)

                game.reset().setPlayersAndRoles(['Scarlet Woman', 'Poisoner', 'Fool', 'Imp', 'Empath'])
                game.startNight()
                test(`Is last player and 2 evils`, game.getPlayerAt(4).info.text == `2`)

                game.reset().setPlayersAndRoles(['Soldier', 'Poisoner', 'Imp', 'Fool', 'Empath'])
                game.startNight()
                test(`Is last player and 0 evils`, game.getPlayerAt(4).info.text == `0`)

                game.reset().setPlayersAndRoles(['Recluse', 'Poisoner', 'Imp', 'Fool', 'Empath'])
                game.startNight()
                test(`Recluse`, game.getPlayerAt(4).info.text == `1`)

                game.reset().setPlayersAndRoles(['Spy', 'Poisoner', 'Imp', 'Fool', 'Empath'])
                game.startNight()
                test(`Spy`, game.getPlayerAt(4).info.text == `0`)
            }
        },
        {
            "name": "Engineer",
            "difficulty": EXPERIMENTAL,
            "effect": "Once per game, at night, choose which Minions or which Demon is in play."
        },
        {
            "name": "Exorcist",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesnt wake tonight."
        },
        {
            "name": "Farmer",
            "difficulty": EXPERIMENTAL,
            "effect": "When you die at night, an alive good player becomes a Farmer."
        },
        {
            "name": "Fisherman",
            "difficulty": EXPERIMENTAL,
            "effect": "Once per game, during the day, visit the Storyteller for some advice to help your team win."
        },
        {
            "name": "Flowergirl",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, you learn if a Demon voted today."
        },
        {
            "name": "Fool",
            "difficulty": BAD_MOON_RISING,
            "effect": "The 1st time you die, you dont.",
            getPower: (game, me) => me.isDead? 0: 1.25,
            onDeath(game, me, source) {
                if (me.didUsePower || me.isDrunkOrPoisoned()) {
                    return true
                } else {
                    me.didUsePower = false
                    return false
                }
            }
        },
        {
            "name": "Fortune Teller",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.",
            actionDuration: 'onNightEnd',
            infoDuration: 'onNightEnd',
            onSetup(game, me) {
                me.actionState = 'choosing-first'
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER,
                    buttonText: 'Choose 1st Player'
                }
                const redHerring = randomOf(...game.getAliveTownsfolk())    // Yes that can be me
                redHerring.addStatus({
                    name: 'Red Herring'
                })
            },
            onNightStart(game, me) {
                if (game.roundNumber == 1) {
                    return
                }
                me.actionState = 'choosing-first'
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER,
                    buttonText: 'Choose 1st Player'
                }
            },
            onPlayerAction(game, me, actionData) {
                let chosenPlayer = game.getPlayer(actionData)

                if (me.actionState == 'choosing-first') {
                    me.firstChosenPlayerName = chosenPlayer.name
                    me.actionState = 'choosing-second'
                    me.availableAction = {
                        type: ActionTypes.CHOOSE_PLAYER,
                        buttonText: 'Choose 2nd Player'
                    }
                    return
                }

                if (me.actionState == 'choosing-second') {
                    me.secondChosenPlayerName = chosenPlayer.name
                    me.actionState = null
                    if (me.firstChosenPlayerName == me.secondChosenPlayerName) {
                        me.info = {
                            type: InfoTypes.ROLES,
                            text: `You can't choose the same person twice.`
                        }
                        return
                    }

                    const first = game.getPlayer(me.firstChosenPlayerName)
                    const second = game.getPlayer(me.secondChosenPlayerName)
                    const firstIsDemon = first?.role?.isDemon
                    const secondIsDemon = second?.role?.isDemon
                    const isEitherRedHerring = first.hasStatus('Red Herring') || second.hasStatus('Red Herring')
                    let yesOrNo = 'NO'
                    if (firstIsDemon || secondIsDemon || isEitherRedHerring) {
                        yesOrNo = 'YES'
                        if (me.isDrunkOrPoisoned() && percentChance(75)) {
                            yesOrNo = 'NO'
                        }
                    }

                    me.info = {
                        type: InfoTypes.ROLES,
                        text: `For <em>${me.firstChosenPlayerName}</em> and <em>${me.secondChosenPlayerName}</em>: ${yesOrNo}`
                    }
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Imp', 'Fortune Teller', 'Moonchild', 'Moonchild', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()

                test(`Red herring exists`, game.filter(p => p.hasStatus('Red Herring')).length == 1)
                
                test(`Has power on setup`, game.at(1).availableAction != null && game.at(1).actionState == 'choosing-first', `
                    Has action: ${game.at(1).availableAction != null}
                    Action state: ${game.at(1).actionState}
                `)
                game.startNight()
                test(`Has power first night`, game.at(1).availableAction != null && game.at(1).actionState == 'choosing-first')
                game.at(1).useAction(game, game.at(0))
                test(`First player chosen correctly`,
                    game.at(1).availableAction != null
                    && game.at(1).firstChosenPlayerName != null
                    && game.at(1).actionState == 'choosing-second'
                )
                game.at(1).useAction(game, game.at(2))
                test(`Second player chosen correctly`,
                    game.at(1).availableAction == null
                    && game.at(1).secondChosenPlayerName != null
                    && game.at(1).actionState == null
                    && game.at(1).info != null
                )
                test(`Gets a yes`, game._atHasInfoWith(1, 'YES'))
                game.startDay()


                game.startNight()
                test(`Has power second night`, game.at(1).availableAction != null && game.at(1).actionState == 'choosing-first')
                game.at(1).useAction(game, game.at(2))
                game.at(1).useAction(game, game.at(3))
                test(`Get a no or red herring`, 
                    game._atHasInfoWith(1, 'NO')
                    ||
                    (game._atHasInfoWith(1, 'YES') && (game.at(2).hasStatus('Red Herring') || game.at(3).hasStatus('Red Herring')))
                , `
                    Info text: ${game.at(1).info?.text}
                `)
            }
        },
        {
            "name": "Gambler",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night*, choose a player & guess their character: if you guess wrong, you die."
        },
        {
            "name": "General",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, you learn which alignment the Storyteller believes is winning: good, evil, or neither.",
            infoDuration: 'onNightEnd',
            getPower: (game, me) => me.isDead? 0: 1,
            onNightStart(game, me) {
                let tfPower = game.getTownsfolk()
                    .map(p => p.getPower(game, p))
                    .reduce((soFar, n) => soFar + n, 0)
                let evPower = game.getEvils()
                    .map(p => p.getPower(game, p))
                    .reduce((soFar, n) => soFar + n, 0)
                
                if (me.isDrunkOrPoisoned()) {
                    tfPower = randomInt(0, 3)
                    evPower = randomInt(0, 3)
                }
                
                me.info = {
                    type: InfoTypes.ROLES,
                    text: `<em>${
                        Math.abs(tfPower - evPower) < 2?
                            'Neither'
                        :tfPower > evPower?
                            'Townsfolk'
                        :'Evils'
                    }</em>`
                }
            }
        },
        {
            "name": "Gossip",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each day, you may make a public statement. Tonight, if it was true, a player dies."
        },
        {
            "name": "Grandmother",
            "difficulty": BAD_MOON_RISING,
            getPower: (game, me) => {
                const isGrandsonDead = game.playersInRoom.find(p => p.hasStatus('Grandson'))
                if (isGrandsonDead && me.isDead) {
                    return 0
                }
                if (me.isDead && !isGrandsonDead) {
                    return 0.5
                }
                return 1
            },
            "effect": "You start knowing a good player & their character. If the Demon kills them, you die too.",
            infoDuration: 'onNightEnd',
            onNightStart: function(game, player) {
                if (player.didUsePower) {
                    return
                }
                player.didUsePower = true
                let townsfolks = game.getTownsfolk().filter(p => p.name != player.name)

                if (player.isDrunkOrPoisoned()) {
                    townsfolks = game.getPlayersExcept([player.name])
                }

                let chosenPlayer = randomOf(...townsfolks)
                let roleName = chosenPlayer?.inspectRole()?.name

                if (player.isDrunkOrPoisoned()) {
                    if (chosenPlayer.isOutsider()) {
                        roleName = game.getRandomEvilRoleNameInScript()
                    } else if (chosenPlayer.isTownsfolk()) {
                        roleName = game.getRandomTownsfolkRoleAsPoisoned()
                    } else {
                        roleName = game.getRandomGoodRoleAsPoisoned()
                    }
                }

                if (roleName == null || chosenPlayer == null) {
                    player.info = {
                        text: 'You do not have a grandson.'
                    }
                    return
                }

                player.info = {
                    roles: [roleName],
                    text: `<em>${chosenPlayer.name}</em> is your grandson and it's this role.`
                }

                if (player.isDrunkOrPoisoned()) {
                    return
                }

                chosenPlayer.statusEffects.push({
                    name: 'Grandson',
                    duration: StatusEffectDuration.PERMANENT,
                    onDeath(game, me, source) {
                        if (player.isDrunkOrPoisoned()) {
                            return true
                        }
                        if (source?.type == SourceOfDeathTypes.DEMON_KILL) {
                            game.tryKillPlayer(player, { type: SourceOfDeathTypes.OTHER })
                        }
                        return true
                    }
                })
            },
            test(testingInjectable) {
                const getGrandson = () => game.playersInRoom.find(p => p.statusEffects.some(se => se.name == 'Grandson'))
                let game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Grandmother', 'Washerwoman', 'Undertaker', 'Investigator', 'Imp', 'Monk', 'Ravenkeeper'])
                game.doRolesSetup()
                game.startNight()
                test(`Normal - Grandma has info`, game._atHasInfoWith(0, 'is your grandson'))
                game.tryKillPlayer(getGrandson().name, { type: SourceOfDeathTypes.DEMON_KILL })
                game.startDay()
                test(`Normal - Grandma is dead`, game.getPlayerAt(0).isDead)

                game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Grandmother', 'Washerwoman', 'Undertaker', 'Imp'])
                game.doRolesSetup()
                game.at(0).poison('Poisoned', 'never')
                game.startNight()
                test(`Poisoned - Grandma has info`, game._atHasInfoWith(0, 'is your grandson'))
                test(`Poisoned - Grandson not exist`, getGrandson() == null)
            }
        },
        {
            "name": "High Priestess",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, learn which player the Storyteller believes you should talk to most."
        },
        {
            "name": "Huntsman",
            "difficulty": EXPERIMENTAL,
            "effect": "Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]"
        },
        {
            "name": "Innkeeper",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night*, choose 2 players: they cant die tonight, but 1 is drunk until dusk."
        },
        {
            "name": "Investigator",
            "difficulty": TROUBLE_BREWING,
            "effect": "You start knowing that 1 of 2 players is a particular Minion.",
            getPower: (game, me) => me.isDead? 0.25: 1,
            onSetup: function(game, player) {
                const minions = game.getPlayersThatRegisterAsEvil().filter(p => !p.role?.isDemon)
                let randomMinion = randomOf(...minions)
                let minionRoleName = randomMinion?.inspectRole()?.name
                
                if (player.isDrunkOrPoisoned()) {
                    randomMinion = randomOf(...game.getPlayersExcept([player.name]))
                }
                if (player.isDrunkOrPoisoned()) {
                    minionRoleName = randomOf(...game.getScriptEvilRoleNames())
                }

                if (randomMinion == null) {
                    player.info = { text: 'There are no minions in this game.' }
                    return
                }

                const randomTownsfolk = randomOf(...game.getPlayersExcept([player.name, randomMinion.name]))
                if (randomTownsfolk == null) {
                    player.info = null
                    return
                }
                
                const playersDisplayed = randomizeArray([randomMinion, randomTownsfolk])

                player.info = {
                    roles: [minionRoleName],
                    text: `Either <em>${playersDisplayed[0]?.name}</em> or <em>${playersDisplayed[1]?.name}</em> is this role.`
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Investigator', 'Scarlet Woman', 'Fool', 'Fool', 'Imp'])
                game.doRolesSetup()
                test(`Normal game (either)`, game._atHasInfoWith(0, 'Either'))
                test(`Normal game (SW)`, game._atHasInfoWith(0, 'Scarlet Woman'), `Info roles: ${game.getPlayerAt(0).info.roles?.join(', ')}`)

                // Assassin not in script
                game.setPlayersAndRoles(['Investigator', 'Assassin', 'Fool', 'Fool', 'Imp'])
                game.getPlayerAt(0).poison()
                game.doRolesSetup()
                test(`Poisoned (either)`, game._atHasInfoWith(0, 'Either'))
                maybeTest(`Poisoned (SW)`, !game._atHasInfoWith(0, 'Scarlet Woman'))

                game.setPlayersAndRoles(['Investigator', 'Recluse', 'Fool', 'Fool', 'Imp'])
                game.doRolesSetup()
                let rolesDisplayed = game.getPlayerAt(0).info?.roles
                test(`Recluse (either)`, game._atHasInfoWith(0, 'Either'), `
                    ${game.getPlayerAt(0).info?.text} - Registered as evil: ${game.getPlayersThatRegisterAsEvil().map(p => p.getTrueRole()?.name).join(', ')}.
                    Recluse inspect: ${game.getPlayerAt(1).inspectRole().name}
                    True role: ${game.getPlayerAt(1).getTrueRole().name}
                    Role role: ${game.getPlayerAt(1).role?.name}
                `)
                test(`Recluse (role)`,
                    rolesDisplayed != null
                    && (
                        game.getScriptEvilRoleNames().includes(rolesDisplayed[0]) ||
                        game.getScriptEvilRoleNames().includes(rolesDisplayed[1])
                    )
                )
            }
        },
        {
            "name": "Juggler",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "On your 1st day, publicly guess up to 5 players characters. That night, you learn how many you got correct."
        },
        {
            "name": "King",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, if the dead equal or outnumber the living, you learn 1 alive character. The Demon knows you are the King."
        },
        {
            "name": "Knight",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing 2 players that are not the Demon."
        },
        {
            "name": "Librarian",
            "difficulty": TROUBLE_BREWING,
            "effect": "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)",
            getPower: (game, me) => me.isDead? 0.25: 1,
            onSetup: function(game, player) {
                const outsiders = game.getOutsiders()
                if (outsiders.length == 0) {
                    player.info = { text: 'Zero Outsiders are in play.' }
                    return
                }

                let randomOutsider = randomFrom(outsiders, { prefer: p => !p?.isRegisteredAsEvil()})
                let outsiderRoleName = randomOutsider.getTrueRole()?.name
                
                if (player.isDrunkOrPoisoned()) {
                    randomOutsider = randomOf(...game.getPlayersExcept([player.name]))
                    outsiderRoleName = randomOf(...game.getScriptRoleObjects().filter(r => r.isOutsider))
                    if (game.isRoleInScript('Drunk') && percentChance(50)) {
                        outsiderRoleName = 'Drunk'
                    }
                }

                if (randomOutsider == null) {
                    player.info = { text: 'Zero Outsiders are in play.' }
                    return
                }

                const randomTownsfolk = randomOf(...game.getPlayersExcept([player.name, randomOutsider.name]))
                if (randomTownsfolk == null) {
                    player.info = { text: `No other players are in game.` }
                    return
                }
                
                const playersDisplayed = randomizeArray([randomOutsider, randomTownsfolk])

                player.info = {
                    roles: [outsiderRoleName],
                    text: `Either <em>${playersDisplayed[0]?.name}</em> or <em>${playersDisplayed[1]?.name}</em> is this role.`
                }
            },
            test(testingInjectable) {
                let game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Librarian', 'Fool', 'Fool', 'Fool', 'Fool', 'Fool'])
                game.doRolesSetup()
                test(`No outsiders`, game._atHasInfoWith(0, 'Zero Outsiders'))

                game.setPlayersAndRoles(['Librarian', 'Fool', 'Fool', 'Fool', 'Saint', 'Fool'])
                game.doRolesSetup()
                test(`Saint`, game._atHasInfoWith(0, 'Either'))
                test(`Saint`, game._atHasInfoWith(0, 'Saint'))

                game.setPlayersAndRoles(['Librarian', 'Fool', 'Fool', 'Fool', 'Drunk', 'Fool'])
                game.doRolesSetup()
                test(`Drunk`, game._atHasInfoWith(0, 'Either'))
                test(`Drunk`, game._atHasInfoWith(0, 'Drunk'))
            }
        },
        {
            "name": "Lycanthrope",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, choose an alive player. If good, they die & the Demon doesn’t kill tonight. One good player registers as evil."
        },
        {
            "name": "Magician",
            "difficulty": EXPERIMENTAL,
            "effect": "The Demon thinks you are a Minion. Minions think you are a Demon."
        },
        {
            "name": "Mathematician",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night, you learn how many players abilities worked abnormally (since dawn) due to another characters ability."
        },
        {
            "name": "Mayor",
            "difficulty": TROUBLE_BREWING,
            "effect": "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.",
            onDayEnd(game, me) {
                if (me.isDrunkOrPoisoned()) {
                    return
                }

                const are3PlayersLeft = game.getAlivePlayers().length == 3
                const lastExecution = game.getLastExecution()
                if (!are3PlayersLeft) {
                    return
                }
                if (lastExecution == null) {
                    game.winner = 'Townsfolk'
                    return
                }
                const { playerName, roundNumber, source } = lastExecution
                if (roundNumber != game.roundNumber && are3PlayersLeft) {
                    game.winner = 'Townsfolk'
                    return
                }
            },
            onDeath(game, me, source) {
                if (me.isDrunkOrPoisoned()) {
                    return true
                }
                if (source.type == SourceOfDeathTypes.EXECUTION || source.type == SourceOfDeathTypes.MAYOR_REDIRECT) {
                    return true
                }
                const powerDynamics = game.getTotalPowerDynamics()
                if (powerDynamics == null) {
                    return
                }

                let possiblePlayers = game.getAliveTownsfolk()
                if (powerDynamics <= -3 && percentChance(50) && game.getAliveMinions().length >= 1) {
                    possiblePlayers = game.getAliveMinions()
                }


                const randomTF = randomOf(...possiblePlayers)    // This can be me
                if (randomTF?.name == me.name) {
                    return true
                } else {
                    game.tryKillPlayer(randomTF, { type: SourceOfDeathTypes.MAYOR_REDIRECT })
                    return false
                }
            },
            test(testingInjectable) {
                let game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Imp', 'Mayor', 'Librarian', 'Slayer', 'Dreamer', 'Recluse', 'Spy'])
                game.doRolesSetup()
                
                test(`Power dynamics ok`, game.getTotalPowerDynamics() != null, `
                    Power dynamics: ${game.getTotalPowerDynamics()}
                `)
                test(`Power dynamics: ${game.getTotalPowerDynamics()}`, true)
                game.tryKillPlayer(game.at(1), { type: SourceOfDeathTypes.DEMON_KILL })
                maybeTest(`Mayor is alive`, !game.at(1).isDead)
                maybeTest(`Someone else is dead`, game.playersInRoom.filter(p => p.isDead).length == 1)
                test(`Power dynamics: ${game.getTotalPowerDynamics()}`, true)

                game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Mayor', 'Librarian', 'Slayer'])
                game.doRolesSetup()
                game.tryKillPlayer(game.at(3), { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                test(`4 players, then execution - game should not end: ${game.getTotalPowerDynamics()}`, game.winner == null, `
                    Winner: ${game.winner}
                `)

                game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Mayor', 'Librarian', 'Slayer'])
                game.doRolesSetup()
                game.startNight()
                game.tryKillPlayer(game.at(3), { type: SourceOfDeathTypes.DEMON_KILL })
                game.startDay()
                game.startNight()
                test(`4 players, then kill - game should end: ${game.getTotalPowerDynamics()}`, game.winner = 'Townsfolk')
            }
        },
        {
            "name": "Minstrel",
            "difficulty": BAD_MOON_RISING,
            "effect": "When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.",
            ribbonText: "REMINDER",
            ribbonColor: MORNING_COLOR
        },
        {
            "name": "Monk",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night*, choose a player (not yourself): they are safe from the Demon tonight.",
            getPower: (game, me) => me.isDead? 0: ((game.playersInRoom.length / game.getAlivePlayers().length) * 2),
            actionDuration: 'onNightEnd',
            onNightStart(game, player) {
                const me = game.getPlayer(player?.name || player)
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER,
                    clientDuration: ActionDurations.UNTIL_USED_OR_DAY
                }
            },
            onPlayerAction(game, me, actionData) {
                if (me?.availableAction == null) {  // Prevent multiple requests
                    return
                }
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                const chosenPlayer = game.getPlayer(actionData?.name || actionData)
                if (chosenPlayer == me) {
                    return
                }

                chosenPlayer.statusEffects.push({
                    name: 'Protected',
                    duration: StatusEffectDuration.UNTIL_NIGHT,
                    onDayStart: () => chosenPlayer.removeStatus('Protected'),
                    onDeath: (g, m, source) => {
                        if (source?.type == SourceOfDeathTypes.DEMON_KILL) {
                            return false
                        }
                        return true
                    }
                })
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Imp', 'Dreamer', 'Monk', 'Saint', 'Chef', 'Recluse', 'Spy'])
                game.doRolesSetup()
                const chef = game.at(4)
                const saint = game.at(3)
                const me = game.at(2)
                const dreamer = game.at(1)
                const imp = game.at(0)

                game.startNight()
                me.role.onPlayerAction(game, me, dreamer)
                imp.role.onPlayerAction(game, imp, dreamer)
                game.startDay()
                test(`Normal`, me.availableAction == null && !dreamer.isDead)

                game.startNight()
                imp.role.onPlayerAction(game, imp, dreamer)
                game.startDay()
                test(`Protection should expire`, me.availableAction == null && dreamer.isDead)

                game.startNight()
                me.poison()
                me.role.onPlayerAction(game, me, saint)
                imp.role.onPlayerAction(game, imp, saint)
                game.startDay()
                test(`Poisoned`, me.availableAction == null && saint.isDead)

                game.startNight()
                me.role.onPlayerAction(game, me, chef)
                imp.role.onPlayerAction(game, imp, chef)
                game.startDay()
                test(`Poison should expire`, me.availableAction == null && !chef.isDead)

                game.startNight()
                me.role.onPlayerAction(game, me, me)
                imp.role.onPlayerAction(game, imp, me)
                game.startDay()
                test(`Protection self should not work`, me.isDead)
            }
        },
        {
            "name": "Nightwatchman",
            "difficulty": EXPERIMENTAL,
            "effect": "Once per game, at night, choose a player: they learn you are the Nightwatchman."
        },
        {
            "name": "Noble",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing 3 players, 1 and only 1 of which is evil.",
            infoDuration: 'onNightEnd',
            getPower: (game, me) => me.isDead? 0.25: 1,
            onSetup(game, me) {
                const evils = game.getPlayersThatRegisterAsEvil()
                const theEvilPlayer = randomOf(...evils)
                const goods = randomizeArray(game.getTownsfolk())
                const twoGoods = goods.slice(0, 2)
                const all3 = randomizeArray([...twoGoods, theEvilPlayer])
                me.info = {
                    type: InfoTypes.PLAYERS_WITH_ROLES,
                    playersWithRoles: all3.map(p => ({
                        name: p.name
                    }))
                }
            }
        },
        {
            "name": "Oracle",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, you learn how many dead players are evil."
        },
        {
            "name": "Pacifist",
            "difficulty": BAD_MOON_RISING,
            "effect": "Executed good players might not die."
        },
        {
            "name": "Philosopher",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk."
        },
        {
            "name": "Pixie",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die."
        },
        {
            "name": "Poppy Grower",
            "difficulty": EXPERIMENTAL,
            "effect": "Minions & Demons do not know each other. If you die, they learn who each other are that night."
        },
        {
            "name": "Preacher",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability."
        },
        {
            "name": "Professor",
            "difficulty": BAD_MOON_RISING,
            "effect": "Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected."
        },
        {
            "name": "Ravenkeeper",
            "difficulty": TROUBLE_BREWING,
            "effect": "If you die at night, you are woken to choose a player: you learn their character.",
            getPower: (game, me) => me.isDead? (me.didUsePower? 0.5: 0): 1,
            actionDuration: 'onDayEnd',
            infoDuration: 'onDayEnd',
            afterDeath(game, me, source) {
                if (source.type == SourceOfDeathTypes.EXECUTION) {
                    return
                }

                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER
                }

            },
            onPlayerAction(game, me, actionData) {
                const getRandomEvilNameInScript = () => randomFrom(game.getScriptRoleObjects().filter(r => r.isEvil)).name
                const chosenPlayer = game.getPlayer(actionData?.name || actionData)
                let roleName = chosenPlayer.inspectRole().name

                if (me.isDrunkOrPoisoned()) {
                    if (chosenPlayer.isOutsider()) {
                        roleName = game.getRandomEvilRoleNameInScript()
                    } else if (chosenPlayer.isTownsfolk()) {
                        if (percentChance(50) && game.isRoleInScript('Drunk')) {
                            roleName = 'Drunk'
                        } else {
                            roleName = getRandomEvilNameInScript()
                        }
                    } else {
                        roleName = game.getRandomGoodRoleAsPoisoned()
                    }
                }

                me.didUsePower = true

                me.info = {
                    type: InfoTypes.ROLES,
                    roles: [roleName]
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Ravenkeeper', 'Ravenkeeper', 'Imp', 'Ravenkeeper', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                const me1 = game.at(0)
                const me2 = game.at(1)
                const me3 = game.at(3)
                const me4 = game.at(4)
                const imp = game.at(2)

                game.startNight()
                imp.role.onPlayerAction(game, imp, me1)
                game.startDay()
                test(`Has Action (normal)`, me1.availableAction != null && me1.info == null)
                const statusCode = game.onPlayerActionST({}, me1, imp)
                test(`Normal`, game._atHasInfoWith(0, 'Imp') && me1.availableAction == null, `
                    My info: ${JSON.stringify(me1.info)}
                    Action: ${JSON.stringify(me1.availableAction)}
                    Is dead: ${me1.isDead}
                    Status code: ${statusCode}
                `)

                game.tryKillPlayer(me2, { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                game.startDay()
                test(`Execution`, me2.info == null && me2.availableAction == null)

                game.startNight()
                me3.poison()
                game.onPlayerActionST({}, imp, me3)
                game.startDay()
                test(`Has action (poisoned check evil)`, me3.availableAction != null)
                game.onPlayerActionST({}, me3, imp)
                test(`Poison (check evil)`, !game._atHasInfoWith(0, 'Imp') && me1.availableAction == null)

                game.startNight()
                me4.poison()
                imp.role.onPlayerAction(game, imp, me4)
                game.startDay()
                test(`Has action (poisoned check good)`, me4.availableAction != null)
                game.onPlayerActionST({}, me3, game.at(6))
                test(`Poison (check good)`, !game._atHasInfoWith(0, 'Chef') && me1.availableAction == null)
            }
        },
        {
            "name": "Sage",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "If the Demon kills you <i>(alternatively, if you die at night)</i>, you learn that it is 1 of 2 players.",
            deathReminder: "Show the Sage 2 players, one of which is the Demon."
        },
        {
            "name": "Sailor",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night, choose an alive player: either you or they are drunk until dusk. You cant die."
        },
        {
            "name": "Savant",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false."
        },
        {
            "name": "Seamstress",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment."
        },
        {
            "name": "Shugenja",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary."
        },
        {
            "name": "Slayer",
            "difficulty": TROUBLE_BREWING,
            "effect": "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
            getPower: (game, me) => me.isDead? (me.didUsePower? 0: -0.5): 1,
            onSetup(game, me) {
                me.availableAction = { type: ActionTypes.CHOOSE_PLAYER }
            },
            onPlayerAction(game, me, actionData) {
                if (me.didUsePower) {
                    return  // Defensive programming
                }
                me.didUsePower = true
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                
                const chosenPlayer = game.getPlayer(actionData)
                if (chosenPlayer.getTrueRole()?.isDemon) {
                    game.tryKillPlayer(chosenPlayer, { type: SourceOfDeathTypes.OTHER })
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Imp', 'Slayer', 'Spy', 'Slayer', 'Slayer', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                test(`Has power on setup`, game.at(1).availableAction != null)
                game.startNight()
                test(`Has power at night`, game.at(1).availableAction != null)
                game.startDay()
                test(`Has power at day`, game.at(1).availableAction != null)
                game.at(1).useAction(game, game.at(2))
                test(`Used power`, game.at(1).availableAction == null)
                test(`Power doesn't work on minions`, !game.at(2).isDead)
                game.at(1).useAction(game, game.at(0))
                test(`Power can't be used again`, !game.at(0).isDead)

                game.at(3).poison('Poisoned', 'never')
                game.at(3).useAction(game, game.at(0))
                test(`Poisoned - imp is alive`, !game.at(0).isDead)
                game.at(3).removeStatus('Poisoned')
                game.at(3).useAction(game, game.at(0))
                test(`Power can't be used again`, !game.at(0).isDead)

                game.at(4).useAction(game, game.at(0))
                test(`Power kills the demon`, game.at(0).isDead)
                test(`Game is finished`, game.winner = 'Townsfolk')
            }
        },
        {
            "name": "Snake Charmer",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night, choose an alive player: if they are the Demon, you become that Demon role and turn evil, and then the Demon becomes a Townsfolk with no ability."
        },
        {
            "name": "Soldier",
            "difficulty": TROUBLE_BREWING,
            "effect": "You are safe from the Demon.",
            getPower: (game, me) => me.isDead? 0: 1,
            onDeath(game, me, source) {
                if (me.isDrunkOrPoisoned()) {
                    return true
                }
                if (source.type == SourceOfDeathTypes.DEMON_KILL) {
                    return false
                }
                return true
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Soldier', 'Dreamer', 'Imp', 'Fool', 'Chef', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                const me = game.at(0)

                game.startNight()
                game.at(2).role.onPlayerAction(game, game.at(2), me)
                game.startDay()
                test(`Normal`, !me.isDead)

                game.startNight()
                me.poison()
                game.at(2).role.onPlayerAction(game, game.at(2), me)
                game.startDay()
                test(`Poisoned`, me.isDead)
            }
        },
        {
            "name": "Steward",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing 1 good player."
        },
        {
            "name": "Tea Lady",
            "difficulty": BAD_MOON_RISING,
            "effect": "If both your alive neighbors are good, they cant die."
        },
        {
            "name": "Town Crier",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, you learn if a Minion nominated today."
        },
        {
            "name": "Undertaker",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night*, you learn which character died by execution today.",
            getPower: (game, me) => game.roundNumber * 0.5 + me.isDead? -0.1: 0,
            infoDuration: 'onNightEnd',
            onNightStart(game, me) {
                const refilter = roles => roles.filter(r => {
                    if (r.effect != null) {
                        return !me.rolesChecked.includes(r.name)
                    } else {
                        return !me.rolesChecked.includes(r)
                    }
                })
                const maybeAdd = (arr, roleOrName) => {
                    if (me.rolesChecked.includes(roleOrName.name ?? roleOrName)) {
                        return
                    }
                    arr.push(roleOrName)
                }

                if (me.rolesChecked == null) {  // For better poison BS info
                    me.rolesChecked = []
                }

                let lastExecutedPlayer = game.getLastExecutedPlayer()
                if (lastExecutedPlayer == null) {
                    return
                }

                if (me.isDrunkOrPoisoned()) {
                    let availableRoles = game.getRolesNotInGame()
                        .filter(r => !r.mayRegisterDifferently)
                    if (game.scriptRoleNames.includes('Drunk')) {
                        maybeAdd(availableRoles, getRole('Drunk'))
                        maybeAdd(availableRoles, getRole('Drunk'))
                    }

                    let randomRoleName
                    const goodsNotInGame = availableRoles.filter(r => !r.isEvil)
                    let randomGoodName = randomOf(...goodsNotInGame) ?? randomOf(game.getScriptGoodRoleNames())
                    if (lastExecutedPlayer.isEvil()) {
                        randomRoleName = randomGoodName
                    } else {
                        let possibleRoles = game.getScriptEvilRoleNames()
                        if (availableRoles.some(r => r.name == 'Drunk')) {
                            maybeAdd(possibleRoles, 'Drunk')
                        }
                        possibleRoles = refilter(possibleRoles)

                        if (possibleRoles.length == 0) {
                            possibleRoles = game.getScriptRoleObjects()
                        }
                        
                        randomRoleName = randomOf(...possibleRoles)
                    }

                    // Failsafe
                    if (randomRoleName == null) {
                        return
                    }
                    
                    me.rolesChecked.push(randomRoleName)

                    me.info = {
                        roles: [randomRoleName]
                    }
                    return
                }

                
                const alreadySawThisPlayer = me.lastKnownKilledPlayerName == lastExecutedPlayer.name
                if (alreadySawThisPlayer) {
                    return
                }

                me.lastKnownKilledPlayerName = lastExecutedPlayer.name
                me.info = {
                    roles: [lastExecutedPlayer.inspectRole()?.name]
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Undertaker', 'Dreamer', 'Imp', 'Fool', 'Chef', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                const me = game.at(0)

                game.startDay()
                game.tryKillPlayer(game.at(1), { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                test(`Normal`, game._atHasInfoWith(0, 'Dreamer'), `
                    Last executed true role: ${game.getLastExecutedPlayer()?.role?.name}
                `)

                game.startDay()
                game.tryKillPlayer(game.at(5), { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                let foundRole = getRole(me.info?.roles[0])
                test(`Recluse`, foundRole != null && foundRole.isEvil && foundRole.name != 'Recluse')

                game.startDay()
                game.tryKillPlayer(game.at(6), { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                foundRole = getRole(me.info.roles[0])
                test(`Spy`, foundRole != null && !foundRole.isEvil && foundRole.name != 'Spy')

                game.startDay()
                game.tryKillPlayer(game.at(3), { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                test(`Fool`, me.info == null)

                game.startDay()
                me.poison()
                game.tryKillPlayer(game.at(7), { type: SourceOfDeathTypes.EXECUTION })
                game.startNight()
                foundRole = getRole(me.info.roles[0])
                test(`Poisoned`, foundRole != null && foundRole.name != 'Chef', `
                    Found role: ${foundRole?.name}
                    Roles not in game: ${game.getRolesNotInGame().map(r => r.name).join(', ')}
                    My info: ${JSON.stringify(me.info)}
                `)
                maybeTest('Poisoned (failable)', game.getRolesNotInGame().some(r => r.name == foundRole.name))
            }
        },
        {
            "name": "Village Idiot",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots. 1 of the extras is drunk]"
        },
        {
            "name": "Virgin",
            "difficulty": TROUBLE_BREWING,
            "effect": "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately."
        },
        {
            "name": "Virgo",
            "difficulty": CUSTOM_TEST,
            "effect": "The 1st time you are executed, choose who was the nominator on the app. If the nominator was a Townsfolk, they are executed immediately.",
            actionDuration: 'onDayEnd',
            getPower: (game, me) => me.isDead? 0: 1,
            onDeath(game, me, source) {
                if (source.type != SourceOfDeathTypes.EXECUTION) {
                    return true
                }
                if (me.isDrunkOrPoisoned()) {
                    return true
                }
                if (me.didUsePower) {
                    return true
                }
                me.didUsePower = true
                me.isDead = false
                game.sendNotification('info', 'Execution failed!')
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER
                }
                return false
            },
            onPlayerAction(game, me, actionData) {
                const chosenPlayer = game.getPlayer(actionData?.name || actionData)
                if (!chosenPlayer.isEvil() && chosenPlayer.isOutsider()) {
                    return
                }
                if (me.isDrunkOrPoisoned()) {
                    return
                }

                game.tryKillPlayer(chosenPlayer)

                chosenPlayer.addStatus({
                    name: 'Virgoed',
                    onNightEnd() {
                        game.tryKillPlayer(chosenPlayer, { type: SourceOfDeathTypes.OTHER })
                    }
                })
            }
        },
        {
            "name": "Washerwoman",
            "difficulty": TROUBLE_BREWING,
            "effect": "You start knowing that 1 of 2 players is a particular Townsfolk.",
            onSetup: function(game, player) {
                let randomTF = randomOf(...game
                    .getPlayersThatRegisterAsGood()
                    .filter(p => !p.inspectRole().isOutsider)
                    .filter(p => p.name != player.name)
                )
                
                if (player.isDrunkOrPoisoned()) {
                    randomTF = randomOf(...game.getEvils())
                }

                if (randomTF == null) {
                    player.info = { text: 'There are no townsfolk in play.' }
                    return
                }

                const randomPlayer = randomOf(...game.getPlayersExcept([player.name, randomTF.name]))
                if (randomPlayer == null) {
                    player.info = null
                    return
                }
                
                const playersDisplayed = randomizeArray([randomTF, randomPlayer])

                let tfRoleName = randomTF.inspectRole().name
                if (player.isDrunkOrPoisoned()) {
                    const tfRolesNotInGame = game.getRolesNotInGame().filter(r => !r.isEvil && !r.isOutsider)
                    if (tfRolesNotInGame.length == 0) {
                        tfRoleName = randomOf(...game.getScriptRoleObjects().filter(r => !r.isEvil && !r.isOutsider && r.name != 'Washerwoman')).name
                    } else {
                        tfRoleName = randomOf(...tfRolesNotInGame).name
                    }
                }

                player.info = {
                    roles: [tfRoleName],
                    text: `Either <em>${playersDisplayed[0]?.name}</em> or <em>${playersDisplayed[1]?.name}</em> is this role.`
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Washerwoman', 'Scarlet Woman', 'Fool', 'Fool', 'Imp'])
                game.doRolesSetup()
                test(`Normal game`, game._atHasInfoWith(0, 'Either') && game._atHasInfoWith(0, 'Fool'))

                game.setPlayersAndRoles(['Washerwoman', 'Scarlet Woman', 'Recluse', 'Fool', 'Imp'])
                game.doRolesSetup() // Try several times to make sure it always picks the fool
                test(`Ignore recluse (try 1)`, game._atHasInfoWith(0, 'Either') && game._atHasInfoWith(0, 'Fool'))
                game.doRolesSetup()
                test(`Ignore recluse (try 2)`, game._atHasInfoWith(0, 'Either') && game._atHasInfoWith(0, 'Fool'))
                game.doRolesSetup()
                test(`Ignore recluse (try 3)`, game._atHasInfoWith(0, 'Either') && game._atHasInfoWith(0, 'Fool'))
                game.doRolesSetup()
                test(`Ignore recluse (try 4)`, game._atHasInfoWith(0, 'Either') && game._atHasInfoWith(0, 'Fool'))

                game.setPlayersAndRoles(['Washerwoman', 'Scarlet Woman', 'Fool', 'Fool', 'Imp'])
                game.getPlayerAt(0).poison()
                game.doRolesSetup()
                test(`Poisoned (try 1)`, game._atHasInfoWith(0, 'Either') && !game._atHasInfoWith(0, 'Fool'), `
                    Is poisoned? ${game.getPlayerAt(0).isDrunkOrPoisoned()}
                `)
                game.getPlayerAt(0).poison()
                game.doRolesSetup()
                test(`Poisoned (try 2)`, game._atHasInfoWith(0, 'Either') && !game._atHasInfoWith(0, 'Fool'))
                game.getPlayerAt(0).poison()
                game.doRolesSetup()
                test(`Poisoned (try 3)`, game._atHasInfoWith(0, 'Either') && !game._atHasInfoWith(0, 'Fool'))

                game.setPlayersAndRoles(['Washerwoman', 'Spy', 'Intoxist', 'Scarlet Woman', 'Imp'])
                game.doRolesSetup()
                test(`Spy`, 
                    (game.at(1).inspectRole().isOutsider && game._atHasInfoWith(0, 'in play'))
                    ||
                    (!game.at(1).inspectRole().isOutsider && !game._atHasInfoWith(0, 'in play') && game._atHasInfoWith(0, 'Either'))
                )

            }
        },
        {
            "name": "Barber",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.",
            deathReminder: "The Demon may choose 2 players to swap characters.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Butler",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Damsel",
            "difficulty": EXPERIMENTAL,
            "effect": "All Minions know a Damsel is in play. If a Minion publicly guesses you (once), your team loses.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Drunk",
            "difficulty": TROUBLE_BREWING,
            "effect": "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true,
            getPower: (game, me) => me.isDead? 0.5: -0.5,
            onInspected(me) {
                return me.secretRole
            },
            afterAssignRole(game, me) {
                const rolesNotUsed = game.getRolesNotInGame()
                const goodRolesNotInGame = rolesNotUsed.filter(r => r.isEvil != true && r.isOutsider != true)
                const myNewRole = randomOf(...goodRolesNotInGame)
                me.assignRoleLater(game, myNewRole)
                me.secretRole = getRole('Drunk')
                me.addStatus({  // Permanent drunkness
                    name: 'Drunk',
                    isPoisoned: true
                })
            }
        },
        {
            "name": "Golem",
            "difficulty": EXPERIMENTAL,
            "effect": "You may only nominate once per game. When you do, if the nominee is not the Demon, they die.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Goon",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment <i>(alternatively, you <b>know</b> their alignment).</i>.",
            ribbonText: "OUTSIDER",
            isOutsider: true,
            ribbonColor: MORNING_COLOR
        },
        {
            "name": "Hatter",
            "difficulty": EXPERIMENTAL,
            "effect": "If you died today or tonight, the Minion & Demon players may choose new Minion & Demon characters to be.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Heretic",
            "difficulty": EXPERIMENTAL,
            "effect": "Whoever wins, loses & whoever loses, wins, even if you are dead.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Klutz",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Lunatic",
            "difficulty": BAD_MOON_RISING,
            "effect": "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Moonchild",
            "difficulty": BAD_MOON_RISING,
            getPower: (game, me) => 0,
            "effect": "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true,
            actionDuration: 'onDayStart',
            afterDeath(game, me, source) {
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER
                }
            },
            onPlayerAction(game, me, actionData) {
                const chosenPlayer = game.getPlayer(actionData)
                if (chosenPlayer.isDead) {
                    return
                }
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                if (!chosenPlayer.isEvil()) {
                    chosenPlayer.addStatus({
                        name: 'Moonchilded',
                        onNightEnd() {
                            game.tryKillPlayer(chosenPlayer, { type: SourceOfDeathTypes.OTHER })
                        }
                    })
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Imp', 'Moonchild', 'Moonchild', 'Moonchild', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                
                game.tryKillPlayer(game.at(1), { type: SourceOfDeathTypes.EXECUTION })
                test(`On evil has power`, game.at(1).availableAction != null)
                game.onPlayerActionST({}, game.at(1), game.at(0))
                test(`Evil should be alive`, !game.at(0).isDead)

                game.at(2).poison()
                game.tryKillPlayer(game.at(2), { type: SourceOfDeathTypes.EXECUTION })
                test(`Poisoned - has power`, game.at(2).availableAction != null)
                game.onPlayerActionST({}, game.at(1), game.at(0))
                test(`Poisoned - should be alive`, !game.at(0).isDead)
                
            }
        },
        {
            "name": "Mutant",
            getPower: (game, me) => 0,
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "You must never claim or insinuate you're a Mutant or an Outsider. If you do, use your power to kill yourself.",
            "notes": "Be fair, don't cheat. If anyone asks, you can say you don't want to say your role or pretend you're a different one.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true,
            actionDuration: null,   // Never expire
            onSetup(game, me) {
                me.availableAction = {
                    type: ActionTypes.JUST_CLICK
                }
            },
            onPlayerAction(game, me, actionData) {
                game.tryKillPlayer(me, { type: SourceOfDeathTypes.OTHER })
            }
        },
        {
            "name": "Ogre",
            "difficulty": EXPERIMENTAL,
            "effect": "On your 1st night, choose a player (not yourself): you become their alignment (you dont know which) even if drunk or poisoned.”",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Plague Doctor",
            "difficulty": EXPERIMENTAL,
            "effect": "When you die, the Storyteller gains a Minion ability.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Politician",
            "difficulty": EXPERIMENTAL,
            "effect": "If you were the player most responsible for your team losing, you change alignment & win, even if dead.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Puzzlemaster",
            "difficulty": EXPERIMENTAL,
            "effect": "1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Recluse",
            "difficulty": TROUBLE_BREWING,
            "effect": "You might register as evil & as a Minion or Demon, even if dead.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true,
            mayRegisterDifferently: true,
            getPower: (game, me) => 0,
            onInspected(me) {
                if (me.isDrunkOrPoisoned()) {
                    return me.getTrueRole()
                }
                return me.role
            },
            afterAssignRole(game, me) {
                const rolesNotUsed = game.getRolesNotInGame()
                let evilRolesNotInGame = rolesNotUsed.filter(r => r.isEvil)
                if (evilRolesNotInGame.length == 0) {
                    evilRolesNotInGame = game.getScriptRoleObjects().filter(r => r.isEvil)
                }
                const myNewRole = randomOf(...evilRolesNotInGame)

                me.assignRoleLater(game, myNewRole, { ignoreAssignEvent: true })
                me.secretRole = getRole('Recluse')
                me.hasOnlySecretRolePowers = true
            }
        },
        {
            "name": "Saint",
            getPower: (game, me) => me.isDead? 0.25: -0.25,
            "difficulty": TROUBLE_BREWING,
            "effect": "If you die by execution, your team loses.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true,
            afterDeath(game, me, source) {
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                if (source.type == SourceOfDeathTypes.EXECUTION) {
                    game.winner = 'Evil'
                }
            },
            test(testingInjectable) {
                const game = testingInjectable.makeTestTBGame()
                
                game.setPlayersAndRoles(['Imp', 'Saint', 'Saint', 'Saint', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                
                game.tryKillPlayer(game.at(1), { type: SourceOfDeathTypes.EXECUTION })
                test(`Normal execution`, game.at(1).isDead && game.winner == 'Evil', `
                    Is dead: ${game.at(1).isDead}
                    winner: ${game.winner}
                `)

                game.winner = null
                game.at(2).poison()
                game.tryKillPlayer(game.at(2), { type: SourceOfDeathTypes.EXECUTION })
                test(`Poisoned`, game.at(2).isDead && game.winner == null, `
                    Is dead: ${game.at(2).isDead}
                    winner: ${game.winner}
                `)
            }
        },
        {
            "name": "Snitch",
            "difficulty": EXPERIMENTAL,
            "effect": "Each Minion gets 3 bluffs.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Sweetheart",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "When you die, 1 player is drunk from now on.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Tinker",
            "difficulty": BAD_MOON_RISING,
            "effect": "You might die at any time.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Zealot",
            "difficulty": EXPERIMENTAL,
            "effect": "If there are 5 or more players alive, you must vote for every nomination.",
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: "OUTSIDER",
            isOutsider: true
        },
        {
            "name": "Assassin",
            "difficulty": BAD_MOON_RISING,
            "effect": "Once per game, at night*, choose a player: they die, even if for some reason they could not.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
            actionDuration: 'onNightEnd',
            getPower: (game, me) => (me.didUsePower? 1: 0) + (me.isDead? 0: 1),
            onNightStart(game, me) {
                if (me.didUsePower) {
                    return
                }
                me.action = {
                    type: ActionTypes.CHOOSE_PLAYER
                }
            },
            onPlayerAction(game, me, actionData) {
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                const chosenPlayer = game.getPlayer(actionData?.name || actionData)
                if (chosenPlayer == null) {
                    return
                }
                me.chosenPlayerName = chosenPlayer.name
                me.didUsePower = true
            },
            onDayStart(game, me) {
                if (me.chosenPlayerName == null) {
                    return
                }
                me.chosenPlayerName.statusEffects = null
                me.chosenPlayerName.statusEffects.push({
                    name: 'Assassinated',
                    isPoisoned: true
                })
                game.tryKillPlayer(me.chosenPlayer, { type: SourceOfDeathTypes.OTHER })
            }
        },
        {
            "name": "Baron",
            "difficulty": TROUBLE_BREWING,
            "effect": "There are extra Outsiders in play. [+2 Outsiders]",
            getPower: (game, me) => me.isDead? 0: 0.5,
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
            afterAssignRole(game, me) {
                const outsidersNotUsed = randomizeArray(
                    game.getRolesNotInGame().filter(r => r.isOutsider)
                )
                if (outsidersNotUsed.length < 2) {
                    return
                }
                const goodPlayers = randomizeArray(game.getNonOutsiderTownsfolk())
                if (goodPlayers.length < 2) {
                    return
                }

                // Because order matters. We want afterAssignRole roles to be later
                const rolesWithNoAssignSetup = outsidersNotUsed.filter(r => r.afterAssignRole == null)
                const rolesWithAssignSetup = outsidersNotUsed.filter(r => r.afterAssignRole != null)

                const rolesToUse = [...rolesWithNoAssignSetup, ...rolesWithAssignSetup]

                goodPlayers[0].assignRoleLater(game, rolesToUse[0])
                goodPlayers[1].assignRoleLater(game, rolesToUse[1])
            },
            test(testingInjectable) {
                let game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Baron', 'Chef', 'Chef'])
                game.doRolesSetup()
                test(`Normal`, game.winner == null && game.at(2).getTrueRole().isOutsider && game.at(3).getTrueRole().isOutsider)

                game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Baron', 'Saint', 'Moonchild', 'Chef', 'Chef'])
                game.doRolesSetup()
                test(`Drunk is ok`, game.at(4).hasStatus('Drunk') || game.at(5).hasStatus('Drunk'))
                test(`Recluse is ok`, !game.at(4).inspectRole().isOutsider || !game.at(5).inspectRole().isOutsider)
            }
        },
        {
            "name": "boffin",
            "difficulty": EXPERIMENTAL,
            "effect": "The Demon (even if drunk or poisoned) has a not-in-play good characters ability. You both know which.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Boomdandy",
            "difficulty": EXPERIMENTAL,
            "effect": "If you are executed, all but 3 players die. After a 10 to 1 countdown, the player with the most players pointing at them, dies.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Cerenovus",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night, choose a player & a good character: they are <b>mad</b> they are this character tomorrow, or might be executed.",
            notes: "Being Mad means the player must pretend to be that role. If they don't, they may be executed.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Devil's Advocate",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night, choose a living player (different to last night): if executed tomorrow, they dont die.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Evil Twin",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "You & an opposing player know each other. If the good player is executed, evil wins. Good cant win if you both live.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Fearmonger",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, choose a player: if you nominate & execute them, their team loses. All players know if you choose a new player.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Goblin",
            "difficulty": EXPERIMENTAL,
            "effect": "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Godfather",
            "difficulty": BAD_MOON_RISING,
            "effect": "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Harpy",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or one or both might die.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Marionette",
            "difficulty": EXPERIMENTAL,
            "effect": "You think you are a good character, but you are not. The Demon knows who you are. [You neighbor the Demon]",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Mastermind",
            "difficulty": BAD_MOON_RISING,
            "effect": "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Mezepheles",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing a secret word. The 1st good player to say this word becomes evil that night.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Organ Grinder",
            "difficulty": EXPERIMENTAL,
            "effect": "All players keep their eyes closed when voting and the vote tally is secret. Each night, choose if you are drunk until dusk.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Pit-Hag",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, choose a player & a character they become (if not in play). If a Demon is made, deaths tonight are arbitrary.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Poisoner",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night, choose a player: they are poisoned tonight and tomorrow day.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Intoxist_OLD",
            "difficulty": CUSTOM_TEST,
            "effect": "On game start and every night* (if you're quick enough), choose a player: they are poisoned until you die or poison someone else.",
            notes: 'You should poison someone before they use their power!',
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
            infoDuration: 'onNightEnd',
            actionDuration: 'onNightEnd',
            getPower: (game, me) => {
                const nSuccessfulPoisons = game.getTownsfolk()
                    .map(p => p.poisonEffectHistory.length)
                    .reduce((soFar, n) => soFar + n, 0)
                return nSuccessfulPoisons + me.isDead? 0: 0.75
            },
            onSetup(game, me) {
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER
                }
            },
            afterNightStart(game, me) {
                if (game.roundNumber == 1) {
                    me.availableAction = null
                    return
                }
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER
                }
                // if (me.chosenPlayerName != null) {
                //     const chosenPlayer = game.getPlayer(me.chosenPlayerName)
                //     const lastPoisonEffect = chosenPlayer.getLastPoisonEffect()

                //     if (lastPoisonEffect?.roundNumber == game.roundNumber - 1) {
                //         me.info = {
                //             roles: [],
                //             type: InfoTypes.ROLES,
                //             text: 'Yes'
                //         }
                //     } else {
                //         me.info = {
                //             type: InfoTypes.ROLES,
                //             text: 'No'
                //         }
                //     }
                // }
            },
            onPlayerAction(game, me, actionData) {
                if (me.chosenPlayerName != null) {
                    const chosenPlayer = game.getPlayer(me.chosenPlayerName)
                    chosenPlayer.removeStatus('Intoxicated')
                }
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                const chosenPlayer = game.getPlayer(actionData)
                chosenPlayer?.poison('Intoxicated', 'never')
                me.chosenPlayerName = chosenPlayer?.name
            },
            afterDeath(game, me) {
                if (me.chosenPlayerName != null) {
                    const chosenPlayer = game.getPlayer(me.chosenPlayerName)
                    chosenPlayer.removeStatus('Intoxicated')
                }
            },
            test(testingInjectable) {
                let game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Intoxist_OLD', 'Saint', 'Saint', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                test(`Normal - Has power on setup`, game.at(1).availableAction != null)
                game.startNight()
                test(`Normal - No has power on night 1`, game.at(1).availableAction == null, `
                    Round no.: ${game.roundNumber}
                `)
                game.startDay()
                test(`Normal - No has power on day 1`, game.at(1).availableAction == null)
                game.startNight()
                test(`Normal - Has power on night 2`, game.at(1).availableAction != null)
                game.at(1).useAction(game, game.at(4))
                test(`Normal - Poison works`, game.at(4).hasStatus('Intoxicated'))
                
                game.startDay()
                game.startNight()
                game.startDay()
                game.startNight()
                game.startDay()
                game.startNight()
                
                test(`Normal - Poison did not expire`, game.at(4).hasStatus('Intoxicated'))
                game.startDay()
                game.tryKillPlayer(game.at(1), { type: SourceOfDeathTypes.OTHER })
                test(`Normal - Dead and not poisoned anymore`, !game.at(4).hasStatus('Intoxicated'))
            }
        },
        {
            "name": "Intoxist",
            "difficulty": CUSTOM_TEST,
            "effect": "On game start, a random good player is poisoned. Each night* (if you're fast enough), choose a player. They are poisoned until you die or poison someone else.",
            notes: 'You should poison someone before they use their power!',
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
            infoDuration: 'onNightEnd',
            actionDuration: 'onNightEnd',
            getPower: (game, me) => {
                const nSuccessfulPoisons = game.getTownsfolk()
                    .map(p => p.poisonEffectHistory.length)
                    .reduce((soFar, n) => soFar + n, 0)
                return nSuccessfulPoisons + me.isDead? 0: 0.75
            },
            onSetup(game, me) {
                const randomTownsfolk = randomOf(...game.getAliveTownsfolk())
                randomTownsfolk?.poison('Intoxicated', 'never')
                me.chosenPlayerName = randomTownsfolk?.name
            },
            afterNightStart(game, me) {
                if (game.roundNumber == 1) {
                    me.availableAction = null
                    return
                }
                me.availableAction = {
                    type: ActionTypes.CHOOSE_PLAYER
                }
            },
            onPlayerAction(game, me, actionData) {
                if (me.chosenPlayerName != null) {
                    const chosenPlayer = game.getPlayer(me.chosenPlayerName)
                    chosenPlayer.removeStatus('Intoxicated')
                }
                if (me.isDrunkOrPoisoned()) {
                    return
                }
                const chosenPlayer = game.getPlayer(actionData)
                chosenPlayer?.poison('Intoxicated', 'never')
                me.chosenPlayerName = chosenPlayer?.name
            },
            afterDeath(game, me) {
                if (me.chosenPlayerName != null) {
                    const chosenPlayer = game.getPlayer(me.chosenPlayerName)
                    chosenPlayer.removeStatus('Intoxicated')
                }
            },
            test(testingInjectable) {
                let game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Intoxist', 'Saint', 'Saint', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                test(`Normal - No has power on setup`, game.at(1).availableAction == null)
                test(`Normal - random TF is poisoned`, game.playersInRoom.some(p => p.hasStatus('Intoxicated') && !p.isEvil()))
                game.startNight()
                test(`Normal - No has power on night 1`, game.at(1).availableAction == null, `
                    Round no.: ${game.roundNumber}
                `)
                game.startDay()
                test(`Normal - No has power on day 1`, game.at(1).availableAction == null)
                game.startNight()
                test(`Normal - Has power on night 2`, game.at(1).availableAction != null)
                game.at(1).useAction(game, game.at(4))
                test(`Normal - Poison works`, game.at(4).hasStatus('Intoxicated'))
                test(`Normal - Only one player is poisoned`, game.playersInRoom.filter(p => p.hasStatus('Intoxicated')).length == 1)
                
                game.startDay()
                game.startNight()
                game.startDay()
                game.startNight()
                game.startDay()
                game.startNight()
                
                test(`Normal - Poison did not expire`, game.at(4).hasStatus('Intoxicated'))
                game.startDay()
                game.tryKillPlayer(game.at(1), { type: SourceOfDeathTypes.OTHER })
                test(`Normal - Dead and not poisoned anymore`, !game.at(4).hasStatus('Intoxicated'))
            }
        },
        {
            "name": "Psychopath",
            "difficulty": EXPERIMENTAL,
            "effect": "Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Scarlet Woman",
            "difficulty": TROUBLE_BREWING,
            "effect": "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers dont count.)",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
            infoDuration: 'onNightEnd',
            getPower: (game, me) => me.isDead? 0: 1.5,
            onNightStart(game, me) {
                if (me.didUsePower) {
                    return
                }
                me.didUsePower = true
                const demon = game.playersInRoom.find(p => p?.getTrueRole()?.isDemon)
                if (demon == null) {
                    me.info = {
                        type: InfoTypes.ROLES,
                        roles: [],
                        text: 'There was an error finding the demon.'
                    }
                    return
                }
                demon.addStatus({
                    name: 'Scarlet Woman Death',
                    afterDeath(game, demon, source) {
                        if (me.isDrunkOrPoisoned()) {
                            return
                        }
                        if (!me.isDead && game.getAlivePlayers()?.length >= 5) {
                            me.assignRoleLater(game, demon.getTrueRole(), { ignoreAssignEvent: true })
                        }
                    }
                })
            },
            test(testingInjectable) {
                let game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Scarlet Woman', 'Saint', 'Saint', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                game.startNight()
                game.tryKillPlayer(game.at(0), { type: SourceOfDeathTypes.EXECUTION })
                test(`Normal execution`, game.winner == null && game.at(1).inspectRole().name == 'Imp')

                game = testingInjectable.makeTestTBGame()
                game.setPlayersAndRoles(['Imp', 'Scarlet Woman', 'Saint', 'Saint', 'Ravenkeeper', 'Recluse', 'Spy', 'Chef', 'Chef', 'Chef'])
                game.doRolesSetup()
                game.startNight()
                game.at(1).poison()
                game.tryKillPlayer(game.at(0), { type: SourceOfDeathTypes.EXECUTION })
                test(`Poisoned execution`, game.winner == 'Townsfolk' && game.at(1).inspectRole().name == 'Scarlet Woman', `
                    Winner: ${game.winner}
                    My role: ${game.at(1).inspectRole().name}
                `)
            }
        },
        {
            "name": "Spy",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
            mayRegisterDifferently: true,
            infoDuration: 'onNightEnd',
            getPower: (game, me) => me.isDead? 0: 2,
            onInspected(me) {
                return me.role
            },
            afterAssignRole(game, me) {
                const rolesNotUsed = game.getRolesNotInGame()
                const goodsNotUsed = rolesNotUsed.filter(r => r.isEvil != true && r.name != 'Recluse')  // Recluse has some weird interactions
                const betterRolesNotUsed = goodsNotUsed.filter(r => !r.effect.includes('You start'))
                
                let myRole
                if (betterRolesNotUsed.length > 0) {
                    myRole = randomOf(...betterRolesNotUsed)
                } else if (goodsNotUsed.length > 0) {
                    myRole = randomOf(...goodsNotUsed)
                } else {
                    myRole = getRole('Drunk')
                }

                me.hasOnlySecretRolePowers = true
                me.secretRole = getRole('Spy')
                me.assignRoleLater(game, myRole, { ignoreAssignEvent: true })
            },
            onNightStart(game, me) {
                me.info = {
                    type: InfoTypes.PLAYERS_WITH_ROLES,
                    playersWithRoles: game.playersInRoom.map(p => ({
                        name: p.name,
                        roleName: p.inspectRole()?.name
                    }))
                }
            }
        },
        {
            "name": "Summoner",
            "difficulty": EXPERIMENTAL,
            "effect": "You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Vizier",
            "difficulty": EXPERIMENTAL,
            "effect": "All players know you are the Vizier. You cannot die during the day. If good voted, you may choose to execute immediately.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Widow",
            "difficulty": EXPERIMENTAL,
            "effect": "On your 1st night, look at the Grimoire & choose a player: they are poisoned. 1 good player knows a Widow is in play.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Witch",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Wizard",
            "difficulty": EXPERIMENTAL,
            "effect": "Once per game, choose to make a wish. If granted, it might have a price & leave a clue as to its nature.",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Xaan",
            "difficulty": EXPERIMENTAL,
            "effect": "On night X, all Townsfolk are poisoned until dusk. [X Outsiders]",
            ribbonColor: EVIL_COLOR,
            ribbonText: "EVIL",
            isEvil: true,
        },
        {
            "name": "Al-Hadikhia",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, you may choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Fang Gu",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead.<br/>There is 1 extra Outsider in play.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Imp",
            "difficulty": TROUBLE_BREWING,
            "effect": "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
            isDemon: true,
            isEvil: true,
            getPower: (game, me) => me.isDead? 0: 3,
            infoDuration: 'onNightEnd',
            onSetup(game, me) {
                showMeMyEvilTeammates(game, me)
            },
            onNightStart(game, me) {
                if (game.roundNumber == 1) {
                    const townsfolkNotInGame = randomizeArray(
                        game.getRolesNotInGame()
                            .filter(r => !r.isEvil)
                            .map(r => r.name)
                    ).slice(0, 3)
                    me.info = {
                        roles: townsfolkNotInGame,
                        showsRoleDescriptions: true,
                        text: 'These roles are <em>not</em> in this game.'
                    }
                } else {
                    me.availableAction = {
                        type: ActionTypes.CHOOSE_PLAYER,
                        clientDuration: ActionDurations.UNTIL_USED_OR_DAY
                    }
                }
            },
            actionDuration: 'onNightEnd',
            onPlayerAction(game, me, actionData) {
                if (game.phase != GamePhases.NIGHT) {   // Prevent multiple requests
                    return
                }
                const chosenPlayer = game.getPlayer(actionData?.name || actionData)

                chosenPlayer.addStatus({
                    name: "Targeted By Demon",
                    onNightEnd: () => {
                        game.tryKillPlayer(chosenPlayer, { type: SourceOfDeathTypes.DEMON_KILL })
                        if (chosenPlayer.name == me.name && me.isDead) {
                            const minions = game.getAliveMinions()
                            if (minions.length == 0) {
                                return
                            }
                            const minion = randomOf(...minions)
                            minion.assignRoleLater(game, getRole('Imp'), { ignoreAssignEvent: true })
                        }
                    }
                })
            }
        },
        {
            "name": "Kazali",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, choose a player: they die. [You choose which players are which Minions. -? to +? Outsiders]",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Legion",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Leviathan",
            "difficulty": EXPERIMENTAL,
            "effect": "If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Lil' Monsta",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night, Minions choose who babysits Lil Monsta & is the Demon. Each night*, a player might die. [+1 Minion]",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Lleech",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, choose a player: they die. You start by choosing a player: they are poisoned. You die if & only if they are dead. ",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Lord of Typhon",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. There can be any number of outsiders]",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "No Dashii",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Ojo",
            "difficulty": EXPERIMENTAL,
            "effect": "Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Po",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Pukka",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Riot",
            "difficulty": EXPERIMENTAL,
            "effect": "On day 3, Minions become Riot & nominees die but nominate an alive player immediately. This must happen.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Shabaloth",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Vigormortis",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor.<br/>There is 1 less Outsider in play.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Vortox",
            "difficulty": SECTS_AND_VIOLETS,
            "effect": "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.",
            isDemon: true,
            isEvil: true,
            ribbonText: 'REMINDER',
            ribbonColor: MORNING_COLOR
        },
        {
            "name": "Yaggababble",
            "difficulty": EXPERIMENTAL,
            "effect": "You start knowing a secret phrase. For each time you said it publicly today, a player might die."
        },
        {
            "name": "Zombuul",
            "difficulty": BAD_MOON_RISING,
            "effect": "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.",
            isDemon: true,
            isEvil: true,
        },
        {
            "name": "Unknown",
            "difficulty": META_ROLES,
            "effect": "This person's role is unknown."
        }
    ]
    for (let i = 0; i < roles.length; i++) {
        roles[i].i = i
    }
    return roles
}

export function getRolesByDifficulty(difficulty) {
    return getRoles().filter(role => role.difficulty <= difficulty)
}
export function getRolesForDifficulty(difficulty) {
    return getRoles().filter(role => role.difficulty == difficulty)
}
export function getSectionFilters() {
    const allRoles = getRoles()
    const difficulties = getAllRoleDifficulties()
    const filterFunctions = []
    for (const difficulty of difficulties) {
        const filter = i => allRoles[i].difficulty == difficulty
        filterFunctions.push(filter)
    }
    return filterFunctions
}
export function getAllRoleDifficulties() {
    const roles = getRoles()
    const foundDifficulties = []
    for (const role of roles) {
        if (foundDifficulties.includes(role.difficulty) == false) {
            foundDifficulties.push(role.difficulty)
        }
    }
    return foundDifficulties.sort()
}

export function printRolesByDifficulty() {
    throw `Not implemented`
}

export function sortRolesNormal(roles) {
    const getRoleSortValue = role => 
        role.isDemon?
            99
        :role.ribbonText == 'EVIL'?
            98
        :role.ribbonText == 'OUTSIDER'?
            10
        :role.effect.toLowerCase().includes('you start')?
            1
        :role.effect.toLowerCase().includes('each night,')?
            2
        :role.effect.toLowerCase().includes('night*')?
            3
        :
            4

    const rolesSorted = [...roles]
    rolesSorted.sort((a, b) => getRoleSortValue(a) - getRoleSortValue(b))
    return rolesSorted
}

export const NO_PRIORITY = 99
const setupOrder = [

    // High priority pregame effects
    'Philosopher',
    'Snake Charmer',
    'Evil Twin',

    // Pre-game effects
    'Sailor',
    'Courtier',
    
    // Setup evil knowledge
    'Godfather',

    // Choose a player (parallel)..
    'Devil\'s Advocate',
    'Poisoner',
    'Witch',
    'Cerenovus',
    'Spy',
    
    // Lunatic
    'Lunatic',
    
    // Killing
    'Pukka',
    
    // Start info
    'Grandmother',
    'Washerwoman',
    'Librarian',
    'Investigator',
    'Clockmaker',
    'Chef',

    // Nightly info
    'Flowergirl',
    'Town Crier',
    'Dreamer',
    'Seamstress',
    'Empath',
    'Fortune Teller',
    
    // Other
    'Butler',

    // End of night
    'Mathematician',
    'Chambermaid'
]
export function getSetupRolePriority(roleOrRoleName) {
    if (roleOrRoleName == null) {
        return NO_PRIORITY
    }
    let roleName = roleOrRoleName.name != null? roleOrRoleName.name : roleOrRoleName
    const index = setupOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}
const normalOrder = [
    'Imp',
    'Scarlet Woman',
    'Baron',
    'Poisoner',
    'Spy'
]
export function getNormalRolePriority(roleOrRoleName) {
    if (roleOrRoleName == null) {
        return NO_PRIORITY
    }
    let roleName = roleOrRoleName.name != null? roleOrRoleName.name : roleOrRoleName
    const index = normalOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}

const nightlyOrder = [
    // High priority pregame effects
    'Philosopher',
    'Snake Charmer',

    // Drunk makers
    'Minstrel',
    'Sailor',
    'Innkeeper',
    'Courtier',
    
    // Poisoner-like effects (parallel)
    'Poisoner',
    'Witch',
    'Cerenovus',
    
    // Pre-evils Monk-like effects
    'Gambler',
    'Monk',
    'Exorcist',

    // Non-invasive evils
    "Devil's Advocate",
    'Spy',

    // Scarlet Woman
    'Scarlet Woman',

    // Evil Killings
    'Pit-Hag',
    'Fang Gu',
    'Vigormortis',
    'Vortox',
    'No Dashii',
    'Zombuul',
    'Pukka',
    'Shabaloth',
    'Imp',
    
    'Assassin',
    'Godfather',
    
    // Death effects
    'Barber',
    "Sage",
    'Ravenkeeper',
    'Undertaker',

    // Nightly knowledge
    'Flowergirl',
    'Town Crier',
    'Dreamer',
    'Seamstress',
    'Empath',
    'Fortune Teller',
    'Professor',
    
    // Pre-end of night effects
    'Oracle',
    'Gossip',
    'Tinker',
    'Moonchild',
    'Grandmother',
    
    // End of Night
    'Goon',
    'Butler',

    'Mathematician',
    'Chambermaid',

    // Start of day
    'Juggler',

]
export function getNightlyRolePriority(roleOrRoleName) {
    if (roleOrRoleName == null) {
        return NO_PRIORITY
    }
    let roleName = roleOrRoleName.name != null? roleOrRoleName.name : roleOrRoleName
    const index = nightlyOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}

export function getSortRolesWithPriorityFunction(roles, getRolePriority) {
    const rolesSortedByPrio = roles.sort((a, b) => getRolePriority(a) - getRolePriority(b))
    const rolesWithPrio = rolesSortedByPrio.filter(role => getRolePriority(role) != NO_PRIORITY)
    const rolesWithoutPrio = rolesSortedByPrio.filter(role => getRolePriority(role) == NO_PRIORITY)
    const rolesWithoutPrioSorted = rolesWithoutPrio.sort((a, b) => a.name.localeCompare(b.name))

    return [...rolesWithPrio, ...rolesWithoutPrioSorted]
}

function showMeMyEvilTeammates(game, me) {
    const evils = game.getEvils().filter(p => p.name != me.name)
    me.info = {
        type: InfoTypes.PLAYERS_WITH_ROLES,
        text: 'These are your teammates.',
        buttonText: 'See Teammates',
        buttonColor: '#eb8034',
        playersWithRoles: evils.map(p => ({
            name: p.name,
            roleName: p.getTrueRole()?.isDemon? p.getTrueRole()?.name: 'Unknown'
        }))
    }
}


export function getRole(name) {
    return getRoles().find(role => role.name == name)
}
export function getRoleByI(i) {
    return getRoles().find(role => role.i == i)
}

export function getRoleNumbersByPlayers(nPlayers) {
    const roleNumbersTable = {
        /* Townsfolk    Outsiders Minions    Demons */
        3: [2,          0,        0,          1],
        4: [3,          0,        0,          1],
        5: [3,          0,        1,          1],
        6: [3,          1,        1,          1],
        7: [5,          0,        1,          1],
        8: [5,          1,        1,          1],
        9: [5,          2,        1,          1],
       10: [7,          0,        2,          1],
       11: [7,          1,        2,          1],
       12: [7,          2,        2,          1],
       13: [9,          0,        3,          1],
       14: [9,          1,        3,          1],
       15: [9,          2,        3,          1],
    }

    const [nTownsfolk, nOutsiders, nMinions, nDemons] = roleNumbersTable[nPlayers]
    return { nTownsfolk, nOutsiders, nMinions, nDemons }
}

const OUTSIDER_POWER = 0
const TOWNSFOLK_POWER = 1
const MINION_POWER = TOWNSFOLK_POWER * 2
const DEMON_POWER = TOWNSFOLK_POWER * 3
