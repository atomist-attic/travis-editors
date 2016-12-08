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

import { ProjectEditor } from "@atomist/rug/operations/ProjectEditor"
import { Parameters, ParametersSupport } from "@atomist/rug/operations/Parameters"
import { Status, Result } from "@atomist/rug/operations/Result"
import { Project, Pair, File } from '@atomist/rug/model/Core'
import { PathExpression, PathExpressionEngine, TreeNode, Match } from '@atomist/rug/tree/PathExpression'

import { editor, inject, parameter, parameters, tag } from '@atomist/rug/support/Metadata'

import { Travis } from '@atomist/travis/core/Core'

abstract class ContentInfo extends ParametersSupport {

    @parameter({
        displayName: "Repo Slug",
        description: "GitHib repo slug of the form 'owner/repo'",
        validInput: "An existing Github repository slug of the form 'owner/repo', must be 3-100 characters long",
        minLength: 3,
        maxLength: 100,
        pattern: "^[-\\w.]+/[-\\w.]+$",
    })
    repo_slug: string = null

    @parameter({
        displayName: "Travis CI Endpoint",
        description: "Specify the Travis CI .org or .com endpoint",
        validInput: "Either '.org' or '.com'",
        minLength: 4,
        maxLength: 4,
        pattern: "^\\.(org|com)$",
    })
    org: string = ".org"

    @parameter({
        displayName: "GitHub Token",
        description: "GitHub Personal Access Token of the repo owner with the following scopes: repo, write:repo_hook, user:email, and read:org, generated at https://github.com/settings/tokens; if the repo owner is an organization, the token must belong to a user in the Owner group of the organization",
        validInput: "A valid 40-character, lower-case hexadecimal GitHub Personal Access token",
        minLength: 40,
        maxLength: 40,
        pattern: "^[a-f0-9]{40}$",
    })
    github_token: string = null

    @parameter({
        displayName: "Maven Base URL",
        description: "The URL for a Maven-compatible repository, without the trailing repository name, e.g., if the Maven repository URL is 'https://atomist.jfrog.io/atomist/rugs-release', then you would provide 'https://atomist.jfrog.io/atomist' for this value",
        validInput: "A valid URL starting with http, https, or ftp, must be 7-100 characters long",
        minLength: 7,
        maxLength: 100,
        pattern: "@url",
    })
    maven_base_url: string = "https://atomist.jfrog.io/atomist"

    @parameter({
        displayName: "Maven User",
        description: "Maven user with write access to the rugs-dev and rugs-release repositories under the Maven Base URL",
        validInput: "A valid user name for the rugs-dev and rugs-release Maven repository under the Maven Base URL, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
    })
    maven_user: string = null

    @parameter({
        displayName: "Maven Token",
        description: "API token or password for the Maven User",
        validInput: "A valid user authentication token, i.e., API token or password, for Maven User, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
    })
    maven_token: string = null

}

@editor("Enable Travis CI for a Rug Archive project (Rug TypeScript version)")
@tag("travis-ci")
@tag("continous-integration")
@tag("rug")
class EnableTravisForRugArchiveTS implements ProjectEditor<Parameters>  {

    private eng: PathExpressionEngine;

    constructor( @inject("PathExpressionEngine") _eng: PathExpressionEngine) {
        this.eng = _eng;
    }

    edit(project: Project, @parameters("ContentInfo") p: ContentInfo): Result {
        if (project.directoryExists(".atomist")) {
            let travisBuild: string = "travis-build.bash"
            project.deleteFile(travisBuild)

            project.merge("travis.yml.vm", ".travis.yml", { "maven_base_url": p.maven_base_url });

            let buildDir: string = ".atomist/build"
            project.addDirectory(buildDir, ".")
            for (let f of [travisBuild, "cli-release.yml", "cli-dev.yml"]) {
                let dest = buildDir + "/" + f
                project.deleteFile(dest)
                project.copyEditorBackingFileOrFail(".atomist/templates/" + f, dest);
            }

            var pe = new PathExpression<Project, Travis>(`->travis`);
            let t: Travis = this.eng.scalar(project, pe);
            t.enable(p.repo_slug, p.github_token, p.org);
            t.encrypt(p.repo_slug, p.github_token, p.org, "GITHUB_TOKEN=" + p.github_token);
            t.encrypt(p.repo_slug, p.github_token, p.org, "MAVEN_USER=" + p.maven_user);
            t.encrypt(p.repo_slug, p.github_token, p.org, "MAVEN_TOKEN=" + p.maven_token);

            return new Result(Status.Success, "Repository enabled on Travis CI")
        } else {
            return new Result(Status.NoChange, "Repository does not contain a Rug Archive")
        }
    }

}
