
<script>
	import Loading from './Loading.svelte';
    import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher()

    export let timeout = 100

    let isAvailable = true



    function onClick(evt) {
        if (!isAvailable) {
            return
        }
        isAvailable = false
        dispatch('click', evt)
        setTimeout(() => {
            isAvailable = true
        }, timeout)
    }

</script>

<button on:click={onClick} class={$$props.class} style={$$props.style}>
    {#if isAvailable}
        <slot></slot>
    {:else}
        <Loading width={'2rem'}/>
    {/if}
</button>