<style>
    .side-menu {
        --width: 100%;
    }
    .side-menu-wrapper {
        position: fixed;
        top: 0;
        left: 0;

        z-index: 484 !important;
        overflow-x: hidden;
        overflow-y: scroll;

        width: 0vw;
        height: 100vh;

        box-shadow: rgba(149, 157, 165, 0.2) 0px 2px 8px;
    }
    .side-menu-wrapper--open {
        width: 100vw;
    }

    .side-menu-black-overlay {
        height: 100vh;
        width: 100%;

        background-color: black;

        z-index: 99991;
        opacity: 0;
        transition: 0.5s;
    }
    .side-menu-black-overlay--open {
        opacity: 0.5;
    }

    .side-menu {
        position: absolute;

        width: var(--width);
        min-height: 100vh;

        top: 0;
        left: calc(-1 * var(--width));
        
        z-index: 484 !important;

        transition: 0.5s;
        
        background-color: white;

        padding-bottom: 10vh;
    }

    .side-menu--open {
        left: 0vw !important;
    }
    
</style>

<script>
    import { createEventDispatcher } from "svelte";


    export let isOpen
    export let zIndex
    
    let state = 'CLOSED'
    
    $: {
        if (isOpen) {
            state = 'OPEN'
        } else {
            state = 'CLOSING'
            setTimeout(() => {
                state = 'CLOSED'
            }, 500)
        }
    }

    $: sideMenuWrapperClass =
        state == 'OPEN' ? 'side-menu-wrapper side-menu-wrapper--open' :
        state == 'CLOSING' ? 'side-menu-wrapper side-menu-wrapper--open' :
        'side-menu-wrapper'
    $: blackOverlayClass =
        state == 'OPEN' ? 'side-menu-black-overlay side-menu-black-overlay--open' :
        'side-menu-black-overlay'
    $: sideMenuClass = 
        state == 'OPEN' ? 'side-menu side-menu--open': 
        'side-menu'

    $: style = zIndex == null? '' : `z-index: ${zIndex}`

    const dispatch = createEventDispatcher()

</script>

<!-- svelte-ignore missing-declaration -->
<div class="{sideMenuWrapperClass}" style={style}>
    <div class="{blackOverlayClass}"></div>
    <div class="{sideMenuClass}" on:click={evt => {evt.stopPropagation(); dispatch('click')}}>
        <slot></slot>
    </div>
</div>