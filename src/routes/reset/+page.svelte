<h2 class="margin-top-4 center-text">
    <button class="btn red" on:click={() => {
        $addedPlayers = []
        $rolesDistribution = []
        resetCustomScripts()
        setTimeout(() => {
            alert('All game data was reset.')
        }, 500)
    }}>Reset</button>
</h2>

<script>
    import { page } from '$app/stores'
    import { addedPlayers } from "../../stores/added-players-store";
    import { customScripts, resetCustomScripts } from '../../stores/custom-scripts-store';
    import { rolesDistribution } from '../../stores/roles-store';
    

</script>

