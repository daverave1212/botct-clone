
<style>
.grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px 16px; /* row gap, column gap */
  align-items: center;
}
</style>

<script>
    import SafeButton from "../../../components-standalone/SafeButton.svelte";
import { fetchGame } from "../../../lib/online-utils";
    import { customScripts } from "../../../stores/custom-scripts-store";
    import { me } from "../../../stores/online/local/me";
    import { roomCode } from "../../../stores/online/local/room";

    let selectedScriptName = null
    
    let pregameDuration = 10
    let nightDuration = 45

    async function onCreateGame() {
        if (selectedScriptName == null) {
            return
        }
        const scriptRoleNames = getCustomScriptRoleNames(selectedScriptName)

        const response = await fetchGame('POST', '/api/game', { scriptRoleNames, scriptName: selectedScriptName, me: $me, pregameDuration, nightDuration })

        // privateKey is the same for the owner and the game
        $me = {...$me, privateKey: response.privateKey }
        $roomCode = response.roomCode
        setTimeout(() => {
            goto('/online/online-game')
        }, 250)
    }

</script>

<div class="page center-text flex-column gap-1">

    <h2 class="margin-top-4">Create Game</h2>
    
    <div class="grid margin-top-2">
        <label>Pregame Duration</label>
        <input type="range" bind:value={pregameDuration} min="10" max="120" step="5" />
        <span class="value" aria-hidden="true">{pregameDuration}</span>
        <label>Night Duration</label>
        <input type="range" bind:value={nightDuration} min="10" max="120" step="5" />
        <span class="value" aria-hidden="true">{nightDuration}</span>
    </div>


    <h3 class="margin-top-2">Select Script</h3>
    <div class="flex wrap gap-1 padding-1">
        {#each Object.keys($customScripts) as scriptName (scriptName)}
            {@const btnColor = selectedScriptName == scriptName? 'colorful': 'blue'}
            <button class="btn {btnColor}" on:click={() => {
                selectedScriptName = scriptName
            }}>{scriptName}</button>
        {/each}
    </div>

    <SafeButton on:click={onCreateGame} timeout={3000} class="btn big colorful margin-top-4">Create Room</SafeButton>

</div>