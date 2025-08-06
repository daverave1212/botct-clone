
<!-- 
    let animateTo = $state()

    onMount(() => {
        animateTo(2000, { rotate: -20, scale: 2, x: 50, y: 0 })
    })

    <Animatable class="floater" setAnimateFunction={func => animateTo = func} from={{ rotate: 45, scale: 1, x: -100, y: 200 }}>
        ...
    </Animatable>

-->

<style>
    .animatable {
        overflow: visible;
    }
</style>

<script>
    import { onMount } from "svelte";
    import { animateTransformTo, createAnimation, createKeyframes, generateUniqueId, prepareTransformFrom } from "../lib/utils"

    let props = $props()
    let { id, style, from, setAnimateFunction, children } = $derived(props)
    let className = $derived('animatable ' + props.class)
    const uniqueId = generateUniqueId('Animatable')



    onMount(() => {
        console.log('Setting animation state')
        setAnimateFunction(function(milliseconds, to) {
            console.log(`Received animate args: ${milliseconds}`)
            console.log({to})
            animateTransformTo(uniqueId, milliseconds, to)
        })
    })

</script>

<div {...prepareTransformFrom(uniqueId, className, style, from)}>
    {@render children()}
</div>