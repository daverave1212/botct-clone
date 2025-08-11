
<style>

</style>

<script>

    export let emoji = '❓'
    export let color = 'tan'
    export let size = '64px'

</script>

<div style={`
    background-color: ${color};
    width: ${size};
    height: ${size};

    line-height: ${size};
    font-size: calc(${size} / 1.75);
    text-align: center;
`}>
    {emoji}
</div>