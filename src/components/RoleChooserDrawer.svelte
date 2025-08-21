
<style>
    :root {
        --role-chooser-image-size: 20vw;
    }

</style>

<script>
    import { fly } from "svelte/transition";
    import DrawerPage from "../components-standalone/DrawerPage.svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";
    import { randomInt } from "../lib/utils";
    import RoleCard from "./RoleCard.svelte";
    import RoleList from "./RoleList.svelte";

    export let roleStates
    export let isOpen
    export let onClickOnRole
    export let onClickOutside

    $:rolesInGame = roleStates
        .keys()
        .filter(i => roleStates[i].isInGame != false)
        .map(i => roleStates[i])
    $:rolesNotInGame = roleStates
        .keys()
        .filter(i => roleStates[i].isInGame == false)
        .map(i => roleStates[i])

    function onPortraitClick(i) {
        if (roleStates[i].isValid == false) {
            return
        }
        onClickOnRole(i)
    }
</script>

<DrawerPage isOpen={isOpen} on:click={evt => onClickOutside()}>
    <!-- <div class="center-content center-text padded">
        
        <h2>Roles in this game</h2>
        <br>
        <p>These are all the roles automatically selected to be in this game.</p>
    </div> -->

    <br>
    <slot name="top"></slot>


    <RoleList>
        {#each roleStates.keys() as i (roleStates[i].name + i)}
            {#if roleStates[i].isInGame != false}
                <RoleCard role={roleStates[i]} on:role-click={(evt) => onPortraitClick(i)}/>
            {/if}
        {/each}
    </RoleList>

    <slot name="middle"></slot>

    <!--  -->

    <RoleList>
        {#each roleStates.keys() as i (roleStates[i].name + i)}
            {#if roleStates[i].isInGame == false}
                <RoleCard role={roleStates[i]} on:role-click={(evt) => onPortraitClick(i)}/>
            {/if}
        {/each}
    </RoleList>
    

    <slot name="bottom"></slot>
</DrawerPage>