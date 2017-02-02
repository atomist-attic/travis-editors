/*
 * Copyright © 2017 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Executor } from "@atomist/rug/operations/Executor"
import { Services, Service } from "@atomist/rug/model/Core"
import { Result, Status, Parameter } from "@atomist/rug/operations/RugOperation"

interface Parameters { }

export let updateTravisMavenBuild: Executor = {
    name: "UpdateTravisMavenBuild",
    description: "Update the Travis Maven build files",
    tags: ["travis-ci", "continuous-integration", "maven"],
    parameters: [],
    execute(services: Services, p: Parameters): Result {
        for (let s of services.services()) {
            s.editWith("UpdateTravisMaven", {});
        }
        return new Result(Status.Success, "OK")
    }
}
