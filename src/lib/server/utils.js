import { getGame } from "./games"


export function response(data, status) {
    return new Response(JSON.stringify(data), { status })
}

export function getRequestUser(request) {
    const headers = request.headers

    const name = headers.get('name')
    const src = headers.get('src')
    const privateKey = headers.get('privateKey')

    return { name, src, privateKey }
}

export function isAuthorizedForGame(request, roomCode) {
    const user = getRequestUser(request)
    const game = getGame(roomCode)
    console.log(`Found user ${user?.name} pk=${user.privateKey} and game ${game?.roomCode} from ${roomCode} pk=${game?.privateKey}`)
    if (user == null || game == null) {
        return false
    }
    console.log(`Checking PK and name:`)
    if (user.privateKey == game.privateKey && user.name == game.ownerName) {
        return true
    }
    console.log(`Hmm....`)
    return false
}

export function createRandomCode(length=3) {
    const chars = '0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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

export function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
    var c = randomInt(1, 100);
    if(c <= chance) return true;
    return false;
}
export function randomInt(low, high){
    return Math.floor(Math.random() * (high - low + 1) + low);
}
export function randomOf(...args){
    return args[randomInt(0, args.length - 1)];
}

export function test(msg, condition) {
    if (condition) {
        console.log(`✅ ${msg}`)
    } else {
        console.log(`❌ ${msg}`)
    }
}
export function swapElementsAt(arr, i1, i2) {
    if (i1 < 0 || i2 < 0 || i1 >= arr.length || i2 >= arr.length) {
        return false
    }
    const temp = arr[i1]
    arr[i1] = arr[i2]
    arr[i2] = temp
    return true
}
export function popArrayElementFind(arr, findFunc) {
    const index = arr.findIndex(findFunc)
    if (index == -1) {
        return null
    }
    const elem = arr[index]
    arr.splice(index, 1)
    return elem
}
export function repeat(times, func) {
    for (let i = 0; i < times; i++) {
        func(i)
    }
}