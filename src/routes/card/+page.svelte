<style>

    canvas {
        width: 100%;
    }

    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid var(--menu-selected-color);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 

</style>


<script>
    import { onMount } from "svelte";
    import { clearCanvas, clearRect, drawImageOnCanvasAsync, drawText, drawTextLines, drawTextWordsWithHTML } from "../../lib/utils";
    import RoleChooserDrawer from "../../components/RoleChooserDrawer.svelte";
    import { EVIL_COLOR, getEvent, getLocationCards, getNormalRolePriority, getRole, getRoles, getSortRolesWithPriorityFunction, SPECIAL_COLOR, WEREWOLVES } from "../../lib/Database";
    import { getMods } from "../../lib/ModsDatabase";

    const cardWidth = 756
    const cardHeight = 1093

    const allRoles = getSortRolesWithPriorityFunction(getRoles(), getNormalRolePriority)
    const allMods = getMods()
    const allEvents = getLocationCards()

    let canvasDiv
    let cardCanvas
    let roleChooserObjects = allRoles
    let isRoleChooserOpen = false
    let objectBeingDrawn

    $: if (cardCanvas != null && objectBeingDrawn != null) {
        draw(objectBeingDrawn, cardCanvas, 0, 0)
    }

    async function draw(objectBeingDrawn, canvas, x, y) {
        console.log(`Drawing object:`)
        console.log({objectBeingDrawn})
        clearRect(canvas, x, y, cardWidth, cardHeight)
        await drawImageOnCanvasAsync(canvas, `/images/roles/${objectBeingDrawn.name}.png`, x, y, cardWidth, cardWidth)
        if (objectBeingDrawn.isLocationCard) {
            await drawImageOnCanvasAsync(canvas, `/images/card-templating/CardTemplate_${objectBeingDrawn.color}.png`, x, y)
        } else {
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/CardTemplate.png', x, y)
        }
        drawText({
            canvas,
            font: '64px Aladin',
            x: x + cardWidth / 2,
            y: y + cardHeight * 0.695,
            text: objectBeingDrawn.name,
            textAlign: 'center'
        })

        const hasNotes = objectBeingDrawn.notes != null
        const effectY = hasNotes? cardHeight * 0.8225 : cardHeight * 0.85
        drawTextWordsWithHTML({
            canvas,
            font: '40px SingleDay',
            x: x + cardWidth / 2,
            y: y + effectY,
            width: cardWidth * 0.75,
            lineHeight: objectBeingDrawn.lineHeight == null ? 40 : objectBeingDrawn.lineHeight,
            text: objectBeingDrawn.effect,
            textAlign: 'center'
        })
        
        const brownTextColor = 'rgb(113, 108, 95)'
        if (hasNotes) {
            const notesY = cardHeight * 0.92
            drawTextWordsWithHTML({
                canvas,
                font: '33px SingleDay',
                x: x + cardWidth / 2,
                y: y + notesY,
                width: cardWidth * 0.8,
                lineHeight: 22,
                text: objectBeingDrawn.notes,
                textAlign: 'center',
                color: brownTextColor
            })
        }
        if (objectBeingDrawn.team == WEREWOLVES) {
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/Evil Badge.png', x + cardWidth - 196 - 20, y + 0 + 20)
        }
        if (objectBeingDrawn.isMod) {
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/Mod Badge.png', x + cardWidth - 196 - 20, y + 0 + 20)
        }
        if (objectBeingDrawn.isLocationCard) {
            await drawImageOnCanvasAsync(canvas, `/images/card-templating/LC Badge ${objectBeingDrawn.color}.png`, x + cardWidth - 196 - 20, y + 0 + 20)
        }
        if (objectBeingDrawn.type != null) {
            const tribeBadgeHeight = 66
            const tribeY = cardHeight - tribeBadgeHeight - 12
            await drawImageOnCanvasAsync(canvas, '/images/card-templating/Tribe Badge.png', x + cardWidth / 2 - 258/2, y + tribeY)        
            drawText({
                canvas,
                font: '40px SingleDay',
                x: x + cardWidth / 2,
                y: y + tribeY + tribeBadgeHeight / 2 + 40 / 4,
                text: objectBeingDrawn.type,
                color: brownTextColor,
                textAlign: 'center'
            })
        }
    }

    const __DEBUG__ROLES = [
        'Cultist', 'Cultist',
        'Ghoul', 'Ghoul',
        'Vampire',
        'Strigoy', 'Strigoy',
        'Nosferatu', 'Nosferatu',

        'Builder',
        'Town Guard',
        'Fortune Teller',
        'Scout',
        'Seer',
        'Great Grandfather',
        'Bombmaker',
        
        'Inspector', 'Joe',

        'Blacksmith',
        'Mayor',
        'Grandma',

        'Priest',

        'Politician',
        
        'Gravedigger',
        
        'Fool',
        'Bartender',

        'Werewolf',
        'Mime',

        'Fallen Angel',

        'Goblins'
    ]
    const __allRolesAndMods = [
        ...__DEBUG__ROLES.map(roleName => getRole(roleName)),
        getEvent("Stakes and Crosses"),
        getEvent("Omen"),
        getEvent("Ambush"),
        ...getLocationCards()
    ]

    let isLoading = false
    async function generatePrints() {

        async function go() {
            const paperWidth = 2480
            const paperHeight = 3508
            let allRolesAndMods = [
                getRole('Strigoy'),
                getRole('Strigoy'),
                getRole('Strigoy'),
                getRole('Cultist'),
                getRole('Cultist'),
                getRole('Cultist'),
                getRole('Peasant'),
                getRole('Peasant'),
                getRole('Peasant'),
                getRole('Peasant'),
                getRole('Peasant'),
                ...getRoles().filter(role => role.name != 'Peasant' && role.name != 'Strigoy' && role.name != 'Cultist'),
                // ...getMods(),
                ...getLocationCards()
            ]
            allRolesAndMods = __allRolesAndMods // TODO: REMOVE THIS
            
            async function draw9CardsOnNewCanvas(cards) {
                const canvas = document.createElement('canvas')
                canvas.width = paperWidth
                canvas.height = paperHeight
                canvas.style = "width: 100%"
                canvasDiv.appendChild(canvas)

                const startX = (paperWidth - 3 * cardWidth) / 2
                const startY = (paperHeight - 3 * cardHeight) / 2
                for (let i = 0; i < Math.min(cards.length, 9); i++) {
                    const drawX = startX + cardWidth * (i % 3)
                    const drawY = startY + cardHeight * Math.floor(i / 3)
                    await draw(cards[i], canvas, drawX, drawY)
                }
            }

            while (allRolesAndMods.length > 0) {
                const first9Cards = allRolesAndMods.splice(0, 9)
                await draw9CardsOnNewCanvas(first9Cards)
            }
        }

        isLoading = true
        await go()
        isLoading = false


    }

