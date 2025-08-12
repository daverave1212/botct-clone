<script>
	import { randomInt } from '$lib/shared-lib/shared-utils';
	import EmojiPortrait from './../../../components/EmojiPortrait.svelte';
	import DrawerPage from './../../../components-standalone/DrawerPage.svelte';
    import { getAvailableEmojis } from './../../../lib/EmojiDatabase.js';
    import { me } from './../../../stores/online/local/me.js';
    import { allIcons } from './../../../lib/IconsDatabase.js';
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition';
    import { fetchGame } from '../../../lib/online-utils.js';
    import RoundCardPortrait from '../../../components/RoundCardPortrait.svelte';
    import RoleChooserManyDrawer from '../../../components/RoleChooserManyDrawer.svelte';
    import { roomCode, scriptName } from '../../../stores/online/local/room.js';
    import { getCustomScriptRoleNames, setCustomScript } from '../../../stores/custom-scripts-store.js';
    import SafeButton from '../../../components-standalone/SafeButton.svelte';    

    let isRoleChooserOpen = false
    let isEmojiChooserOpen = false

    let cachedChosenIconSrc = $me.src
    let cachedChosenEmoji = $me.emoji

    let colorRangeValue = randomInt(1, 359)
    
    $: myColor = `hsl(${colorRangeValue}, 70%, 60%)`

    me.subscribe(newMe => {
        cachedChosenIconSrc = newMe.src
        cachedChosenEmoji = newMe.emoji
    })

    function onNameClick() {
        const name = prompt('Your name:')
        $me = {...$me, name: name }
    }

    function onPortraitClick() {
        // isRoleChooserOpen = true
        isEmojiChooserOpen = true
    }

    function onClickOnEmoji(emojiStr) {
        isEmojiChooserOpen = false
        $me = {...$me, emoji: emojiStr }
        cachedChosenEmoji = emojiStr
    }


    async function onJoin() {
        const inputRoomCode = prompt('Enter room code.')
        $roomCode = inputRoomCode
        const newMe = await fetchGame('POST', `/api/game/${inputRoomCode}/player`, { me: $me })
        $me = {...newMe, privateKey: $me.privateKey}
        const game = await fetchGame('GET', `/api/game/${inputRoomCode}`)
        $scriptName = game.scriptName
        setCustomScript(game.scriptName, game.scriptRoleNames)
        // Fixes localStorage not finishing updating before we go to another page
        setTimeout(() => {
            goto('/online/online-game')
        }, 250)
    }

    async function onCreate() {
        $me = {...$me, color: myColor}
        goto('/online/create-game')
    }

</script>

<DrawerPage isOpen={isEmojiChooserOpen} on:click={() => {
    isEmojiChooserOpen = false
}}>
    <div class="flex wrap padding-2" style="justify-content: space-around; gap: 4rem;">
        {#each getAvailableEmojis() as emoji, i (i)}
            <div class="unselectable" style="font-size: 3rem;" on:click={() => {onClickOnEmoji(emoji)}}>
                {emoji}
            </div>
        {/each}
    </div>
</DrawerPage>

<!-- <RoleChooserManyDrawer
    isOpen={isRoleChooserOpen}
    roles={allIcons}
    
    sectionFilters={[_ => true]}
    sectionTitles={['All Icons']}
    sectionTexts={['']}

    onClickOnRole={clickedRoleI => setIcon(clickedRoleI)}
    onClickOutside={() => closeRoleChooserDrawerWithoutSideEffects()}
></RoleChooserManyDrawer> -->

<div class="page center-text">

    <h2 class="margin-top-4">Play!</h2>
    <p class="margin-top-1">Tap on the icon to change your portrait and adjust the slider for the background color. Choose if you want to join an existing game or create a new one.</p>
    
    <div class="flex-column gap-1 margin-top-2">

        <div class="center-content">
            <RoundCardPortrait
                src={$me.src}
                isBig={true}
                hasCustomContent={true}
                on:click={onPortraitClick}
            >
                <EmojiPortrait
                    emoji={$me.emoji}
                    size="var(--role-chooser-image-size-big)"
                    color="hsl({colorRangeValue}, 70%, 60%)"
                />
            </RoundCardPortrait>
        </div>
        <div>
            <input style={`color: ${myColor};`} type="range" min="1" max="360" step="1" bind:value={colorRangeValue} on:change={() => {
                $me = {...$me, color: myColor}
            }}>
        </div>
        <input class="margin-top-2" placeholder="Name" on:click={onNameClick} value={$me.name} readonly/>
        <div class="flex-content center margin-top-2">
            <SafeButton class="btn big colorful" timeout={500} on:click={onJoin}>Join</SafeButton>
            <SafeButton class="btn big colorful" timeout={500} on:click={onCreate}>Create</SafeButton>
            <!-- <button class="btn big colorful" on:click={onJoin} in:fly={{y: 100, delay: 100 }}>Join</button>
            <button class="btn big colorful" on:click={onCreate} in:fly={{y: 100, delay: 150 }}>Create</button> -->
        </div>


    </div>


</div>