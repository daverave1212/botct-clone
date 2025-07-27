<style>
    :root {
        --tooltip-arrow-side-length: 16px;
    }
    .tooltip {
        position: absolute;

        z-index: 99999;
    }
    .tooltip.hidden {
        display: none;
    }
    .tooltip .arrow {
        z-index: 99997;
        position: absolute;
        width: var(--tooltip-arrow-side-length);
        height: var(--tooltip-arrow-side-length);
        background-color: #333;
        transform: rotate(45deg);
    }
    .tooltip .content {
        position: relative;
        z-index: 99998;

        background-color: #333;
        color: #EEE;
        font-size: 1rem;
        padding: 1rem;
        border-radius: 0.75rem;
    }
</style>

<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";


    export let isShown
    export let top
    export let left
    export let width
    export let hasArrow = true
    export let isLefty = false

    $: tooltipLeftNormal = `calc(${left} - ${width} / 2)`
    $: tooltipLeftLefty = `calc(${left} - 2rem)`
    $: tooltipLeft = isLefty? tooltipLeftLefty : tooltipLeftNormal
    

    $: arrowLeftNormal = `calc(${width} / 2)`
    $: arrowLeftLefty = `calc(2rem)`
    $: arrowLeft = isLefty? arrowLeftLefty: arrowLeftNormal
    
    
    $: arrowTop = `calc(-16px / 2 + 1px)`


    let willAnimate = false
    onMount(() => {
        willAnimate = true
    })


</script>

{#if isShown && willAnimate}
    <div in:fly={{y: -15, delay: 1000}} out:fly={{y: -15}} class="tooltip" style="left: {tooltipLeft}; top: {top}; width: {width};">
        <div class="content">
            <slot></slot>
        </div>
        {#if hasArrow}
            <!-- <div class="arrow" style="left: {arrowLeft}; top: 0;"></div> -->
            <div class="arrow" style="left: {arrowLeft}; top: {arrowTop};"></div>
        {/if}
    </div>
{/if}