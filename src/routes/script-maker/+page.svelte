

<script>
    import InspectRoleDrawer from "../../components/InspectRoleDrawer.svelte";
    import RoleChooserManyDrawer from "../../components/RoleChooserManyDrawer.svelte";
    import RoleListWithRoles from "../../components/RoleListWithRoles.svelte";
    import { browser } from '$app/environment'
    import { difficultyNames, getAllRoleDifficulties, getRole, getRoles, getSectionFilters, MORNING_COLOR, NIGHTLY, NIGHTLY_COLOR, sortRolesNormal } from "../../lib/Database";
    import { getScriptFromURLSvelte, getUrlWithParams, showQR, stringToBase64QRCode } from "../../lib/svelteUtils";
    import { setCustomScript } from "../../stores/custom-scripts-store";
    import { page } from '$app/stores'

    const allRoles = getRoles()

    let qrCodeWrapperDiv
    let currentInspectorObject = null
    let chosenRoles = []
    let isRoleChooserOpen = false

    $:isQRButtonEnabled = chosenRoles.length > 0
    $:customScript = getScriptFromURLSvelte($page.url)
    $: {
        const { customRoleNames } = customScript
        if (customRoleNames != null) {
            chosenRoles = customRoleNames.map(name => getRole(name))
        }
    }

    function onOpenRolesButtonClick(evt) {
        isRoleChooserOpen = true
    }
    function onRoleChosen(roleI) {
        console.log(`Chose role ${roleI}`)
        chosenRoles = [...chosenRoles, allRoles[roleI]]
    }
    function removeRole(role) {
        chosenRoles = chosenRoles.filter(r => r.name != role.name)
    }
    async function saveAndGetQR() {

        const scriptName = prompt('Enter script name')

        const roleIs = chosenRoles.map(role => role.i)
        const queryParamsObj = {
            'script-name': scriptName,
            'custom-roles': roleIs
        }
        const completeUrl = getUrlWithParams('/custom-script', queryParamsObj)

        async function saveScript() {
            if (scriptName == null || scriptName.trim().length == 0) {
                alert('Cannot have an empty name for a script')
                return
            }
            setCustomScript(scriptName, roleIs)
        }
        saveScript()
        await showQR(qrCodeWrapperDiv, completeUrl)
    }

</script>

<InspectRoleDrawer isOpen={currentInspectorObject != null} role={currentInspectorObject} setIsOpen={() => currentInspectorObject = null}>
    <button class="btn red margin-top-4" on:click={() => removeRole(currentInspectorObject)}>Remove</button>
</InspectRoleDrawer>

<RoleChooserManyDrawer
    isOpen={isRoleChooserOpen}
    roles={allRoles}
    
    sectionFilters={getSectionFilters()}
    sectionTitles={getAllRoleDifficulties().map(difficulty => difficultyNames[difficulty])}
    sectionTexts={getAllRoleDifficulties().map(difficulty => '')}

    onClickOnRole={clickedRoleI => { onRoleChosen(clickedRoleI) }}
    onClickOutside={() => { isRoleChooserOpen = false }}
></RoleChooserManyDrawer>

<div class="page">

    <h1 class="center-text margin-top-4">Script Maker</h1>

    <div class="center-content margin-top-2">
        <button class="btn blue" on:click={onOpenRolesButtonClick}>Open Roles</button>
    </div>

    <RoleListWithRoles
        roles={sortRolesNormal(chosenRoles)}
        hasBadges={false}
        hasRibbons={true}
        on:role-click={evt => {
            currentInspectorObject = evt.detail.role
            console.log(evt.detail.role)
        }}
    />

    <div class="center-content margin-top-4">
        <button class="btn" style={`background-color: ${NIGHTLY_COLOR}`} on:click={saveAndGetQR} disabled={!isQRButtonEnabled}>Save & Get QR</button>
        <div key="script-maker-qr-wrapper" bind:this={qrCodeWrapperDiv}></div>
    </div>

</div>