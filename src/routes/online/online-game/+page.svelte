
<style>
    body {
        overflow: hidden;
    }
</style>

<script>
	import { phase, playersInRoom, roomCode, scriptRoleNames } from '../../../stores/online/local/room.js';
    import { GamePhases, ActionDurations, ActionTypes } from '$lib/shared-lib/GamePhases.js'
    import { browser } from '$app/environment'
    import { afterNavigate } from '$app/navigation'

    import Contact from "../../../components/Contact/Contact.svelte";
    import ContactList from "../../../components/ContactList.svelte";
    import DrawerPage from "../../../components-standalone/DrawerPage.svelte";
    import { getRole, getRoles } from "../../../lib/Database";
    import Modal from "../../../components-standalone/Modal.svelte";
    import Tooltip from "../../../components-standalone/Tooltip.svelte";
    import { addPlayer, addPlayerAdded, addPlayerTemporary, getAddedPlayerRoleDifficulties, removePlaceholderRoles, removePlayer, setPlayerStateI } from "../../../stores/added-players-store";
    import { sortCurrentRolesNightly, sortCurrentRolesSetup } from "../../../stores/added-players-store";
    import { hasExpandTooltip, hasInspectTooltip, hasSetRoleTooltip, hasSortTooltip } from '../../../stores/tutorial-store';
    import { currentlySelectedMod } from '../../../stores/mods-store.js';

    import '../../../components/add-contact-button.css'
    import LocationPicker from '../../../components/LocationPicker.svelte';
    import { chosenScriptRoleNames } from '../../../stores/scripts-store.js';
    import RoleChooserManyDrawer from '../../../components/RoleChooserManyDrawer.svelte';
    import InspectRoleDrawer from '../../../components/InspectRoleDrawer.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { fetchGame, getPlayersInRoom } from '../../../lib/online-utils.js';
    import SimpleContact from '../../../components/Contact/SimpleContact.svelte';
    import MinimalContact from '../../../components/Contact/MinimalContact.svelte';
    import { get } from 'svelte/store';
    import { me } from '../../../stores/online/local/me.js';
    import RoundCardPortrait from '../../../components/RoundCardPortrait.svelte';

    let gameOwnerName = null

    let countdownStart = null
    let countdownDuration = null
    let nSecondsRemaining = null

    let isMyRoleDrawerOpen = false
    let isMyInfoDrawerOpen = false
    let isActionChoosePlayerDrawerOpen = false

    let _nFetchRetries = 0  // Prevent spam in the console and server. Stop at 3
    async function refresh() {
        if (_nFetchRetries >= 3)
            return

        const gameRoomCode = $roomCode
        if (gameRoomCode == null) {
            throw `Null roomCode for online-game.`
        }

        let game
        try {
            game = await fetchGame('GET', `/api/game/${get(roomCode)}`)
            console.log({game})
        } catch (e) {
            _nFetchRetries += 1
            console.error(e)
            return
        }

        gameOwnerName = game.ownerName
        $playersInRoom = game.playersInRoom
        $phase = game.phase
        $scriptRoleNames = game.scriptRoleNames

        const newMe = game?.playersInRoom?.find(p => p.name == $me.name)
        if (newMe) {
            $me = newMe
        }

        if (game.countdownStart != null) {
            countdownStart = game.countdownStart
            countdownDuration = game.countdownDuration
        } else {
            countdownStart = null
            countdownDuration = null
            nSecondsRemaining = null
        }
    }

    async function maybeTickCountdown() {
        if (countdownStart == null) {
            return
        }
        const timeElapsed = Date.now() - countdownStart
        const timeRemaining = countdownDuration - timeElapsed
        nSecondsRemaining = Math.floor(timeRemaining / 1000)
        if (nSecondsRemaining < 0) {
            console.log(`Referesghing..`)
            await refresh()
        }
    }

    let refreshIntervalId
    let countdownIntervalId
    
    onMount(() => {
        refresh()
        refreshIntervalId = setInterval(async () => {
            await refresh()
        }, 3000)
        countdownIntervalId = setInterval(() => {
            maybeTickCountdown()
        }, 1000)
    })
    onDestroy(() => {
        clearInterval(refreshIntervalId)
        clearInterval(countdownIntervalId)
    })
    
    $:availableRoles = $chosenScriptRoleNames == null? []: $chosenScriptRoleNames

    $: shouldShowSortTooltip =
        $hasExpandTooltip == false &&
        $playersInRoom.filter(player => player.role == null).length == 0 &&
        $hasSortTooltip
    $: backgroundColor = $phase == 'night'? 'black': 'white'
    

    const statusEffects = [
        'Protected',
        'Drunk',
        'Granny',
        'Poisoned',
        'Used Ability',
        'Red Herring',
        'Evil',
        'Pukkaed',
        'Enemy',
        'Targeted',
        'Out of Game',
    ]

    // Inspect drawer
    let currentModalObject = null
    function openModalWithRoleName(roleName) {
        $hasInspectTooltip = false
        currentModalObject = getRole(roleName)
    }
    function closeModal() {
        currentModalObject = null
    }

    // Color drawer
    let currentColor = null

    // Role chooser
    let isRoleChooserOpen = false
    let currentlySelectedRoleI

    // Confirm modal
    let isModalOpen = false
    let modalText = ""
    let modalConfirmButtonText = "Kill!"
    let modalOnConfirm = () => {}
    let modalOnCancel = () => {}


    // Functions
    function openRoleChangeMenuForPlayerI(i) {
        console.log('Hiding tooltip')
        $hasSetRoleTooltip = false
        currentlySelectedRoleI = i
        isRoleChooserOpen = true
        console.log($hasSetRoleTooltip)
    }
    function changeRole(playerI, newRoleI) {
        console.log(`Player ${playerI} clicked on role ${newRoleI}`)
        const newRoleName = availableRoles[newRoleI]
        const newRole = getRole(newRoleName)
        isRoleChooserOpen = false
        console.log({newRole, state: $playersInRoom[playerI] })
        const playerState = $playersInRoom[playerI]
        const previousRole = playerState.role
        const newPlayerState = {
            ...playerState,
            name: newRole.name,
            src: newRole.src == null? `images/roles/${newRole.name}.png`: newRole.src,
            role: newRole.name
        }
        $playersInRoom[playerI] = newPlayerState
        $playersInRoom = $playersInRoom
    }


    function togglePlayerDead(i) {
        const player = $playersInRoom[i]
        player.isDead = !player.isDead
        setPlayerStateI(i, player)
    }

    function onClickOnStatusEffect(playerI, statusName) {
        console.log('Adding status ' + statusName)
        const player = $playersInRoom[playerI]
        if (player.statusEffects == null) {
            player.statusEffects = []
        }

        const hasThisStatus = player.statusEffects.find(status => status == statusName) != null
        if (hasThisStatus) {
            player.statusEffects = player.statusEffects.filter(status => status != statusName)
        } else {
            player.statusEffects.push(statusName)
        }

        setPlayerStateI(playerI, player)
    }

    function closeRoleChooserDrawerWithoutSideEffects() {
        currentlySelectedRoleI = null
        isRoleChooserOpen = false
    }

    function onClickOnSortNight() {
        // const filterExtraRequiredRolesFunc = role => role => role.category == NIGHTLY || role.category == SPECIAL_NIGHTLY
        // addMissingRequiredRoles(filterExtraRequiredRolesFunc)
        sortCurrentRolesNightly()
    }
    function onClickOnSortSetup() {
        $hasSortTooltip = false
        // const filterExtraRequiredRolesFunc = role => role => role.category == SETUP || role.category == SPECIAL_SETUP
        // addMissingRequiredRoles(filterExtraRequiredRolesFunc)
        sortCurrentRolesSetup()
    }
    function onClickOnCleanup() {
        removePlaceholderRoles()
    }
    function onClickOnAdd() {
        const name = prompt('Player name')
        const player = addPlayerAdded({}, name)
    }
    function onRemovePlayer(i) {
        const player = $playersInRoom[i]
        removePlayer(i)
    }

    function openModal(text, buttonText, callback) {
        isModalOpen = true
        modalText = text
        modalConfirmButtonText = buttonText
        modalOnConfirm = callback
    }

    async function startGame() {
        const rc = $roomCode
        await fetchGame('POST', `/api/game/${rc}/start`)
        await refresh()
    }

    async function kickPlayer(name) {
        const rc = $roomCode
        await fetchGame('DELETE', `/api/game/${rc}/player/${name}`)
        await refresh()
    }

    async function killPlayer(name) {
        console.log('Killing player')
        const rc = $roomCode
        // await fetchGame('POST', `/api/game/${rc}/player/${playerI}/dead`)
        await fetchGame('POST', `/api/game/${rc}/player/${name}/dead`)
        await refresh()
    }

    async function onUsePowerClick() {
        const myPower = $me.availableAction
        console.log({myPower})
        if (myPower == null) {
            return
        }
        switch (myPower.type) {
            case ActionTypes.CHOOSE_PLAYER:
                isActionChoosePlayerDrawerOpen = true
                return
        }
    }

    async function actionChoosePlayer(playerName) {
        const shouldHideAction =
            $me.availableAction?.clientDuration == ActionDurations.UNTIL_USED ||
            $me.availableAction?.clientDuration == ActionDurations.UNTIL_USED_OR_DAY
        if (shouldHideAction) {
            $me = {...$me, availableAction: null}
        }
        await fetchGame('POST', `/api/game/${$roomCode}/player/${playerName}/choose`)
        await refresh()
    }

