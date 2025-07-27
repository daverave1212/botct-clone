
// Use on: https://script.bloodontheclocktower.com/
function _scrapeRoleImages() {
    const url = 'https://script.bloodontheclocktower.com'
    const rolesOnLeft = Array.from(document.querySelectorAll('.role-list-item__icon img'))
        .map(img => img.getAttribute('src'))
        .map(src => url + src.substring(1))
    return rolesOnLeft.join('\n')
}

// Use anywhere in the browser
async function _scrapeRoleDescription(roleName) {
    const res = await fetch('https://wiki.bloodontheclocktower.com/' + roleName)
    const html = await res.text()

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const h2s = Array.from(doc.querySelectorAll('h2'))
    const h2 = h2s.find(h => h.children[0]?.innerText.trim() == 'Summary')
    
    const p = h2.nextElementSibling
    return p.innerText.replaceAll('"', '').replaceAll("'", "").replaceAll('\n', '')
}

// Copy the roles.json and give it as parameter string to this function
async function getRolesWithEffects(roles) {
    for (const role of roles) {
        const { name } = role
        try {
            const effect = await _scrapeRoleDescription(name)
            role.effect = effect
        } catch (e) {
            console.error(`Error at role ${name}`)
            console.log(e)
        }
    }

    console.log('done')

    return JSON.stringify(roles)
}