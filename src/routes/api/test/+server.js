import { getRoles } from "$lib/shared-lib/SharedDatabase";
import { makeTestGame } from "../../../lib/server/games";
import { response } from "../../../lib/server/utils";

const testingInjectable = {
    makeTestGame
}

export async function GET(evt) {
    const allRoles = getRoles()
    for (const role of allRoles) {
        if (role.test != null) {
            console.log(`🆗 Running tests for ${role.name}`)
            role.test(testingInjectable)
            console.log('')
        }
    }
    return response(null, 200)
}