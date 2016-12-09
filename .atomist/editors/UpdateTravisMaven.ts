/*
 * Copyright © 2016 Atomist
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

import { ParameterlessProjectEditor } from '@atomist/rug/operations/ProjectEditor'
import { Project } from '@atomist/rug/model/Core'
import { editor, tag } from '@atomist/rug/support/Metadata'
import { Result, Status } from '@atomist/rug/operations/Result'

@editor("Update the Travis Maven build files")
@tag("travis-ci")
@tag("continous-integration")
@tag("maven")
class UpdateTravisMaven extends ParameterlessProjectEditor {

    editWithoutParameters(project: Project): Result {
        if (project.fileExists("pom.xml")) {
            project.deleteFile(".settings.xml");
            project.copyEditorBackingFileOrFail(".atomist/templates/settings.xml", ".settings.xml");
            project.deleteFile("travis-build.bash");
            project.copyEditorBackingFileOrFail(".atomist/templates/travis-build-mvn.bash", "travis-build.bash");
            return new Result(Status.Success, "Update Travis Maven build files")
        } else {
            return new Result(Status.NoChange, "Not a Maven build")
        }
    }
}
