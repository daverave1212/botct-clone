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
export function baseStrToNumber(binaryStr, base) {
    return parseInt(binaryStr, base)
}
export function numberToBaseStr(number, base) {
    return number.toString(base)
}




export function sum(arr) {
    return arr.reduce((partialSum, a) => partialSum + a, 0)
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
export function popArrayElementAt(arr, index) {
    const elem = arr[index]
    arr.splice(index, 1)
    return elem
}
export function popArrayElementFind(arr, findFunc) {
    const index = arr.findIndex(findFunc)
    const elem = arr[index]
    arr.splice(index, 1)
    return elem
}
export function times(n, func) {
    for (let i = 0; i < n; i++) {
        func(i)
    }
}
export function arrayFindIndexLowest(arr, getValue) {
    if (arr.length == 0) return null
    let lowestSoFar = getValue(arr[0])
    let lowestIndex = 0
    for (let i = 0; i < arr.length; i++) {
        if (getValue(arr[i]) < lowestSoFar) {
            lowestSoFar = getValue(arr[i])
            lowestIndex = i
        }
    }
    return lowestIndex
}
export function arrayFindIndexHighest(arr, getValue) {
    if (arr.length == 0) return null
    let highestSoFar = getValue(arr[0])
    let highestIndex = 0
    for (let i = 0; i < arr.length; i++) {
        if (getValue(arr[i]) > highestSoFar) {
            highestSoFar = getValue(arr[i])
            highestIndex = i
        }
    }
    return highestIndex
}
export function arrayFindLowest(arr, getValue) {
    const index = arrayFindIndexLowest(arr, getValue)
    return arr[index]
}
export function arrayFindHighest(arr, getValue) {
    const index = arrayFindIndexHighest(arr, getValue)
    return arr[index]
}

export function notNullOr(obj, or) {
    if (obj == null)
        return or
    return obj
}

let ctxSettings = {}
function saveCtxSettings(ctx) {
    ctxSettings.textAlign = ctx.textAlign
    ctxSettings.font = ctx.font
    ctxSettings.fillStyle = ctx.fillStyle
}
function loadCtxSettings(ctx) {
    for (const key of Object.keys(ctxSettings)) {
        ctx[key] = ctxSettings[key]
    }
}
export function groupArrayBy(arr, splitBySelector) {
    const objects = {}
    for (const elem of arr) {
        const elemValue = splitBySelector(elem)
        if (objects[elemValue] == null) {
            objects[elemValue] = []
        }
        objects[elemValue].push(elem)
    }
    return objects
}

export function drawImageOnCanvasAsync(canvas, pathOrImage, x, y, width, height, alpha) {
    const ctx = canvas.getContext('2d')
    let image
    if (typeof pathOrImage === 'string' || pathOrImage instanceof String) {
        image = new Image()
        image.src = pathOrImage
    } else {
        image = pathOrImage
    }
    return new Promise((res, rej) => {
        image.onload = function() {
            saveCtxSettings(ctx)
            if (alpha != null) {
                ctx.globalAlpha = alpha
            }
            if (width != null && height == null) {
                ctx.drawImage(image, x, y, width)
            } else if (width != null && height != null) {
                ctx.drawImage(image, x, y, width, height)
            } else {
                ctx.drawImage(image, x, y)
            }
            loadCtxSettings(ctx)
            res()
        }
    })
}
export function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.reset()
}
export function clearRect(canvas, x, y, width, height) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(x, y, width, height)
}
export function drawText({canvas, font, x, y, text, textAlign='left', color}) {
    const ctx = canvas.getContext('2d')
    ctx.save()
    // saveCtxSettings(ctx)
    if (color != null) {
        ctx.fillStyle = color
    }
    ctx.textAlign = textAlign
    ctx.font = font
    ctx.fillText(text, x, y)
    // loadCtxSettings(ctx)
    ctx.restore()
}