</script>

<Modal isOpen={isModalOpen} setIsOpen={bool => isModalOpen = bool}>
    <div class="center-content padding-2">
        <p class="center-text">{modalText}<br/>Proceed to kill this person?</p>
        <div class="flex-row margin-top-1 gap-1">
            <button class="btn red" on:click={evt => {
                modalOnConfirm(true)
                isModalOpen = false
            }}>{modalConfirmButtonText}</button>
            <button class="btn gray" on:click={() => modalOnConfirm(false)}>Cancel</button>
        </div>
    </div>
</Modal>

<DrawerPage
    isOpen={isActionChoosePlayerDrawerOpen}
    zIndex="487 !important",
    on:click={() => isActionChoosePlayerDrawerOpen = false}
>
    <div class="margin-top-4">
        {#each ($playersInRoom ?? []) as player (player.name)}

            <div style="width: 100%" class="flex-row gap-1">
                <MinimalContact
                    name={player.name}
                    src={player.src}
                    isDead={player.isDead}
                    on:contact-click={evt => {
                        evt.stopPropagation();
                        console.log(`Clicked on ${player.name}`)
                        isActionChoosePlayerDrawerOpen = false
                        actionChoosePlayer(evt.detail)
                    }}
                ></MinimalContact>
            </div>
        {/each}
    </div>
</DrawerPage>

<DrawerPage
    isOpen={isMyInfoDrawerOpen}
    zIndex="486 !important"
    on:click={() => 
        isMyInfoDrawerOpen = false
    }
>
    {#if $me.info != null}
        <div class="center-content flex-column margin-top-2">
            <div>
                {#if $me.info.roles != null}
                    {#each $me.info.roles as roleName (roleName)}
                        <div class="center-content flex-column margin-top-1">
                            <div>
                                <RoundCardPortrait role={{...getRole(roleName), isBig: true, isValid: true}}/>
                            </div>
                            <div>
                                <h2 class="margin-top-half center-text">
                                    {@html roleName}
                                </h2>
                                {#if $me.info.showsRoleDescriptions}
                                    <p class="margin-top-half center-text padding-1">
                                        {@html getRole(roleName)?.effect}
                                    </p>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
            {#if $me.info.text != null}
                <div>
                    <p class="margin-top-2 center-text">
                        {@html $me.info.text}
                    </p>
                </div>
            {/if}
        </div>
    {/if}
</DrawerPage>

<InspectRoleDrawer
    role={getRole($me.role?.name)}
    isOpen={isMyRoleDrawerOpen}
    setIsOpen={bool => {
        isMyRoleDrawerOpen = false
    }}
/>

<RoleChooserManyDrawer
    isOpen={isRoleChooserOpen}
    roles={availableRoles.map(name => getRole(name))}
    
    sectionFilters={[_ => true]}
    sectionTitles={['Choose an avatar']}
    sectionTexts={['']}

    onClickOnRole={clickedRoleI => changeRole(currentlySelectedRoleI, clickedRoleI)}
    onClickOutside={() => closeRoleChooserDrawerWithoutSideEffects()}
></RoleChooserManyDrawer>

<div class="contact-list-header shadowed bg-white">
    <button class="btn" style="background-color: #AA88BB; position: relative;" on:click={onClickOnCleanup}>
        Cleanup
    </button>
    <button class="btn" style="background-color: #BB8844; position: relative;" on:click={onClickOnSortSetup}>
        <Tooltip isShown={shouldShowSortTooltip} top="3rem" left="calc(50% - 0.5rem)" width="40vw">Sort players for Setup for Night.</Tooltip>
        Sort for Setup
    </button>
    <button class="btn" style="background-color: #44AACC" on:click={onClickOnSortNight}>Sort for Night</button>
</div>

<div class="page" style="position: relative; background-color: {backgroundColor}">

    <ContactList className="margin-top-1">

        {#if $phase != null && $phase != GamePhases.NOT_STARTED}
            <div class="center-content center-text" style={`
                height: 15vh;
                background-color: ${
                    $phase == GamePhases.NIGHT?
                        '#4d1c8c':
                    $phase == GamePhases.DAY?
                        'white':
                    $phase == GamePhases.SETUP?
                        '#548c1c':
                    'white'
                };
                color: ${
                    $phase == GamePhases.NIGHT? 'yellow': 'black'
                }
            `}>
                <h1>{
                    $phase == GamePhases.NIGHT?
                        '🌙 ':
                    $phase == GamePhases.DAY?
                        '☀️ ':
                    ''
                }{ $phase?.toUpperCase() }</h1>
            </div>
        {/if}

        {#if nSecondsRemaining != null}
            <div style="height: 15vh" class="center-content center-text bg-white">
                <h1>{nSecondsRemaining < 0? 0: nSecondsRemaining}</h1>
            </div>
        {/if}

        {#each ($playersInRoom ?? []) as player (player.name)}

            <div style="width: 100%" class="flex-row gap-1">
                <MinimalContact
                    name={player.name}
                    src={player.src}
                    isDead={player.isDead}
                >
                    <div class="flex-content wrap margin-top-1">
                        <button class="btn red" on:click={() => killPlayer(player.name)}>
                            <img class="icon" src="/images/status/Dead.png"/> Kill
                            <!-- {$playersInRoom[i]?.isDead? 'Revive': 'Kill'} -->
                        </button>
                        <button class="btn gray" on:click={() => kickPlayer(player.name)}>Kick</button>
                    </div>
                </MinimalContact>
                {#if $me.info != null && $me.name == player.name}
                    <button class="btn blue" on:click={() => {
                        isMyInfoDrawerOpen = true
                    }}>Secret Info</button>
                {/if}
                {#if $me.availableAction != null && $me.name == player.name}
                    <button class="btn red" on:click={onUsePowerClick}>Use Power</button>
                {/if}
                {#if $me.role != null && $me.name == player.name}
                    <button class="btn colorful" on:click={() => {
                        isMyRoleDrawerOpen = true
                    }}>See Role</button>
                {/if}
            </div>

        {/each}

        {#if $me.name == gameOwnerName}
            <button class="btn blue" on:click={startGame} style="position: relative;">
                Start Game
            </button>
        {/if}

        {#if $roomCode != null}
            <div class="center-text shadowed rounded bg-white" style="padding: 1rem; border: solid #EEE 1px;">
                <h1>{$roomCode}</h1>
            </div>
        {/if}


        <h3 class="center-text margin-top-1">To restart the game, open the menu and hit Play. All players are saved.</h3>
    
    </ContactList>   
</div>