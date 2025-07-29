
<style>

    :root {
        --approximate-hero-height: calc(
            20vh +
            3vh +
            1.5rem +
            2vh +
            3rem
        )
    }
    .index {
        text-align: center;
    }
    .index p {
        color: #222;
        line-height: 1.5rem;
    }
    .portrait-wrapper {
        margin-bottom: 4vh;
    }
    .space-bottom {
        margin-bottom: 3vh;
    }

    .hero {
        padding-top: calc((100vh - var(--approximate-hero-height)) / 3.5);
    }

</style>

<script>
    
    import { onMount } from "svelte";
    import RoundCardPortrait from "../components/RoundCardPortrait.svelte";
    import '../utils.css'
    import { fade, fly } from 'svelte/transition'
    import { page, navigating } from '$app/stores'

    let willAnimate = false
    onMount(() => {
        willAnimate = true
    })


</script>

<div class="page index">

    <div class="hero">
        {#if willAnimate}
            <div class="center-content portrait-wrapper" in:fly={{y: -100, delay: 50 }}>
                <RoundCardPortrait role={{ src: '/images/BOTCT.avif', isBig: true, isValid: true}} canOverflow={true}/>
            </div>
            <h2 class="space-bottom">Play Blood (Clone)</h2>
            <p class="space-bottom">The free online app for organizing a game of Strigoy, for 8 to 20 players. Print and cut the free Strigoy cards at <a>this link</a> and play!</p>
            <div class="flex-content center">
                <a in:fly={{y: 100, delay: 100 }} class="btn big colorful" href="/add-players">Offline Game</a>
                <a in:fly={{y: 100, delay: 150 }} class="btn big colorful" href="/online/play-online">Play Online!</a>
            </div>
        {/if}
    </div>

</div>