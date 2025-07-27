
<div class="contact shadowed rounded {state.hasSpaceUnderneath? 'has-space-underneath': ''}">
    {#if state != null}
        <div class="header {state.isDead? 'dead': ''}">
            <div class="picture-wrapper" on:click={onPortraitClick}>
                <!-- svelte-ignore a11y-missing-attribute -->
                <img
                    class="center"
                    src={state.src == null? 'images/user.png' : state.src}
                />
            </div>
            <div class="right-wrapper">

                <div class="half upper-half" on:click={onNameClick}>
                    {#if state.role == null}
                        <b>Click to set role!</b>
                    {:else}
                        <b>{state.name == null || state.name.length == 0? 'Unknown' : state.name}</b>
                    {/if}
                </div>

                <div class="half lower-half">
                    <span class="subtitle">{state.subtitle}</span>
                </div>

                {#if state.statusEffects != null}
                    <div class="badges">
                        {#each state.statusEffects as status}
                            <img src="images/status/{status}.png"/>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
        <div class="{SUBCONTENT_CLASS}">
            <div class="subcontent-content">
                <slot></slot>
            </div>
        </div>
    {/if}
</div>


<script>

    import { createEventDispatcher, onMount } from 'svelte'
    import './Contact.css'

    const dispatch = createEventDispatcher()

    export let state
    export let setState

    let _subtitleInputValue
    let domInput

    $: SUBCONTENT_CLASS = state.isExpanded ? 'subcontent subcontent--expanded' : 'subcontent'
    
    $: {
        
    }

    onMount(() => {
        setTimeout(() => {
            if (domInput != null) {
                domInput.focus()
            }
        }, 100)
    })



    function toggleContent() {
        setState({ ...state, isExpanded: !state.isExpanded })
        dispatch('expand')
    }

    function onNameClick() {
        if (state.role == null) {
            dispatch('change-role')
            return
        }
        toggleContent()
    }

    function onPortraitClick() {
        if (state.role == null) {
            dispatch('change-role')
            return
        }
        dispatch('show-portrait')
    }



</script>