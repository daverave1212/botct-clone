<style>
    .color-display {
        width: 100%;
        height: 5rem;
        
        display: flex;
        overflow: hidden;
        gap: 5px;
    }
    .color-display .color {
        flex: 1;
        height: 100%;
    }
</style>

<script>

    export let className
    export let style = ''
    export let onClickOnColor = function(color) {}

    const colors = ['green', 'yellow', 'red', 'purple']

</script>

<div class={`color-display ${className}`} style={`${style}`}>
    {#each colors as color (color)}
        <div class="color" style={`background-color: ${color};`} on:click={() => onClickOnColor(color)}></div>
    {/each}
</div>