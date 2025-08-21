import { getRoles } from "$lib/shared-lib/SharedDatabase";
import { makeTestTBGame } from "../../../lib/server/games";
import { response } from "../../../lib/server/utils";
import { printTestResults, setCurrentTest, startTesting, test } from "$lib/shared-lib/shared-utils";

const testingInjectable = {
    makeTestTBGame
}

export async function GET(evt) {
    const allRoles = getRoles()
    startTesting()
    for (const role of allRoles) {
        if (role.test != null) {
            setCurrentTest(role.name)
            try {
                role.test(testingInjectable)
            } catch (e) {
                test(`❌ Exception in tests for role ${role.name}`, false, `
                    ${e}
                `)
            }
        }
    }

    printTestResults()

    return response(null, 200)
}