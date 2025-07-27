
export const getMods = () => [
    {
        name: 'No Mod',
        effect: 'No mod.',
        isMod: true
    },
    {
        name: 'Thick Mist',
        effect: "Pick another Condition and keep it secret. The players don't know what it is, if possible (or until time comes to reveal it).",
        isMod: true
    },
    {
        name: 'Alcohol',
        effect: "At game start, the narrator secretly chooses a Townsfolk to be DRUNK. They have a role card, but their ability secretly has no effect.",
        notes: "If that role gets information, they get fake or random information.",
        isMod: true
    },
    {
        name: 'Blood Moon',
        effect: "Before giving roles, all Strigoys and a random Townsfolk are replaced with other Evil roles. Evils know eachother but don't kill at night.",
        notes: "The way to kill Townsfolk at day is by hanging instead of eating them.",
        isMod: true
    },
    {
        name: 'Conspiracy',
        effect: "At game start, the narrator gives 2 pieces of knowledge about the Evils, but one is false.",
        isMod: true
    },
    {
        name: "Dark Times",
        effect: "At least one player MUST be hanged every day before nightfall.",
        notes: "When selecting roles, replace the Seer with a different role.",
        isMod: true
    },
    {
        name: "Stress",
        effect: "Every day, either 2 people or 0 people die. There are 2 rounds of voting.",
        notes: "If players decide not to hang the 2nd person, nobody is hanged.",
        isMod: true
    },
    {
        name: "Burn The Witch",
        effect: "A majority is not needed to kill someone - the player with most votes every day is hanged.",
        isMod: true
    },
    {
        name: "Good Harvest",
        effect: "At game start, 2 random players get 2 role cards instead of 1. Both cards apply. If a player has an Evil card, they're evil.",
        isMod: true
    },
    {
        name: "Torch of Protection",
        effect: "Every morning, pass the Torch to another player who hasn't had the Torch. If you have the Torch, you can't die.",
        notes: "The Flame goes away once everyone had it once.",
        isMod: true
    },
    {
        name: "Winter Is Coming",
        effect: "Every day lasts exactly 4 minutes - 3 minutes for talking, and exactly 1 minute to resolve voting.",
        notes: "If players didn't have time to vote, tough luck! It's already night!",
        isMod: true
    },
    {
        name: "Sunny Day",
        effect: "When someone dies, reveal their card.",
        isMod: true
    },
    {
        name: "Stolen Election",
        effect: "Each dead player can vote once after they died (except the Mayor).",
        isMod: true
    },
    {
        name: "Evil Whispers",
        effect: "All Evils know who other Evils are on game start.",
        isMod: true
    }
]