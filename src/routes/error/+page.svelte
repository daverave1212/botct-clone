
<script>
    import { onMount } from "svelte";
    import { getURLParams } from "../../lib/svelteUtils";
    import { browser } from '$app/environment'

    let statusCode = '...'
    let message = '...'

    onMount(() => {
        if (!browser) {
            return
        }

        const urlParams = new URLSearchParams(window?.location?.search)
        console.log({urlParams})
        statusCode = urlParams.get('statusCode')
        message = urlParams.get('message')

    })

    if (browser) {
        console.log('Running in browser');
    }

</script>


<div class="page center-content center-text">
    <h2 class="margin-top-4">Error {statusCode}</h2>
    <p class="margin-top-2">{message}</p>
</div>