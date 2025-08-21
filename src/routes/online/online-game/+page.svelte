
<style>
    body {
        overflow: hidden;
    }

    .gap-auto {
        gap: 2vw;
    }

    .me-button {
        display: block;
        width: 100%;
        z-index: -1230132;
        height: 5vh;
        margin-top: 0.5rem;
    }
    
</style>

<script>
	import { InfoTypes } from '$lib/shared-lib/GamePhases.js';
	import { phase, playersInRoom, roomCode, scriptName, scriptRoleNames } from '../../../stores/online/local/room.js';
    import { GamePhases, ActionDurations, ActionTypes } from '$lib/shared-lib/GamePhases.js'
    import { tips } from '../../../lib/Tips.js'
    import { browser } from '$app/environment'
    import { afterNavigate } from '$app/navigation'

    import Contact from "../../../components/Contact/Contact.svelte";
    import ContactList from "../../../components/ContactList.svelte";
    import DrawerPage from "../../../components-standalone/DrawerPage.svelte";
    import { getRole, getRoles } from "$lib/shared-lib/SharedDatabase";
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
    import { swapElementsAt } from '../../../lib/utils.js';
    import Toaster from '../../../components-standalone/Toaster.svelte';
    import { getCustomScriptRoleNames } from '../../../stores/custom-scripts-store.js';
    import { randomOf } from '../../../lib/utils.js';


    let gameOwnerName = null

    let countdownStart = null
    let countdownDuration = null
    let nSecondsRemaining = null

    let currentlyDisplayedInfo = null
    let isMyInfoRolesDrawerOpen = false
    let isActionChoosePlayerDrawerOpen = false
    let isAllRolesDrawerOpen = false
    let roleBeingInspected = null

    let winner = null

    let lastNotificationText = null

    let availableTip = null

    let _nFetchRetries = 0  // Prevent spam in the console and server. Stop at 3

    $: didEvilsWin = winner != null && winner.toLowerCase().startsWith('evil')
    $: didTownsfolkWin = winner != null && !didEvilsWin
    $: amIAdmin = $me.name == gameOwnerName

    let showToaster = () => {}

    function closeAllDrawers() {
        currentlyDisplayedInfo = null
        isActionChoosePlayerDrawerOpen = false
        isAllRolesDrawerOpen = false
        roleBeingInspected = null
    }

    async function fetchOnlineGame(method, url, data) {
        const result = await fetchGame(method, url, data)
        if (result.status != 200) {
            console.log({result})
            console.error(`Error ${result.status}: Failed to ${method} resource ${url}`)
            showToaster('error', `Error ${result.status}: Failed to ${method} resource ${url}`)
        }
        return result
    }
    async function refresh() {
        function isRetryLimitExceeded() { return _nFetchRetries >= 3}
        async function fetchThisGame() {
            try {
                const game = await fetchOnlineGame('GET', `/api/game/${get(roomCode)}`)
                console.log({game})
                return game
            } catch (e) {
                _nFetchRetries += 1
                console.error(e)
                return null
            }
        }
        function updateCountdownIfAny(game) {
            if (game.countdownStart != null) {
                countdownStart = game.countdownStart
                countdownDuration = game.countdownDuration
            } else {
                countdownStart = null
                countdownDuration = null
                nSecondsRemaining = null
            }
        }
        function didPhaseChange(game) { return game.phase != $phase }

        if (isRetryLimitExceeded())
            return

        const game = await fetchThisGame()

        if (game == null) {
            return
        }

        if (didPhaseChange(game)) {
            closeAllDrawers()

            if (game.phase == GamePhases.NIGHT || game.phase == GamePhases.COUNTDOWN) {
                availableTip = randomOf(...tips)
            } else {
                availableTip = null
            }
        }

        if (game.winner != null) {
            console.log(`☑️ Winner not null! Setting winner to: ${game.winner}`)
            winner = game.winner
        }

        if (game.lastNotification?.text != lastNotificationText && game.lastNotification != null) {
            lastNotificationText = game.lastNotification.text
            showToaster('info', game.lastNotification.text)
        }

        gameOwnerName = game.ownerName
        $playersInRoom = game.playersInRoom
        $phase = game.phase
        $scriptRoleNames = game.scriptRoleNames

        const newMe = game?.playersInRoom?.find(p => p.name == $me.name)
        if (newMe) {
            $me = newMe
        }

        updateCountdownIfAny(game)
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
    
    $: availableRoles = $chosenScriptRoleNames == null? []: $chosenScriptRoleNames
    $: myTrueRole = $me.secretRole ?? $me.role
    $: backgroundColor = $phase == 'night'? '#18172e': 'white'

    $: if (winner) {
        console.log(`❌ winner changed to ${winner}`)
    }

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

    function openModal(text, buttonText, callback) {
        isModalOpen = true
        modalText = text
        modalConfirmButtonText = buttonText
        modalOnConfirm = callback
    }

    async function startGame() {
        const rc = $roomCode
        await fetchOnlineGame('POST', `/api/game/${rc}/start`)
        await refresh()
    }

    async function endDay() {
        await fetchOnlineGame('POST', `/api/game/${$roomCode}/end-day`)
        await refresh()
    }

    async function kickPlayer(name) {
        const rc = $roomCode
        await fetchOnlineGame('DELETE', `/api/game/${rc}/player/${name}`)
        await refresh()
    }

    async function killPlayer(name) {
        console.log('Killing player')
        await fetchOnlineGame('POST', `/api/game/${$roomCode}/player/${name}/dead`)
        await refresh()
    }
    async function movePlayer(name, upOrDown) {
        await fetchOnlineGame('POST', `/api/game/${$roomCode}/player/${name}/move/${upOrDown}`)
        const playerI = $playersInRoom.findIndex(p => p.name == name)
        const otherPlayerI = upOrDown == 'up'? playerI - 1: (playerI + 1)
        const newPlayersInRoom = [...$playersInRoom]
        swapElementsAt(newPlayersInRoom, playerI, otherPlayerI)
        $playersInRoom = newPlayersInRoom
    }

    function openMyInfoDrawerWithInfo(info) {
        currentlyDisplayedInfo = info
    }

    async function onUsePowerClick() {
        const myPower = $me.availableAction
        console.log({myPower})
        if (myPower == null) {
            return
        }
        $me = {...$me, availableAction: null}
        switch (myPower.type) {
            case ActionTypes.CHOOSE_PLAYER:
                isActionChoosePlayerDrawerOpen = true
                return
            case ActionTypes.JUST_CLICK:
                action()
        }
    }

    

    async function actionChoosePlayer(playerName) {
        await fetchOnlineGame('POST', `/api/game/${$roomCode}/player/${$me.name}/action/${playerName}`)
        await refresh()
    }
    async function action() {
        await fetchOnlineGame('POST', `/api/game/${$roomCode}/player/${$me.name}/action/${me.name}`)
    }

    function seeTip() {
        console.log({availableTip})
        currentlyDisplayedInfo = availableTip
    }

</script>

<Toaster setShowToaster={func => showToaster = func}/>

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
    isOpen={winner != null}
    zIndex="488 !important",
    on:click={() => {}}
>
    <div class="margin-top-4 padding-2 center-text">
        {#if didEvilsWin}
            {#if myTrueRole?.isEvil}
                <h1>Town Subdued!</h1>
            {:else}
                <h1>Game Over</h1>
            {/if}
            <h2 class="margin-top-2" style="color: red;">Evils win!</h2>
        {/if}
        {#if didTownsfolkWin}
            {#if myTrueRole?.isEvil}
                <h1>Game Over</h1>
            {:else}
                <h1>Demon killed!</h1>
            {/if}
            <h2 class="margin-top-2" style="color: rgb(52, 138, 250);">Townsfolk win!</h2>
        {/if}
    </div>
</DrawerPage>

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
                    emoji={player.emoji}
                    color={player.color}
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

<!-- Players with roles INFO -->
<DrawerPage
    isOpen={currentlyDisplayedInfo?.type == InfoTypes.PLAYERS_WITH_ROLES}
    zIndex="487 !important"
    on:click={() => {
        currentlyDisplayedInfo = null
    }}
>
    {#if currentlyDisplayedInfo?.playersWithRoles != null}
        <ContactList className="margin-top-2">
            {#each (currentlyDisplayedInfo.playersWithRoles ?? []) as player (player.name)}
                <div style="width: 100%" class="flex-row gap-1">
                    <MinimalContact
                        name={player.name}
                        emoji={$playersInRoom.find(p => p.name == player.name)?.emoji}
                        color={$playersInRoom.find(p => p.name == player.name)?.color}
                        roleName={player.roleName}
                        isDead={player.isDead}
                        on:contact-click={name => {
                            currentlyDisplayedInfo = null
                        }}
                    />
                </div>
            {/each}
        </ContactList>
    {/if}

</DrawerPage>

<!-- ROLES info -->
<DrawerPage
    isOpen={currentlyDisplayedInfo?.type == InfoTypes.ROLES || (currentlyDisplayedInfo != null && currentlyDisplayedInfo.type == null)}
    zIndex="486 !important"
    on:click={() => 
        currentlyDisplayedInfo = null
    }
>
    {#if currentlyDisplayedInfo != null}
        {@const nRoles = currentlyDisplayedInfo.roles?.filter(rn => rn != null).length}
        <div class="center-content flex-column margin-top-2">
            {#if nRoles == null || nRoles <= 1}
                <div class="margin-top-4"></div>
            {/if}
            <div>
                {#if currentlyDisplayedInfo.roles != null}
                    {#each currentlyDisplayedInfo.roles.filter(rn => rn != null) as roleName (roleName)}
                        <div class="center-content flex-column margin-top-1">
                            <div>
                                <RoundCardPortrait role={{...getRole(roleName), isBig: true, isValid: true}}/>
                            </div>
                            <div>
                                <h2 class="margin-top-half center-text padding-1">
                                    {@html roleName}
                                </h2>
                                {#if currentlyDisplayedInfo.showsRoleDescriptions}
                                    <p class="margin-top-half center-text padding-1">
                                        {@html getRole(roleName)?.effect}
                                    </p>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
            {#if currentlyDisplayedInfo.text != null}
                <div>
                    <p class="margin-top-2 center-text padding-1">
                        {@html currentlyDisplayedInfo.text}
                    </p>
                </div>
            {/if}
        </div>
    {/if}
</DrawerPage>

<InspectRoleDrawer
    role={roleBeingInspected}
    isOpen={roleBeingInspected != null}
    setIsOpen={bool => {
        closeAllDrawers()
    }}
/>

<RoleChooserManyDrawer
    isOpen={isAllRolesDrawerOpen}
    roles={getCustomScriptRoleNames($scriptName).map(rn => getRole(rn))}
    
    sectionFilters={[_ => true]}
    sectionTitles={['All Roles in This Game']}
    sectionTexts={['']}

    onClickOnRoleName={clickedRoleName => {
        isAllRolesDrawerOpen = false
        roleBeingInspected = getRole(clickedRoleName)
    }}
    onClickOutside={() => {
        isAllRolesDrawerOpen = false
    }}
></RoleChooserManyDrawer>

<div class="contact-list-header shadowed bg-white">
    <button class="btn" style="background-color: #22BBDD" on:click={() => {
        isAllRolesDrawerOpen = true
    }}>See All Roles</button>
</div>

<div class="page" style="position: relative; transition: background-color 0.75s ease; background-color: {backgroundColor}">

    <ContactList className="margin-top-1">

        {#if $phase != null && $phase != GamePhases.NOT_STARTED}
            <div class="center-content center-text rounded" style={`
                transition: background-color 0.75s ease;
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
                    $phase == GamePhases.COUNTDOWN?
                        '⌛ '
                    :''
                }{ $phase?.toUpperCase() }</h1>
                {#if nSecondsRemaining != null}
                    <h3>{nSecondsRemaining < 0? 0: nSecondsRemaining}</h3>
                {/if}
            </div>
        {/if}

        {#if availableTip != null}
            <button class="btn glow-blink" style="background-color: #44AAAA; --blink-color: #44AAAA" on:click={seeTip}>See Tip!</button>
        {/if}

        {#each ($playersInRoom ?? []) as player (player.name)}
            <div style="width: 100%" class="flex-column gap-auto">
                <MinimalContact
                    name={player.name}
                    emoji={player.emoji}
                    color={player.color}
                    isDead={player.isDead}
                >
                    {#if amIAdmin}
                        <div class="flex-content wrap margin-top-1">
                            <div class="flex-row gap-1">
                                <button class="btn blue" on:click={() => movePlayer(player.name, 'up')}>Move Up</button>
                                <button class="btn blue" on:click={() => movePlayer(player.name, 'down')}>Move Down</button>
                            </div>
                            <div class="flex-row gap-1">
                                <button class="btn red" on:click={() => killPlayer(player.name)}>
                                    <img class="icon" src="/images/status/Dead.png"/> Execute
                                    <!-- {$playersInRoom[i]?.isDead? 'Revive': 'Kill'} -->
                                </button>
                                <button class="btn gray" on:click={() => kickPlayer(player.name)}>Kick</button>
                            </div>
                        </div>
                    {/if}
                </MinimalContact>
                {#if $me.info != null && $me.name == player.name}
                    {@const text = $me.info.buttonText ?? 'Secret Info'}
                    {@const color = $me.info.buttonColor ?? 'var(--blue-color)'}
                    <button class="me-button btn glow-blink" style="--blink-color: {color}; background-color: {color};" on:click={() => {
                        openMyInfoDrawerWithInfo($me.info)
                    }}>
                        { text }
                    </button>
                {/if}
                {#if $me.availableAction != null && $me.name == player.name}
                    {@const text = $me.availableAction.buttonText ?? 'Use Power!'}
                    <button class="me-button btn red glow-blink" on:click={onUsePowerClick}>
                        { text }
                    </button>
                {/if}
                {#if $me.role != null && $me.name == player.name}
                    <button class="me-button btn colorful" on:click={() => {
                        
                        if ($me.hasOnlySecretRolePowers) {
                            roleBeingInspected = myTrueRole
                        } else {
                            roleBeingInspected = $me.role
                        }
                    
                    }}>
                        See Role
                    </button>
                {/if}
            </div>

        {/each}

        {#if amIAdmin}
            <button class="btn blue" on:click={startGame} style="position: relative;">
                Start Game
            </button>
            <button class="btn colorful" on:click={endDay} style="position: relative;">
                End Day
            </button>
        {/if}

        {#if $roomCode != null}
            <div class="center-text shadowed rounded bg-white" style="padding: 1rem; border: solid #EEE 1px;">
                <h1>{$roomCode}</h1>
            </div>
        {/if}

        <!-- <button class="btn colorful" on:click={() => {
            showToaster('success', 'This is a little error')
        }} style="position: relative;">
            Test Toaster
        </button> -->

    
    </ContactList>   
</div>