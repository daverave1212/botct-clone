import { getRuleByUrlParts } from "./lib/server/rules"

function getRelativeUrlParts(url) {
    const apiI = url.indexOf('api')
    let formattedUrl = url.substring(apiI)
    
    let paramsI
    if ((paramsI = formattedUrl.indexOf('&')) != -1) {
        formattedUrl = formattedUrl.substring(0, paramsI)
    }
    if (formattedUrl.endsWith('/')) {
        formattedUrl = formattedUrl.substring(0, formattedUrl.length - 1)
    }

    return formattedUrl.split('/')
}

export async function handle({ event, resolve }) {
    try {
        const { request, url } = event
        const { method } = request

        if (url.pathname.startsWith('/api') == false) {
            return resolve(event)
        }

        const urlParts = getRelativeUrlParts(request.url)    
        const rule = getRuleByUrlParts(urlParts)

        if (rule[method] == null) {
            console.warn(`Url ${url.pathname} does not have a rule.`)
            return resolve(event)
        }
    } catch (e) {
        console.error('ERROR')
        console.log(e)
    }

    return resolve(event)
}