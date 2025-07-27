<script>
    import { createEventDispatcher } from "svelte";
    import RoleCard from "./RoleCard.svelte";

    export let roles
    export let includeEmojis = true
    export let filter = null
    export let hasRibbons = true
    export let hasBadges = true

    $:usedRoles = roles == null? []: roles
    
    const dispatch = createEventDispatcher()

    function isRoleIFiltered(i, filters) {
        const roleName = usedRoles[i].name.toLowerCase()
        for (const f of filters) {
            if (roleName.indexOf(f.toLowerCase()) != -1) {
                return true
            }
        }
        return false
    }

    $:textFilters = filter?.split('+')?.map(f => f.trim())
    $:filteredRoleIndices = Object.keys(usedRoles).filter(i => filter == null? true: (
        isRoleIFiltered(i, textFilters)
    ))

</script>

<div class="role-list">
    {#each filteredRoleIndices as i (usedRoles[i].name + i)}
        <RoleCard hasRibbon={hasRibbons} hasBadge={hasBadges} role={usedRoles[i]} on:role-click={_ => dispatch('role-click', { role: usedRoles[i], i: i })}/>
    {/each}
</div>
