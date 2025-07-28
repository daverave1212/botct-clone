
<style>
    body {
        overflow: hidden;
    }
</style>

<script>
	import { playersInRoom, roomCode } from '../../../stores/online/local/room.js';

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
    import { isSecretBOTCT } from '../../../stores/secret-botct-store.js';    

    import '../../../components/add-contact-button.css'
    import LocationPicker from '../../../components/LocationPicker.svelte';
    import { chosenScriptRoleNames } from '../../../stores/scripts-store.js';
    import RoleChooserManyDrawer from '../../../components/RoleChooserManyDrawer.svelte';
    import InspectRoleDrawer from '../../../components/InspectRoleDrawer.svelte';
    import { getBOTCTRole } from "../../../lib/BOTCTDatabase";
    import { onDestroy, onMount } from 'svelte';
    import { fetchGame, getPlayersInRoom } from '../../../lib/online-utils.js';
    import SimpleContact from '../../../components/Contact/SimpleContact.svelte';
    import MinimalContact from '../../../components/Contact/MinimalContact.svelte';


    async function refresh() {
        const gameRoomCode = $roomCode
        if (gameRoomCode == null) {
            throw `Null roomCode for online-game.`
        }

        const pir = await getPlayersInRoom(gameRoomCode)
        if (pir == null) {
            throw `Null players in room with code: ${gameRoomCode}.`
        }

        console.log(pir)
        $playersInRoom = pir
        
    }

    let refreshIntervalId
    onMount(() => {
        refresh()
        refreshIntervalId = setInterval(async () => {
            await refresh()
        }, 3000)
    })
    onDestroy(() => {
        clearInterval(refreshIntervalId)
    })
    
    $:availableRoles = $chosenScriptRoleNames == null? []: $chosenScriptRoleNames

    $: shouldShowSortTooltip =
        $hasExpandTooltip == false &&
        $playersInRoom.filter(player => player.role == null).length == 0 &&
        $hasSortTooltip
    

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
        console.log(`Opening modal with ${roleName}`)
        if ($isSecretBOTCT) {
            currentModalObject = getBOTCTRole(roleName)
        } else {
            currentModalObject = getRole(roleName)
        }
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

    async function kickPlayer(playerI) {
        const rc = $roomCode
        await fetchGame('DELETE', `/api/game/${rc}/player/${playerI}`)
        await refresh()
    }

    async function killPlayer(playerI) {
        console.log('Killing player')
        const rc = $roomCode
        // await fetchGame('POST', `/api/game/${rc}/player/${playerI}/dead`)
        await fetchGame('POST', `/api/game/${rc}/player/${playerI}/dead`)
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
    isOpen={currentColor != null}
    zIndex="486 !important"
    on:click={() => currentColor = null}
>
    <div style={`width: 100vw; height: 100vh; background-color: ${currentColor};`}>
    </div>
</DrawerPage>

<InspectRoleDrawer
    role={currentModalObject}
    isOpen={currentModalObject != null}
    setIsOpen={bool => {
        didOpenAndCloseModalOnce = true
        closeModal()
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

<div class="contact-list-header shadowed">
    <button class="btn" style="background-color: #AA88BB; position: relative;" on:click={onClickOnCleanup}>
        Cleanup
    </button>
    <button class="btn" style="background-color: #BB8844; position: relative;" on:click={onClickOnSortSetup}>
        <Tooltip isShown={shouldShowSortTooltip} top="3rem" left="calc(50% - 0.5rem)" width="40vw">Sort players for Setup for Night.</Tooltip>
        Sort for Setup
    </button>
    <button class="btn" style="background-color: #44AACC" on:click={onClickOnSortNight}>Sort for Night</button>
</div>

<div class="page" style="position: relative;">

    <div class="center-text shadowed rounded" style="padding: 1rem; border: solid #EEE 1px;">
        <h1>{$roomCode}</h1>
    </div>

    <ContactList className="margin-top-1">

        {#each $playersInRoom.keys() as i (`${$playersInRoom[i].name}${i}`)}

            <MinimalContact
                name={$playersInRoom[i].name}
                src={$playersInRoom[i].src}
                isDead={$playersInRoom[i].isDead}
            >
                <div class="flex-content wrap margin-top-1">
                    <button class="btn red" on:click={() => killPlayer(i)}>
                        <img class="icon" src="/images/status/Dead.png"/> Kill
                        <!-- {$playersInRoom[i]?.isDead? 'Revive': 'Kill'} -->
                    </button>
                    <button class="btn gray" on:click={() => kickPlayer(i)}>Kick</button>
                </div>
            </MinimalContact>

            <!-- <Contact
                state={{...$playersInRoom[i], subtitle: $playersInRoom[i].name}}
                setState={(newState) => setPlayerStateI(i, newState)}
                on:change-role={() => openRoleChangeMenuForPlayerI(i)}
                on:show-portrait={() => openModalWithRoleName($playersInRoom[i].role)}
                on:expand={() => $hasExpandTooltip = false}
            >
                <div class="">
                    <div class="flex-content wrap">
                        <button class="btn blue" on:click={() => openRoleChangeMenuForPlayerI(i)}>Change Role</button>
                        <button class="btn red" on:click={() => {
                            const role = getRole($playersInRoom[i]?.role)
                            const deathReminder = role?.deathReminder
                            const isPlayerAlive = !$playersInRoom[i].isDead
                            const isLover = $playersInRoom[i].statusEffects?.includes('Granny')
                            const isProtected = $playersInRoom[i].statusEffects?.includes('Protected')

                            function maybeShowProtectedModal(callback) {
                                if (isPlayerAlive && isProtected) {
                                    openModal("This person is protected. Check if the protection should still apply.", "Kill!", (didKill) => {
                                        setTimeout(() => {
                                            callback(didKill)
                                        }, 100)
                                    })
                                } else {
                                    callback(true)
                                }
                            }

                            function maybeShowLoverModal(callback) {
                                if (isPlayerAlive && isLover) {
                                    openModal("If the Grandmother is still alive, you should kill the Grandmother too afterwards.", "Kill!", (didKill) => {
                                        setTimeout(() => {
                                            callback(didKill)
                                        }, 100)
                                    })
                                } else {
                                    callback(true)
                                }
                            }

                            function maybeShowDeathReminderModal(callback) {
                                if (isPlayerAlive && deathReminder != null) {
                                    openModal(deathReminder, "Kill!", (didKill) => {
                                        setTimeout(() => {
                                            callback(didKill)
                                        }, 100)
                                    })
                                } else {
                                    callback(true)
                                }
                            }

                            maybeShowProtectedModal(willContinue0 => {
                                if (!willContinue0) {
                                    return false
                                }
                                maybeShowLoverModal(willContinue1 => {
                                    if (!willContinue1) {
                                        return false
                                    }
                                    maybeShowDeathReminderModal(willContinue2 => {
                                        if (!willContinue2) {
                                            return false
                                        }
                                        togglePlayerDead(i)
                                    })
                                })
                            })

                        }}><img class="icon" src="/images/status/Dead.png"/> {$playersInRoom[i]?.isDead? 'Revive': 'Kill'}</button>
                    </div>
                    <div class="flex-content wrap margin-top-1">
                        {#each statusEffects as statusEffect}
                            <button class="btn" style="color: black;" on:click={()=>onClickOnStatusEffect(i, statusEffect)}> <img class="icon" src="/images/status/{statusEffect}.png"/> {statusEffect} </button>
                        {/each}
                    </div>
                    <div class="flex-content wrap margin-top-1">
                        <button class="btn gray" on:click={() => onRemovePlayer(i)}>Remove</button>
                    </div>
                </div>
            </Contact>
 -->


        {/each}

        <button class="add-contact-button shadowed rounded" on:click={onClickOnAdd} style="position: relative;">
            <div class="center-content flex-column center-text" style="width: 100%; height: 100%; line-height: 100%; font-size: 100%;">
                +
            </div>
        </button>


        <h3 class="center-text margin-top-1">To restart the game, open the menu and hit Play. All players are saved.</h3>
    
    </ContactList>   
</div>