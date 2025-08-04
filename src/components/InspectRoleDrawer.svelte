
<style>

    .inspector {
        text-align: center;
    }
    .inspector p {
        color: #222;
        line-height: 1.5rem;
    }

</style>

<script>
    import DrawerPage from "../components-standalone/DrawerPage.svelte";
    import RoundCardPortrait from "./RoundCardPortrait.svelte";

    export let isOpen
    export let setIsOpen
    export let role

    $: {
        if (role != null) {
            console.log('Opening!!!')
        }
    }

</script>

<DrawerPage
    isOpen={isOpen}
    zIndex="485 !important"
    on:click={(evt) => {
        evt.stopPropagation()
        setIsOpen(false)
    }}
>
    <div class="padded inspector">
        {#if role != null}
            <div class="center-content" style="margin-top: 12vh;">
                <RoundCardPortrait role={{...role, isBig: true, isValid: true}}/>
            </div>
            <h2 class="margin-top-2">
                {@html role.name}
            </h2>
            <p class="margin-top-1">
                {@html role.effect}
            </p>
            {#if role.notes != null && role.notes.length > 0}
                <p class="margin-top-2" style="color: gray"><i>
                    {@html role.notes}
                </i></p>
            {/if}
            {#if role.narratorNotes != null && role.narratorNotes.length > 0}
                <p class="margin-top-2" style="color: blue"><b>Tips for narrator</b>: {role.narratorNotes}</p>
            {/if}
        {/if}

        <slot></slot>
    </div>
</DrawerPage>