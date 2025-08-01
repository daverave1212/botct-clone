<style>
    .toaster {
        --width: min(400px, 70vw);
        --left: calc((100vw - var(--width)) / 2);
        --color: red;

        position: absolute;

        width: var(--width);
        left: var(--left);

        padding: 1.5rem;

        z-index: 704;

        transition: 0.75s;
    }
    .toaster.outside-screen {
        margin-top: -200px;
    }
    .toaster.on-screen {
        margin-top: 25px;
    }
</style>

<script>
    import { onMount } from "svelte";


    export let style
    export let setShowToaster
    let type
    let text

    let state = 'outside' || 'preparing' || 'moving'

    $: extraClass = 
        state == 'outside'? 'outside-screen'
        :state == 'preparing'? 'outside-screen has-transition'
        :state == 'moving'? 'on-screen has-transition'
        :'outside-screen'
    $: realType = type == null? 'info': type.toLowerCase()
    $: borderColor = {
        'info': 'rgb(179, 217, 237)',
        'warning': '#5089B4',
        'error': '#DBB2B0',
        'success': '#CFE4C7',
    }[realType]
    $: backgroundColor = {
        'info': '#CDE8F5',
        'warning': '#F8F3D6',
        'error': '#ECC8C5',
        'success': '#DEF2D6',
    }[realType]
    $: textColor = {
        'info': '#5089B4',
        'warning': '#926C2C',
        'error': '#B83D3B',
        'success': '#596F51',
    }[realType]
    $: realExternalStyle = style == null? '': style


    let timeRemaining = 0
    onMount(() => {

        setShowToaster(showToaster)

        setInterval(() => {
            if (timeRemaining <= 0) {
                state = 'outside-screen'
            } else {
                if (state == 'outside-screen') {
                    state = 'preparing'
                } else if (state == 'preparing') {
                    state = 'moving'
                }
            }
            timeRemaining -= 100
        }, 100)
    })

    function showToaster(_type, _text) {
        timeRemaining = 4000
        type = _type
        text = _text
    }

</script>

<div class="toaster rounded center-text shadowed {extraClass}" style={realExternalStyle + `
    border: solid ${borderColor} 1px;
    color: ${textColor};
    background-color: ${backgroundColor};
`}>
    {text}
</div>