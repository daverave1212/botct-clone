

<script>
    import { createEventDispatcher } from 'svelte';


    import './Contact.css'

    const dispatch = createEventDispatcher()

    export let state = {}
    export let setState

    $: SUBCONTENT_CLASS = state?.isExpanded ? 'subcontent subcontent--expanded' : 'subcontent'

    function toggleContent() {
        setState({ ...state, isExpanded: !state.isExpanded })
        dispatch('expand')
    }

    function onNameClick() {
        toggleContent()
    }

    function onPortraitClick() {
        dispatch('show-portrait')
    }

</script>

{#if state != null}
<div class="contact contact--mod shadowed rounded">
    <div class="header">
        <div class="picture-wrapper rounded-left" on:click={onPortraitClick}>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src={state.name == null? 'images/user.png' : `images/roles/${state.name}.png`}
                class="center"
            />
        </div>
        <div class="right-wrapper">

            <div class="half upper-half" on:click={onNameClick}>
                <b>{state.name}</b>
            </div>

            <div class="half lower-half">
                <span class="subtitle">Mod</span>
            </div>

        </div>
    </div>
    <div class="{SUBCONTENT_CLASS}">
        <div class="subcontent-content">
            <slot></slot>
        </div>
    </div>
</div>
{:else}
    HMMMMMMM
{/if}

