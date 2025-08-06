
<style>

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleCard from "../../components/RoleCard.svelte";
    import RoleList from "../../components/RoleList.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import { ADVANCED, TROUBLE_BREWING, BAD_MOON_RISING, difficultyDescriptions, difficultyNames, getAllRoleDifficulties, getDifficultyByFirstLetter, getFirstLetterOfDifficulty, getLocationCards, getNormalRolePriority, getRoles, getRolesByDifficulty, getRolesForDifficulty, getSortRolesWithPriorityFunction, MORNING_COLOR, NIGHTLY_COLOR } from "$lib/shared-lib/SharedDatabase";
    import { getMods } from "../../lib/ModsDatabase";
    import { browser } from '$app/environment'

    let currentInspectorObject = null
    let filterValue = ''
    let isShowingSettings = false

    $:queryParams = browser? new URLSearchParams(window.location.search): null
    $:rolesJsonFromUrl = queryParams?.get('custom-roles')
    $:rolesFromUrl = rolesJsonFromUrl == null? null: JSON.parse(rolesJsonFromUrl)
    $: {
        console.log({queryParams, rolesJsonFromUrl, rolesFromUrl})
    }


    function onClickOnRole(obj) {
        currentInspectorObject = obj
    }

    function getSortedRolesForDifficulty(difficulty) {
        return getSortRolesWithPriorityFunction(getRolesForDifficulty(difficulty), getNormalRolePriority)
    }

    function sortRoles(roles) {
        // +2    +1 no ribbon     +1 reminder   +1 night    0 night     0 other ribbons     0 no ribbon     negative ribbon
        const LOWEST = -1000
        const VERY_LOW = -100
        const LOW = -10
        const NORMAL = 10
        const HIGH = 100
        const VERY_HIGH = 1000
        const HIGHEST = 10000
        function getRoleSortValue(role) {
            const roleBaseValue =
                role.name == 'Peasant'?
                    LOWEST
                :role.locationWorth < 0?
                    VERY_LOW
                :role.locationWorth > 0?
                    HIGHEST
                :role.worth > 0?
                    role.worth * VERY_HIGH
                :role.worth == 0? (
                    role.ribbonColor != null?
                        HIGH
                    :NORMAL
                )
                :LOW
            const roleSecondaryValue =
                role.ribbonColor == null?
                    9
                :role.ribbonColor == MORNING_COLOR?
                    8
                :role.ribbonColor == NIGHTLY_COLOR?
                    7
                :6

            return roleBaseValue + roleSecondaryValue
        }

        let sortedRoles = [...roles]
        sortedRoles.sort((a, b) => getRoleSortValue(b) - getRoleSortValue(a))
        sortedRoles = sortedRoles.map(role => ({...role, roleValue: getRoleSortValue(role)}))
        console.log({sortedRoles})
        return sortedRoles
    }

    function getSortedRolesInDifficulty(difficulty) {
        const rolesInDifficulty = getRoles().filter(role => role.difficulty == difficulty)
        return sortRoles(rolesInDifficulty)
    }

</script>

<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}/>

<div class="page">

    <h2 class="center-text margin-top-4">Roles & Mods</h2>
    <p class="margin-top-2 center-text">Here you can find all roles and mods for the game.</p>
    <p class="center-text">Green SETUP ribbons indicate roles that wake up on game setup, while purple NIGHT ribbons indicate roles that wake up at night.</p>

    <h3 class="center-text margin-top-4">Filters</h3>
    <input class="search-input" bind:value={filterValue} placeholder="Filter..."/>
    
    <div class="center-content flex-row">
        <button class="btn blue" on:click={() => {
            isShowingSettings = !isShowingSettings
        }}>{ isShowingSettings? 'Hide Settings': 'Show Settings'}</button>
    </div>

    {#if isShowingSettings}

    {/if}

    {#each getAllRoleDifficulties() as difficulty, i (difficulty)}
        <h3 class="center-text margin-top-2">{difficultyNames[difficulty]}</h3>
        <p class="center-text margin-top-1">{difficultyDescriptions[difficulty]}</p>
        <RoleListWithRoles
            roles={getSortedRolesInDifficulty(difficulty)}
            hasBadges={false}
            hasRibbons={true}
            filter={filterValue}
            on:role-click={evt => currentInspectorObject = evt.detail.role}
        />
    {/each}


</div>