export function drawTextLines({canvas, font, x, y, width, text, lineHeight, textAlign='center', color}) {
    const ctx = canvas.getContext('2d')
    ctx.font = font
    const lines = getLines(ctx, text, width)
    const totalHeight = lines.length * lineHeight
    const startY = y - totalHeight / 2
    for (let i = 0; i < lines.length; i++) {
        const textLine = lines[i]
        const thisY = startY + i * lineHeight
        drawText({canvas, font, x, y: thisY, text: textLine, textAlign, color})
    }
}

export async function drawTextWordsWithHTML({
    canvas,
    font,
    x,
    y,
    width,
    
    text,

    lineHeight,
    textAlign = 'center',
    color,

    isCenteredY = true,
    strokeColor,
    strokeSize,

    isDebug = false
}) {
    const ctx = canvas.getContext('2d')
    saveCtxSettings(ctx, 'drawTextLines')
    ctx.font = font

    const openSymbol = '<'
    const closeSymbol = '>'

    const wordsWithPos = await getWordsToDrawXML({
        ctx,
        text,
        maxWidth: width,
        lineHeight,
        openSymbol,
        closeSymbol
    })

    console.log({wordsWithPos})

    function normalizeXForTextAlign() {
        if (textAlign == 'left') {
            return
        }

        let textHeight = 0
        function normalizeAlignCenterForY(y) {
            const wordsOnLine = wordsWithPos.filter(word => word.y == y)
            const nSpaces = wordsOnLine.length - 1
            const spaceWidth = nSpaces * getTextWidth(font, ' ')
            const wordsWidth = wordsOnLine.map(word => word.width).reduce((iter, e) => iter + e, 0)
            const lineWidth = spaceWidth + wordsWidth
            const padding = (width - lineWidth) / 2
            for (const word of wordsOnLine) {
                word.x = word.x - lineWidth / 2
            }
            textHeight += lineHeight
        }

        for (let i = 1; i < wordsWithPos.length; i++) {
            const word = wordsWithPos[i]
            const prevWord = wordsWithPos[i - 1]
            if (prevWord.y != word.y) {
                normalizeAlignCenterForY(prevWord.y)
            }
        }

        const lastWord = wordsWithPos[wordsWithPos.length - 1]
        normalizeAlignCenterForY(lastWord.y)

        if (isCenteredY) {
            for (const word of wordsWithPos) {
                word.y -= textHeight / 2
            }
        }
    }

    normalizeXForTextAlign()

    for (let i = 0; i < wordsWithPos.length; i++) {
        const word = wordsWithPos[i]
        const drawX = x + word.x
        const drawY = y + word.y

        const drawTextParms = {
            canvas,
            font,
            x: drawX,
            y: drawY,
            text: word.word,
            color,
            strokeColor,
            strokeSize
        }

        if (isXML(word.word)) {
            const xml = word.word
            
            if (xml.tagName == 'img') {
                const imagePath = xml.getAttribute('src')    
                await drawImageOnCanvasAsync(canvas, imagePath, drawX, drawY - lineHeight + lineHeight / 4, word.width, lineHeight, 1)
                continue
            }
            let drawParams = {
                ...drawTextParms,
                text: xml.innerHTML,
                color: xml.getAttribute('color') ?? color,
                font: xml.getAttribute('font') ?? font
            }
            if (xml.tagName == 'b') {
                drawParams.font = 'bold ' + font
            }
            if (xml.tagName == 'i') {
                drawParams.font = 'italic ' + font
            }
            drawText(drawParams)
            continue
        }

        

        drawText(drawTextParms)
    }

    if (isDebug) {
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        const fullHeight = wordsWithPos[wordsWithPos.length - 1].y - wordsWithPos[0].y
        console.log({wordsWithPos, width, fullHeight})
        ctx.rect(x + wordsWithPos[0].x, y + wordsWithPos[0].y, width, fullHeight);
        ctx.fill();
    }

    loadCtxSettings(ctx, 'drawTextLines')
    return wordsWithPos
}

