
<style>
    h1, h2 {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
    h3, h4 {
        margin-top: 2.5rem;
        margin-bottom: 0.75rem;
    }
    p {
        margin-top: 1rem;
    }
    ul {
        margin-top: 1rem;
    }
    li {
        list-style-type: none;
        padding-left: 1rem;
        margin-top: 0.5rem;
    }
    .icon {
        margin-right: 0.25rem;
    }
</style>

<script>
    import RoundCardPortrait from "../../components/RoundCardPortrait.svelte";


</script>

<div class="page">
    <div class="center-content portrait-wrapper margin-top-4" in:fly={{y: -100, delay: 50 }}>
        <RoundCardPortrait role={{name: 'Strigoy', isBig: true, isValid: true}}/>
    </div>

    <h2>What Is Strigoy?</h2>
    <p>Strigoy is a free print & play social deduction game for 9 to 20 players. It's an homage to games like Mafia, Werewolf, Salem, Blood on the Clock Tower, etc. One or more players are evil Strigoys, and the rest are townsfolk who try to figure out who the Strigoys are. To play, you will need to print the cards by going to the Print page.</p>

    <h2>Why Strigoy?</h2>
    <p>As a game designer, I've changed standard game rules and roles to make the game easy to run, have tons of content and make each game different. Here are the pros of Strigoy over other similar games:</p>
    <ul>
        <li><img src="/images/status/Used Ability.png" class="icon"/>Faster and easy to narrate - few nightly roles, not much narrator tracking, etc.</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>40+ roles, with cool and creative powers (categorized by difficulty)</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>App for narrator & players (this one)</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>15+ Mod cards that make every game different</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>Free print & play</li>
    </ul>

    <h2>How To Play</h2>
    <p>Each game of Strigoy starts with the Setup (where everyone closes their eyes). Then, there is a cycle of Day, Night, Day, Night, and so on, until the game ends.</p>
    <p>At Day, players can vote to hang someone they think is suspicious. At Night, everyone closes their eyes and the Strigoys will kill someone, and some players may wake up as well to use their powers.</p>
    <p>The game ends either when all Strigoys are dead, or all Townsfolk are dead.</p>

    <h3>0. Prerequisites</h3>
    <p>To play, you will need to print and cut the cards. Go to <a href="/card">the Print page</a> to print all the cards.</p>
    <p>Find a minimum of 9 players. One of them will be the <b>narrator</b>.</p>

    <h3>1. Open the app</h3>
    <p>
        Assuming you're the narrator, go to the <a href="/">main page of this app</a> and hit play.<br>
        Add each player to the app (except the narrator) and hit next.
        Choose the difficulty and whether you want mods (see <a href="/how-to-play#mods">Mods</a>).
    </p>
    <p>
        Then, the app will automatically choose a <i>balanced roles distribution</i> so that neither side is favored.
    </p>

    <h3>2. Shuffle and give cards</h3>
    <p>
        After you have the roles in the app, take those cards, shuffle them, and give each player one.
        Look at them, and input each player's role into the app.
    </p>
    <p>There are now 2 teams (<i>probably</i>): Townsfolk vs Evils.</p>

    <h3>3. Setup ('First Night')</h3>
    <p>As the narrator, say "Everyone, close your eyes".</p>
    <p>For each Evil and <i>Setup</i> role, tell that role to open their eyes. Start with all the Evils and say "All Evils, wake up". Let them recognize eachother. Nobody dies on Setup.</p>
    <p>When done, tell them "Close your eyes".</p>
    <p>Then do this for each Setup role in the game (<b>note</b>: nightly roles to NOT wake up on setup; they only wake up during normal nights). Follow the order as sorted with the <b>Sort for Setup</b> button, or on <a href="all-roles">All Roles page</a>.</p>
    <p><b>Unless it specifically says so, nobody is killed or can use their power at this setup! Most people don't know who others are.</b></p>

    <h3>3.1. Clue</h3>
    <p>Once the setup is done, give the players one clue about the Strigoys. Here are some clue ideas:</p>
    <ul>
        <li>At least 2 Evils are sitting next to eachother (or none are sitting next to eachother)</li>
        <li>At least one Strigoy is wearing a certain color (or colorful/grayscale clothes)</li>
        <li>At least one Strigoy has long hair</li>
        <li>The Evil roles are exactly: ...</li>
        <li>There are exactly <b>X</b> Peasants this game</li>
    </ul>

    <h3>4. Day</h3>
    <p>Once the Setup is done, say "Everyone, wake up". Players can now talk, speculate and plan.</p>
    <p>At the end of every <i>day</i>, players can vote to hang one person. If they want to hang someone, players can vote on who to hang (see <a href="#voting">Voting and Hanging</a>). Only one person can be hanged every day.</p>
    <p><b>Note</b>: When a player dies, they do NOT show their card. Also, <b>that player remains in the game</b>, but can't vote or use their ability (they might be revived)!</p>
    <p>After a player dies, "Everyone, close your eyes". Move on to the Night phase.</p>

    <h3>5. Night</h3>
    <p>Say "Everyone, close your eyes".</p>
    <p>One by one, tell each <b>Nightly</b> role to wake up, as sorted with the <b>Sort for Night</b> button, or on <a href="all-roles">All Roles page</a>. Follow the app.</p>
    <p>For example, all Strigoys, together, wake up and always kill one person per night. You can ask "Who do you want to kill?" and they will have to decide together on one person.</p>
    <p><b>Note</b>: Most other non-Strigoy <i>Evil</i> roles do NOT wake up each Night.</p>
    <p>After that, tell them to close their eyes.</p>
    <p>Do the same for all other <b>Nightly</b> roles.</p>
    <p><b>Note:</b> Some roles have special or secret <b>Nightly</b> abilities, and you don't wake them up!<br>They may simply raise their hand, with eyes closed (e.g. Silencer, Lover, etc). Pay close attention if you have one of those in game, and read the roles carefully.</p>

    <h3>Rinse and Repeat</h3>
    <p>The game goes from Day to Night to Day to Night, until the game ends.</p>

    <h3>Game End</h3>
    <p>The game ends when either <b>all the Strigoys are dead</b> (and Townsfolk win), or all Townsfolk are dead (and Evils win). All Townsfolk/Evils <b>win together, even if dead</b>.</p>
    <p>If playing with <a href="#points">points</a>, calculate how many points winners get and distribute them.</p>

    <h2>Voting, Hanging, Death</h2>
    <p>At the end of each Day, players can nominate people to hang.</p>
    <p>For each nominee, say "If you want to hang this person, raise your hand". Count the number of hands raised.</p>
    <p>The player with most votes dies, but only if they have a number of votes greater than half the number of players (e.g. at 5 votes with 9 players, the person is hanged; at 6 votes with 12 players, the person is not hanged).</p>

    <h3>Death</h3>
    <p>When a player dies, they remain in the game but their power no longer works, and they can't vote. They do NOT reveal their card, unless the role specifically says so.</p>
    <p><b>Note that the dead players may be revived later!</b></p>
    <p>When a player dies and their role does something on death, that thing <b>must</b> happen (e.g. when the Hunter dies, they <b>must</b> kill someone).</p>

    <h2 id="mods">Mods</h2>
    <p>
        Mods are <i>modifiers</i> - cards that change how the game works.
        Each mod adds an extra rule to the game, such as Sunny Day (everyone reveals their card on death), Stolen Election (dead players can vote once), Conspiracy (when the narrator gives info at game start, they give 2 pieces of information about the game, but one of them is true and the other is false), or even Thick Mist (secretly draw another Mod).
    </p>
    <p>
        At game start, the narrator must announce what Mod was drawn for this game.
    </p>
    <p>
        If you want to play with mods, select the Mods option below the difficulty options, and a mod will be automatically drawn.
    </p>        
    <p>
        Mods are not balanced and may favor the Evils or the Townsfolk. However, I can promise tons of interesting games for endless replayability!
    </p>

    <h2 id="points">Difficulties</h2>
    <p>
        To help ease-in players into the game, the 45+ roles are divided into categories based on difficulty. The BAD_MOON_RISING difficulty is meant for players who have not played the game yet. When you feel confident that everyone understands the game and is familiar with the roles, you can increase the difficulty.
    </p>
    <p>
        Note that when playing with a difficulty, it also contains all roles from lower difficulties! The Advanced difficulty contains all roles from BAD_MOON_RISING and Intermediate.
    </p>
    <p>
        The recommended difficulty for standard games is Advanced.
        The Complete difficulty adds extra roles, which are usually simple, but just bring more flavor and variation to the game.
    </p>

    <h2 id="points">Points</h2>
    <p>If you're planning to play multiple rounds with the same people, you can play with points.</p>
    <ul>
        <li>If the Townsfolk win, each alive townsfolk gets a number of points equal to the alive Townsfolk. Each dead Townsfolk gets the same amount minus 1.</li>
        <li>If the Evils win, each alive Evil gets a number of points equal to the dead Townsfolk. Each dead Evil gets the same amount minus 1.</li>
        <li>If the Madman wins, they get a number of points equal to the number of players.</li>
        <li>If the Alien wins, they get a number of points equal to half the number of players.</li>
    </ul>
    <p>Any rounding is rounded down (e.g. for Archaeologist, Alien).</p>

    <h2>Q&A</h2>
    <h3>What happens if a nightly role dies?</h3>
    <p>If a nightly role dies, the narrator will no longer call for them to wake up at night.</p>
    <p>As an alternative rule, to make it more difficulty for the Townsfolk, feel free to keep pretending, as the narrator, that that role is still in the game. Make sure that players know you might do that.</p>

    <h3>If someone non-Evil becomes Evil, do they know who other Evils are?</h3>
    <p>Not necessarily. It's up to them to figure it out.</p>

    <h3>What sizes are the cards and print papers?</h3>
    <p>Each card is 756x1093px in size at 300dpi. When printing on an A4 paper, this is the standard playing card size (e.g. Magic the Gathering size). An A4 paper size should be 2480x3508px at 300dpi.</p>
</div>