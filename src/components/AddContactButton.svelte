
<style>
    
</style>

<script>

    export let onClick

</script>

<button class="add-contact-button shadowed rounded" on:click={onClick}>
    <slot></slot>
</button>