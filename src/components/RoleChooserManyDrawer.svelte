
<style>
    :root {
        --role-chooser-image-size: 20vw;
    }
    .role-chooser-content {
        width: 100%;
        
        padding-left: 3vw;
        padding-left: 3vw;
        padding-top: 2vh;
        padding-bottom: 2vh;

        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
        grid-row-gap: 6vw;
    }
    .role-box {
        /* width: var(--role-chooser-image-size); */
    }
    .gray-text {
        color: gray;
    }
    .role-box .title {
        padding-top: calc(0.1 * var(--role-chooser-image-size));
        text-align: center;
    }

</style>

<script>
    import { fly } from "svelte/transition";
    import DrawerPage from "../components-standalone/DrawerPage.svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";
    import { randomInt } from "../lib/utils";
    import RoleCard from "./RoleCard.svelte";
    import RoleList from "./RoleList.svelte";

    export let roles
    export let sectionFilters   // Array<i -> boolean>
    export let sectionTitles    // Array<str>
    export let sectionTexts     // Array<str>

    export let isOpen
    export let onClickOnRole
    export let onClickOutside

    $: {
        console.log({roles})
    }

    function onPortraitClick(i) {
        if (roles[i].isValid == false) {
            return
        }
        onClickOnRole(i)
    }
</script>

<DrawerPage isOpen={isOpen} on:click={evt => onClickOutside()}>
    <br>

    {#each sectionFilters as sectionFilter, i ('Section' + i)}
        <div class="center-content center-text padded">
            <h2>{sectionTitles[i]}</h2>
            <br>
            <p>{sectionTexts[i]}</p>
            <RoleList>
                {#each roles as role, j ('Section' + i + role.name + j)}
                    {#if sectionFilter(j)}
                        <RoleCard role={role} on:role-click={(evt) => onPortraitClick(j)}/>
                    {/if}
                {/each}
            </RoleList>
        </div>
    {/each}

</DrawerPage>