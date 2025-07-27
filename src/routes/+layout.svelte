<script>
    import { SaraProvider } from "saraui";
    import "../app.css";
    import '../utils.css'
    import '../card-png.css'
    import { navigating } from '$app/stores'
    import Nav from "../components-standalone/Nav.svelte";
    import MobileBurgerButton from "../components-standalone/MobileBurgerButton.svelte";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { addedPlayers } from "../stores/added-players-store";

    let isBurgerOpen = false

    navigating.subscribe(nav => {
        // console.log(`Navigating. Added players:`)
        // console.log($addedPlayers)
    })


    // Required for transition animations between pages
    export let data
    $: {
        // console.log(`Data changed.`)
        // console.log({data})
    }
</script>



<Nav
    options={[
        { name: 'Play', href:"/"},
        { name: 'All Roles', href:"/all-roles"},
        { name: 'Script Maker', href:"/script-maker"},
        { name: 'Scripts', href:"/custom-script"},
        { name: 'Reset App', href:"/reset"}
    ]}
    isBurgerOpen={isBurgerOpen} setIsBurgerOpen={bool => isBurgerOpen = bool}
>
    <MobileBurgerButton src="/images/burger.svg" onClick={() => isBurgerOpen = true}></MobileBurgerButton>
</Nav>

{#key data.url}
    <div in:fly={{x: 200, duration: 300, delay: 300}} out:fly={{x: -200, duration: 300}}>
        <slot></slot>
    </div>
{/key}
