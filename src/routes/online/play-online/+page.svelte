<script>
	import { me } from './../../../stores/online/local/me.js';
	import { allIcons } from './../../../lib/IconsDatabase.js';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { fetchGame } from '../../../lib/online-utils.js';
    import RoundCardPortrait from '../../../components/RoundCardPortrait.svelte';
    import RoleChooserManyDrawer from '../../../components/RoleChooserManyDrawer.svelte';
    import { roomCode } from '../../../stores/online/local/room.js';


    let isRoleChooserOpen = false

    let cachedChosenIconSrc = $me.src

    me.subscribe(newMe => {
        cachedChosenIconSrc = newMe.src
    })

    function onNameClick() {
        const name = prompt('Your name:')
        $me = {...$me, name: name }
    }

    function onPortraitClick() {
        isRoleChooserOpen = true
    }

    function setIcon(iconI) {
        const chosenIcon = allIcons[iconI]
        isRoleChooserOpen = false
        $me = {...$me, src: chosenIcon.src }
        cachedChosenIconSrc = chosenIcon.src
        console.log(`Set icon to ${iconI} ${cachedChosenIconSrc}`)
    }

    function closeRoleChooserDrawerWithoutSideEffects() {
        isRoleChooserOpen = false
    }


    async function onJoin() {

    }

    async function onCreate() {
        // privateKey is the same for the owner and the game
        const response = await fetchGame('POST', '/api/game')
        $me = {...$me, privateKey: response.privateKey }
        $roomCode = response.roomCode
        goto('/online/online-game')
    }

</script>


<RoleChooserManyDrawer
    isOpen={isRoleChooserOpen}
    roles={allIcons}
    
    sectionFilters={[_ => true]}
    sectionTitles={['All Icons']}
    sectionTexts={['']}

    onClickOnRole={clickedRoleI => setIcon(clickedRoleI)}
    onClickOutside={() => closeRoleChooserDrawerWithoutSideEffects()}
></RoleChooserManyDrawer>

<div class="page center-text">

    <h2 class="margin-top-4">Play!</h2>
    <p class="margin-top-1">Tap on the icon to change your portrait. Choose if you want to join an existing game or create a new one.</p>
    
    <div class="flex-column gap-1 margin-top-2">

        <div class="center-content">
            <RoundCardPortrait
                src={$me.src}
                isBig={true}
                on:click={onPortraitClick}
            />
        </div>
        <input class="margin-top-2" placeholder="Name" on:click={onNameClick} value={$me.name} readonly/>
        <div class="flex-content center margin-top-2">
            <a in:fly={{y: 100, delay: 100 }} class="btn big colorful" href="/online/join">Join</a>
            <button class="btn big colorful" on:click={onCreate}>Create</button>
        </div>


    </div>


</div>