<style>
    .loader {
        aspect-ratio: 1;
        border-radius: 50%;
        border: 5px solid;
        border-color: #ffffff #ffffff00;
        animation: l1 1s infinite;
    }
    @keyframes l1 {to{transform: rotate(.5turn)}}
</style>

<script>

    export let width = '50px'

    $: widthValue =
        width.endsWith('px') || width.endsWith('rem') || width.endsWith('em')?
            width:
        (width + 'px')

</script>

<div class="loader" style="width: {widthValue};"></div>