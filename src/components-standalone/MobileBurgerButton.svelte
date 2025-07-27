
<style>
    .burger-button {
        z-index: 99999;
    }
    @media (orientation: landscape) {
        .burger-button {
            display: none;
        }
    }

    .burger-button, .burger-button img {
        position: fixed;
        top: 1rem;
        left: 1.25rem;

        width: 3rem;
        height: 3rem;
    }

    .burger-button img {
        top: 1.25rem;
        left: 1.5rem;

        width: 2.5rem;
        height: 2.5rem;

        -webkit-filter: invert(100%); /* safari 6.0 - 9.0 */
        filter: invert(100%);
    }

    .hidden {
        display: none;
    }
</style>

<script>

    export let src
    export let isShown = true
    export let onClick

</script>

<div class="burger-button {isShown? '': 'hidden'} rounded colorful" on:click={onClick}>
    <img src={src}/>
</div>