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

    let result = null

    function print(obj) {
        console.log(obj)
        try {
            const str = JSON.stringify(obj, null, 4)
            result = str
        } catch (e) {
            console.log(e)
        }
    }

</script>

<div class="page margin-top-4">

    <button class="btn colorful" on:click={async () => {
        const response = await fetchGame('POST', '/api/game')
        $me = {...$me, privateKey: response.privateKey }
        $roomCode = response.roomCode
        print({response, me: $me, roomCode: $roomCode})
    }}>Create Game (and set private key and room code)</button>

    <button class="btn colorful" on:click={async () => {
        const roomCode = prompt('room code')
        const response = await fetchGame('GET', `/api/game/${roomCode}`)
        print(response)
    }}>Get Game (Prompt)</button>

    <button class="btn blue" on:click={async () => {
        print($me)
    }}>See $me</button>

    <button class="btn colorful" on:click={async () => {
        const response = await fetchGame('GET', `/api/game`)
        print(response)
    }}>See All Games</button>

    <button class="btn gray" on:click={async () => {
        print({GamePhases})
    }}>Check Shared Lib</button>


    <br/>
    <button class="btn red" on:click={async () => {
        fetchGame('PUT', '/api/debug')
    }}>Toggle debug mode</button>
    <button class="btn red" on:click={async () => {
        fetchGame('GET', '/api/test')
    }}>Run tests</button>

    <br/>
    <br/>
    <textarea value={result} cols="100" rows="70"></textarea>

</div>