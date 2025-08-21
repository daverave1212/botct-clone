
import { InfoTypes } from '$lib/shared-lib/GamePhases'

export const tips = [
    {
        type: InfoTypes.ROLES,
        roles: [],
        text: 'The AI Storyteller will try to mess with you hard if you are Drunk or Poisoned! Don\'t underestimate it!'
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Intoxist'],
        text: "The Intoxist replaces the Poisoner and is similar. On game start, it's not as good, becaue the first poison is random. However, because the Intoxist poison lasts until someone else is picked, the Intoxist can wait for someone to use their power while poisoned, then poison someone else, effectively poisoning 2 people per night!"
    },
    {
        type: InfoTypes.ROLES,
        text: "The AI Storyteller is smart - it plans ahead and makes no mistakes (unless it's bugged). There are certain interactions that a human Storyteller may not keep track of, but the AI does!"
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Recluse'],
        text: "The Recluse always appears as a negative role. Unless poisoned, there's no way to actually tell it's a Recluse."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Spy'],
        text: "The Spy always appears as a positive role that's not a duplicate. Unless poisoned, there's no way to actually tell it's a Spy."
    },
    {
        type: InfoTypes.ROLES,
        text: "Evil roles and some other roles get their information on setup ('Game Starting'), as opposed to on first night."
    },
    {
        type: InfoTypes.ROLES,
        text: "The app does not account for nominations, voting and executions. As such, the game's host must count votes, organize the game and has buttons for 'Execute'."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Moonchild'],
        text: "For Trouble Brewing, some roles like Virgin, Poisoner and Butler were not doable. Poisoner was replaced with a custom role Intoxist, which is similar. Butler was replaced with Moonchild, and Virgin was replaced with Grandmother."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Mayor'],
        text: "The Mayor may or may not die when targeted by the demon. If the Townsfolk are winning, a Townsfolk might die instead. Otherwise, an evil might die instead."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Soldier'],
        text: "If you're a Soldier, try bluffing as an important role. You want to be targeted by the demon, because you're immune!"
    },
    {
        type: InfoTypes.ROLES,
        text: "Asking a player about the UI of the app or these tips is illegal."
    },
    {
        type: InfoTypes.ROLES,
        text: "Remember the demon knows 3 roles that are not in the game. There can't be 2 of the same in game, even if there's a Drunk, Recluse or Spy."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Spy'],
        text: "The Spy appears as a different good role that's not in game. However, the Spy does not know what role they appear as. They must figure it out!"
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Grandmother'],
        text: "If you're the Grandmother, it may be worth pretending you're a very important role so you get killed early."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Moonchild'],
        text: "Moonchild may not want to reveal they're a Moonchild early game, so they get killed. It can be a very powerful ability early game, but mid game it becomes dangerous."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Moonchild'],
        text: "Moonchild is an Outsider.<br>Is it good to say you're the Moonchild? Perhaps..."
    },
    {
        type: InfoTypes.ROLES,
        roles: ['Chef'],
        text: "The Chef's information can be inaccurate due to the Spy or Recluse."
    },
    {
        type: InfoTypes.ROLES,
        text: "Please consider supporting team David by buying him a drink."
    },
    {
        type: InfoTypes.ROLES,
        text: "The game has been extensively tested through more than 135 automatic unit tests, with many edge cases tested!"
    }
]