</script>

<h1 class="center-text margin-top-4">Print</h1>
<p class="center-text margin-top-2">To get all A4 sheets for printing, hit Generate Prints.</p>
<p class="center-text">This will create in the page all the A4 print sheets, which you can download as PNG images and print. Each image is 2480x3508px in size, so this may take a while, depending on your computer.</p>
<div class="flex-content padded center">
    <button class="btn colorful" on:click={() => { roleChooserObjects = allMods; isRoleChooserOpen = true}}>Open Mods</button>
    <button class="btn blue" on:click={() => { roleChooserObjects = allRoles; isRoleChooserOpen = true }}>Open Roles</button>
    <button class="btn" style={`background-color: ${SPECIAL_COLOR};`} on:click={() => { roleChooserObjects = allEvents; isRoleChooserOpen = true }}>Open Events</button>
</div>
<div class="flex-content center">
    <button class="btn colorful" on:click={() => generatePrints()}>Generate Prints</button>
</div>

{#if isLoading}
    <div class="flex-content center margin-top-2">
        <span class="loader"></span>
    </div>
{/if}

<RoleChooserDrawer
    roleStates={roleChooserObjects}
    isOpen={isRoleChooserOpen}
    onClickOnRole={i => {
        objectBeingDrawn = roleChooserObjects[i]
        isRoleChooserOpen = false
    }}
    onClickOutside={() => {
        isRoleChooserOpen = false
    }}
/>

<div bind:this={canvasDiv}>

</div>

<canvas width={cardWidth} height={cardHeight} bind:this={cardCanvas}>

</canvas>

<p style="font-family: Aladin; color: white">Hello.</p>
<p style="font-family: SingleDay; color: white">Hello.</p>