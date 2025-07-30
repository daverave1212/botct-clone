<script>

    import { createEventDispatcher, onMount } from 'svelte'
    import { page, navigating } from '$app/stores'
    import './Contact.css'
    import { addedPlayers } from '../../stores/added-players-store';

    const dispatch = createEventDispatcher()

    export let name
    export let src
    export let isDead

    let isExpanded = false

    let _subtitleInputValue
    let domInput

    $: SUBCONTENT_CLASS = isExpanded ? 'subcontent subcontent--expanded' : 'subcontent'


    function toggleContent() {
        dispatch('contact-click', name)
        isExpanded = !isExpanded
    }

</script>


<div class="contact shadowed rounded bg-white">
    <div class="header {isDead? 'dead': ''}">
        <div class="picture-wrapper" on:click={toggleContent}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src={src == null? 'images/user.png' : src}
                class="center"
            />
        </div>
        <div class="right-wrapper upper-half">
            <span class="subtitle" on:click={toggleContent}>{name}</span>
        </div>
    </div>
    <div class="{SUBCONTENT_CLASS}">
        <div class="subcontent-content">
            <slot></slot>
        </div>
    </div>
</div>