

export function randomInt(low, high){
    return Math.floor(Math.random() * (high - low + 1) + low);
}
export function percentChance(chance) {	/* Ex: percentChance(20) = 20% chance to return true; */
    var c = randomInt(1, 100);
    if(c <= chance) return true;
    return false;
}
export function randomOf(...args){
    return args[randomInt(0, args.length - 1)];
}
export function randomFrom(array, args) {
    const elem = array[randomInt(0, array.length - 1)];
    if (args.prefer != null && args.prefer(elem) == false) {
        const elem = array[randomInt(0, array.length - 1)]
    }
    return elem
}
export function randomizeArray(array_a){
    var iRandomize;
    for(iRandomize = 0; iRandomize < array_a.length; iRandomize++){
        var randomizeArrayIndex = randomInt(0, array_a.length - 1);
        var auxRandomize = array_a[iRandomize];
        array_a[iRandomize] = array_a[randomizeArrayIndex];
        array_a[randomizeArrayIndex] = auxRandomize;
    }
    return array_a
}


let currentTestsData = {
    name: '',
    failures: [],
    nTestsDone: 0
}
export function startTesting() {
    currentTestsData = {
        name: '',
        failures: [],
        nTestsDone: 0
    }
}
export function setCurrentTest(name) {
    console.log('')
    console.log(`🆗 Running tests for ${name}`)
    currentTestsData.name = name
}
export function test(msg, condition, failMessage=null) {
    currentTestsData.nTestsDone += 1
    if (condition) {
        console.log(`  ✅ ${msg}`)
    } else {
        const finalMessage = `  ❌ ${msg}${failMessage != null? ': ' + failMessage: ''}`
        console.log(`${finalMessage}`)
        currentTestsData.failures.push(`${currentTestsData.name}: ${finalMessage}`)
    }
}
// Fail is acceptable
export function maybeTest(msg, condition, failMessage=null) {
    currentTestsData.nTestsDone += 1
    if (condition) {
        console.log(`  ✅ ${msg}`)
    } else {
        const finalMessage = `  🔶 ${msg}${failMessage != null? ': ' + failMessage: ''}`
        console.log(finalMessage)
        currentTestsData.failures.push(`${currentTestsData.name}: ${finalMessage}`)
    }
}
export function printTestResults() {
    console.log('')
    if (currentTestsData.failures.length == 0) {
        console.log(`💚 ${currentTestsData.nTestsDone}/${currentTestsData.nTestsDone} Tests passed`)
    } else {
        console.log(`🟨 ${currentTestsData.nTestsDone - currentTestsData.failures.length}/${currentTestsData.nTestsDone} passed tests:`)
        console.log(`⭕ ${currentTestsData.failures.length} failed tests:`)
        for (const msg of currentTestsData.failures) {
            console.log(`${msg}`)
        }
    }
}