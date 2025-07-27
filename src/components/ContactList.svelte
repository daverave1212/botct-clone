

<style>
    .contact-list-wrapper {
        width: 100%;
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        gap: calc(var(--contact-header-height) / 4);
    }
</style>

<script>

    export let className = ''

</script>

<div class={`contact-list-wrapper ${className}`}>
    <slot/>
</div>