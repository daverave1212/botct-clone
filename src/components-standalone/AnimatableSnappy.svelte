<script>
    import { onMount } from "svelte";


    let props = $props()

    let { setTriggerAnimation } = $derived(props)

    onMount(() => {
        setTriggerAnimation(triggerAnimation)
        triggerAnimation()
    })
    $effect(() => {
        setTriggerAnimation(triggerAnimation)
        triggerAnimation()
    })


    let classes = $state('')
    let innerClasses = $state('')
    function triggerAnimation() {
        classes = 'snappy-object'
        innerClasses = 'growy-object'
        setTimeout(() => {
            classes = ''
            innerClasses = ''
        }, 400)
    }

</script>

<div class={`${props.class} ${classes}`} style={`${props.style}`}>
    <div class={`${innerClasses}`}>
        <!-- {@render props.children?.()} -->
    </div>
</div>