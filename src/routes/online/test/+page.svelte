<style>
    button {
        margin-top: 0.75rem;
        margin-right: 0.75rem;
    }
</style>

<script>
	import { GamePhases } from '$lib/shared-lib/GamePhases.js';
    import { fetchGame } from '../../../lib/online-utils.js';
    import { me } from '../../../stores/online/local/me.js';
    import { roomCode } from '../../../stores/online/local/room.js';

</script>

<div class="page margin-top-4">

    <button class="btn colorful" on:click={async () => {
        const response = await fetchGame('POST', '/api/game')
        $me = {...$me, privateKey: response.privateKey }
        $roomCode = response.roomCode
        console.log({response, me: $me, roomCode: $roomCode})
    }}>Create Game (and set private key and room code)</button>

    <button class="btn colorful" on:click={async () => {
        const roomCode = prompt('room code')
        const response = await fetchGame('GET', `/api/game/${roomCode}`)
        console.log(response)
    }}>Get Game (Prompt)</button>

    <button class="btn colorful" on:click={async () => {
        const response = await fetchGame('GET', `/api/game`)
        console.log(response)
    }}>See All Games</button>

    <button class="btn gray" on:click={async () => {
        console.log({GamePhases})
    }}>Check Shared Lib</button>

</div>