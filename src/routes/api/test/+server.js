import { getRoles } from "../../../lib/server/ServerDatabase";
import { response } from "../../../lib/server/utils";



export async function GET(evt) {
    const allRoles = getRoles()
    for (const role of allRoles) {
        if (role.test != null) {
            console.log(`> Running tests for ${role.name}`)
            role.test()
            console.log('')
        }
    }
    return response(null, 200)
}