function isXML(obj) {
    return typeof(obj) == 'object'
}
export function xmlToJson(str) {
    let xmlNode = new DOMParser().parseFromString(str, 'text/xml')
    return xmlNode.children[0]
}


function splitTextBySymbols(text, openSymbol, closeSymbol) {
    const letters = text.split('')

    let state = 'reading-text'
    let currentTextPart = ''
    let textParts = []
    for (let i = 0; i < letters.length; i++) {
        const char = letters[i]

        switch (state) {
            case 'reading-text':
                if (char != openSymbol) {
                    currentTextPart += char
                }
                if (char == openSymbol) {
                    if (currentTextPart.length > 0) {
                        textParts = [...textParts, currentTextPart]
                    }
                    currentTextPart = char
                    state = 'reading-symbol'
                }
                break
            case 'reading-symbol':
                currentTextPart += char
                if (char == closeSymbol) {
                    textParts = [...textParts, currentTextPart]
                    currentTextPart = ''
                    state = 'reading-text'
                }
                break
        }
    }

    if (currentTextPart.length > 0) {
        textParts = [...textParts, currentTextPart]
    }

    return textParts
}

export function splitTextByXML(text) {
    const formattedText = '<xml>' + text + '</xml>'
    const xml = xmlToJson(formattedText)
    const children = Array.from(xml.childNodes)
    return children.map(node => node.nodeName == '#text' ? node.nodeValue : node)
}
export function splitTextByXMLV2(text) {
    let textParts = []
    for (let i = 0; i < text.length; i++) {
        const char = text.charAt(i)
    }
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

async function getWordsToDrawXML({
    ctx,
    text,
    maxWidth,
    lineHeight
}) {
    const textParts = splitTextByXML(text)
    console.log({textParts})
    const words = textParts
        .map(part => isXML(part) ? part : part.trim().split(' '))
        .reduce((arr, elem) => Array.isArray(elem) ? [...arr, ...elem] : [...arr, elem], []) // Flatten array
    console.log({words})
    const imageWidth = lineHeight
    const spaceWidth = ctx.measureText(' ').width

    let y = 0
    let x = 0
    let wordsToDraw = [] // { x: number, y: number, word: string, width: number }

    for (var i = 0; i < words.length; i++) {
        let word = words[i]
        
        let wordWidth = 0
        if (word.tagName == 'br') {
            x = 0
            y += lineHeight
            continue
        } else if (word.tagName == 'img') {
            wordWidth = imageWidth
        } else if (word.tagName != null && word.innerHTML) {
            const font = word.getAttribute('font')
            if (font != null) {
                const backupFont = ctx.font
                ctx.font = font
                wordWidth = ctx.measureText(word.innerHTML).width
                ctx.font = backupFont
            } else {
                wordWidth = ctx.measureText(word.innerHTML).width
            }
        } else {
            wordWidth = ctx.measureText(word).width
        }
        if (x + wordWidth >= maxWidth) {
            x = 0
            y += lineHeight
        }

        wordsToDraw = [...wordsToDraw, {
            x: x,
            y: y,
            word: word,
            width: wordWidth,
            spaceWidth
        }]

        x = x + spaceWidth + wordWidth
    }

    return wordsToDraw
}


export function isNumber(val) {
    return typeof val === 'number'
}
export function isNumberOrStringNumber(val) {
    return isNumber(val) || parseFloat(val) == val
}

export function getTextWidth(font, text) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = font
    const width = ctx.measureText(text).width
    return width
}
export function getOnlyKey(obj) {
    return Object.keys(obj)[0]
}

export async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    }, () => {})
}

export function executeBoolCallbackArray(_callbacks, finallyCallback) {
    const callbacks = [..._callbacks]
    function callNextCallback(shouldContinue=true) {
        if (callbacks.length == 0 || shouldContinue == false) {
            finallyCallback()
            return
        }
        const nextCallback = callbacks.shift()
        nextCallback((willContinue) => {
            callNextCallback(willContinue)
        })
    }
    callNextCallback(true)
}