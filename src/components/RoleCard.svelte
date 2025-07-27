<style>
    .role-card {
        width: 33%;
        margin-top: 2rem;
    }
</style>

<script>
    import { createEventDispatcher } from "svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";

    export let role
    export let hasRibbon = true
    export let hasBadge = true

    const dispatch = createEventDispatcher()

</script>

<div class="role-card center-content gap-half">
    <RoundCardPortrait {hasRibbon} {hasBadge} role={role} on:click={(evt) => { evt.stopPropagation(); dispatch('role-click', evt) }}></RoundCardPortrait>
    <div class={role.isValid == false? 'title gray-text strikethrough center-text' : 'title center-text'}>{role.name}</div>
</div>