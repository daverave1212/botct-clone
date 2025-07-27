<style>

</style>

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleChooserDrawer from "../../components/RoleChooserDrawer.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import RoundCardPortrait from "../../components/RoundCardPortrait.svelte";
    import { getRole, getRolesByDifficulty } from "../../lib/Database";
    import { customScripts } from "../../stores/custom-scripts-store";
    import { mods, selectedModOption } from "../../stores/mods-store";
    import { chosenScriptName, chosenScriptRoleNames } from "../../stores/scripts-store";

    let currentInspectorObject = null

</script>


<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}>
</InspectRoleDrawer>

<div class="page space-top center-text">
    <h2>Choose Script</h2>

    <div class="center-content margin-top-2 gap-half">
        {#each Object.keys($customScripts) as customScriptName}
            <button class="btn colorful margin-top-1" style="font-size: 1.25rem;" on:click={() => {
                const scriptRoles = $customScripts[customScriptName]
                
                $chosenScriptRoleNames = scriptRoles
                $chosenScriptName = customScriptName
            }}>{customScriptName}</button>
        {/each}
    </div>

    {#if $chosenScriptRoleNames != null && $chosenScriptName != null}
        <h2 class="center-text margin-top-4">{$chosenScriptName}</h2>
        <RoleListWithRoles roles={$chosenScriptRoleNames.map(name => getRole(name))}/>
    {/if}

    <br/>
    <br/>
    <br/>
    <a class="btn big {$chosenScriptName != null? 'colorful' : 'gray'}" href="/role-select" style="position: relative;">
        Next
    </a>
</div>