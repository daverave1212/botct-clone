


<h2 class="margin-top-4 center-text">
    <button class="btn red" on:click={() => {
        
        if (browser) {
            localStorage.clear()
            setTimeout(() => {
                alert('All game data was reset.')
            }, 500)
        }

    }}>Reset</button>
</h2>

<script>
    import { page } from '$app/stores'
    import { addedPlayers } from "../../stores/added-players-store";
    import { rolesDistribution } from '../../stores/roles-store';
    import { browser } from '$app/environment'

</script>

