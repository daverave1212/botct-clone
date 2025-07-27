<style>
    .location-picker {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    .number {
        width: 20vw;
        height: 20vw;
        border-radius: 50%;
        
        font-size: 7vw;
        line-height: 20vw;
        text-align: center;
        font-family: BaseFont;

        -webkit-user-select: none; /* Safari */        
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+/Edge */
        user-select: none; /* Standard */
    }

    .number.active {
        background-color: #AA88BB;
        color: white;
    }
</style>

<script>

    const numbers = [1,2,3]
    
    let activeNumbers = numbers.map(num => false)

    function onClickOnNumber(number) {
        activeNumbers[number - 1] = !activeNumbers[number - 1]
        activeNumbers = activeNumbers
    }

</script>

<div class="location-picker">
    {#each numbers as number (number)}
        <div
            class={`number shadowed ${activeNumbers[number-1] ? 'active': ''}`}
            on:click={() => onClickOnNumber(number)}
        >{number}</div>
    {/each}
</div>