

export function randomInt(low, high){
    return Math.floor(Math.random() * (high - low + 1) + low);
}
export function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
    var c = randomInt(1, 100);
    if(c <= chance) return true;
    return false;
}
export function randomOf(...args){
    return args[randomInt(0, args.length - 1)];
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
export function test(msg, condition) {
    if (condition) {
        console.log(`✅ ${msg}`)
    } else {
        console.log(`❌ ${msg}`)
    }
}