<style>
    :root {
        --role-chooser-image-size: 20vw;
        --role-chooser-image-size-big: 20vh;
        --badge-size: 4.5vw;
    }
    .image-wrapper {
        width: var(--role-chooser-image-size);
        height: var(--role-chooser-image-size);
        position: relative;
    }
    .image-wrapper .content {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        position: inherit;
    }
    .image-wrapper .content.can-overflow {
        overflow: visible;
    }
    .image-wrapper.big {
        width: var(--role-chooser-image-size-big);
        height: var(--role-chooser-image-size-big);
    }
    .image-wrapper img {
        --width: calc(1 * var(--role-chooser-image-size));
        width: var(--width);
        /* margin-left: calc(-0.2 * var(--width));
        margin-top: calc(-0.05 * var(--width)); */
    }
    .image-wrapper.big img {
        --width: calc(1.5 * var(--role-chooser-image-size-big));
        margin-left: calc(-0.15 * var(--width));
    }
    .image-wrapper img.outsider {
        filter: hue-rotate(50deg);
    }
    .grayscale {
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
    }
    .ribbon {
        position: absolute;
        
        color: white;
        background-color: rgb(46, 46, 46);

        text-align: center;
        font-family: SingleDay;

        font-size: 0.85rem;
        height: 1.25rem;
        line-height: 1.25rem;
        width: calc(1.25 * var(--role-chooser-image-size));
        
        bottom: 0.6rem;
        left: calc(-0.02 * var(--role-chooser-image-size));
        transform: rotate(-15deg);
        z-index: 2;
    }
    .ribbon.evil {
        top: 0.5rem;
        left: calc(-0.25 * var(--role-chooser-image-size));
        transform: rotate(-25deg);
    }

    .badge {
        position: absolute;
        width: var(--badge-size);
        height: var(--badge-size);
        border-radius: 50%;

        color: white;
        background-color: rgb(46, 46, 46);
        transform: rotate(15deg);

        text-align: center;
        font-family: SingleDay;

        font-size: 1rem;
        line-height: var(--badge-size);

        top: calc(0.12 * var(--role-chooser-image-size));
        right: calc(-0.08 * var(--role-chooser-image-size));

        box-sizing: content-box;
        border: solid 3px white;
    }
</style>

<script>
    import { createEventDispatcher } from "svelte";
    import { EVIL_COLOR, MORNING_COLOR, NIGHTLY, NIGHTLY_COLOR, OTHER_CATEGORY, PINK_COLOR, REGULAR, SETUP, SETUP_COLOR, SPECIAL_COLOR, SPECIAL_NIGHTLY, SPECIAL_SETUP, EVILS } from "../lib/Database";

    const categoryToRibbon = {
        [REGULAR]: null,
        [SETUP]: { text: 'SETUP', color: 'rgb(90, 138, 0)' },
        [SPECIAL_SETUP]: { text: '🔇SETUP', color: 'rgb(90, 138, 0)' },
        [NIGHTLY]: { text: 'NIGHT', color: 'rgb(88, 50, 255)' },
        [SPECIAL_NIGHTLY]: { text: '🔇NIGHT', color: 'rgb(88, 50, 255)' },
        [OTHER_CATEGORY]: { text: 'OTHER', color: '#444444' }
    }

    const dispatch = createEventDispatcher();

    export let role = {}

    export let hasRibbon = true
    export let hasBadge = true
    export let canOverflow = false
    
    export let name
    export let src
    export let isBig = false

    let {
        team,
        category,
        color,
        isDemon,
        ribbonColor,
        ribbonText,
        locationWorth
    } = role

    $: _name = name ?? role.name
    $: _src = src ?? role.src
    $: _isBig = isBig ?? role.isBig
    

    $: imagePath =
        _src == 'none'?
            '/images/user.png'
        :_src != null?
        _src
        : `/images/role-thumbnails/${_name}.webp`
    $: ribbon =
        !hasRibbon? null:
        (ribbonText != null && ribbonColor != null)? { text: ribbonText, color: ribbonColor } :
        (category != null && categoryToRibbon[category] != null)? categoryToRibbon[category] :
        null
    $: badgeText =
        !hasBadge?
            null:
        role.locationWorth != null?
            (role.locationWorth > 0?
                '+X':
                '-X'):
        role.worth == null?
            null:
        role.worth <= -2?
            '-2':
        role.worth <= -1?
            '-1':
        role.worth == 0?
            '':
        role.worth >= 2?
            '+2':
        role.worth >= 1?
            '+1':
        '?'
    $:isOutsider = ribbonText == 'OUTSIDER'

    const badgeToColorMapping = {
        '-2': EVIL_COLOR,
        '-1': EVIL_COLOR,
        '': SPECIAL_COLOR,
        '+1': SETUP_COLOR,
        '+2': 'rgb(30, 120, 250)',
        '?': PINK_COLOR,
        '+X': SETUP_COLOR,
        '-X': EVIL_COLOR
    }
    const borderColor =
        color == null?
            null
        :color == 'Red'?
            'rgb(225, 0, 0)'
        :color == 'Yellow'?
            'rgb(255, 160, 0)'
        :color == 'Green'?
            'rgb(0, 190, 150)'
        :color == 'Purple'?
            'rgb(180, 65, 200)'
        :null

    const borderStyle = borderColor == null? '': `
        box-shadow: 1px 1px 7px 6px ${borderColor};
        -webkit-box-shadow: 1px 1px 7px 6px ${borderColor};
        -moz-box-shadow: 1px 1px 7px 6px ${borderColor};
    `
        
</script>

<div class="image-wrapper {_isBig? 'big': ''}" on:click={(evt) => dispatch('click', evt)}>
    <div class={`content ${canOverflow? 'can-overflow': ''}`} style={borderStyle}>
        {#if _isBig != true}
            {#if isDemon}
                <div class="ribbon evil" style={`background-color: ${EVIL_COLOR}`}>DEMON</div>
            {/if}
            {#if ribbon != null}
                <div class="ribbon" style="background-color: {ribbon.color}">
                    { ribbonText != null ? ribbonText : ribbon.text}
                </div>
            {/if}
        {/if}
        <img src={imagePath} class="{role.isValid == false? 'grayscale': isOutsider? 'outsider': ''}"/>
    </div>
    {#if badgeText != null && badgeToColorMapping[badgeText] != null}
        <div class="badge" style="background-color: {badgeToColorMapping[badgeText]}">{badgeText}</div>
    {/if}
</div>