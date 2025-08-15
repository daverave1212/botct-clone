<style>
    .round-card {
        width: 33%;
        margin-top: 2rem;
    }
</style>

<script>
    import { createEventDispatcher } from "svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";

    export let name
    export let src
    export let isValid = true
    export let hasRibbon = true
    export let hasBadge = true

    const dispatch = createEventDispatcher()

</script>

<div class="round-card center-content gap-half">
    <RoundCardPortrait {hasRibbon} {hasBadge} role={{ name, src }} on:click={(evt) => { evt.stopPropagation(); dispatch('role-click', evt) }}></RoundCardPortrait>
    <div class={isValid == false? 'title gray-text strikethrough center-text' : 'title center-text'}>{name}</div>
</div>