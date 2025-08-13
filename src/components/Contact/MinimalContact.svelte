<script>
	import EmojiPortrait from './../EmojiPortrait.svelte';

    import { createEventDispatcher, onMount } from 'svelte'
    import { page, navigating } from '$app/stores'
    import './Contact.css'
    import { addedPlayers } from '../../stores/added-players-store';

    const dispatch = createEventDispatcher()

    export let name
    export let src
    export let isDead
    export let emoji
    export let color
    export let roleName

    let isExpanded = false

    let _subtitleInputValue
    let domInput

    $: displayName = roleName == null? name: `${name} | ${roleName}`
    $: maybeDeadCls = isDead? 'dead': ''
    $: saturationCls = isDead? 'desaturated': ''

    $: SUBCONTENT_CLASS = isExpanded ? 'subcontent subcontent--expanded' : 'subcontent'


    function toggleContent() {
        dispatch('contact-click', name)
        isExpanded = !isExpanded
    }

</script>


<div class="contact shadowed rounded bg-white">
    <div class="header {maybeDeadCls}">
        <div class="picture-wrapper {saturationCls}" on:click={toggleContent}>
            <!-- svelte-ignore a11y-missing-attribute -->
            {#if color == null || emoji == null}
                <img
                    src={src == null? 'images/user.png' : src}
                    class="center unselectable"
                />
            {:else}
                <EmojiPortrait emoji={emoji} color={color} size="var(--contact-header-height)"/>
            {/if}
        </div>
        <div class="right-wrapper upper-half">
            <span class="subtitle unselectable" style="{isDead? 'color: rgb(228, 57, 57);': ''}" on:click={toggleContent}>{displayName}</span>
        </div>
        {#if roleName != null}
            <div class="picture-wrapper" style="margin-left: 1rem;">
                <img
                    src={`/images/role-thumbnails/${roleName}.webp`}
                    class="center unselectable"
                />
            </div>
        {/if}
    </div>
    <div class="{SUBCONTENT_CLASS}">
        <div class="subcontent-content">
            <slot></slot>
        </div>
    </div>
</div>