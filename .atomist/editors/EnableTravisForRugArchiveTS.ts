/*
 * Copyright © 2016 Atomist, Inc.
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
import { Status, Result, Parameter } from "@atomist/rug/operations/RugOperation"
import { Project, Pair, File } from '@atomist/rug/model/Core'
import { PathExpression, PathExpressionEngine, TreeNode, Match } from '@atomist/rug/tree/PathExpression'

import { Travis } from '@atomist/travis/core/Core'


let params: Parameter[] = [
    {
        name: "repo_slug",
        displayName: "Repo Slug",
        description: "GitHub repo slug of the form 'owner/repo'",
        validInput: "An existing Github repository slug of the form 'owner/repo', must be 3-100 characters long",
        minLength: 3,
        maxLength: 100,
        pattern: "^[-\\w.]+/[-\\w.]+$",
        required: true
    },
    {
        name: "org",
        displayName: "Travis CI Endpoint",
        description: "Specify the Travis CI .org or .com endpoint",
        validInput: "Either '.org' or '.com'",
        minLength: 4,
        maxLength: 4,
        default: ".org",
        pattern: "^\\.(org|com)$",
        required: true
    },
    {
        name: "github_token",
        displayName: "GitHub Token",
        description: "GitHub Personal Access Token of the repo owner with the following scopes: repo, write:repo_hook, user:email, and read:org, generated at https://github.com/settings/tokens; if the repo owner is an organization, the token must belong to a user in the Owner group of the organization",
        validInput: "A valid 40-character, lower-case hexadecimal GitHub Personal Access token",
        minLength: 40,
        maxLength: 40,
        pattern: "^[a-f0-9]{40}$",
        required: true
    },
    {
        name: "maven_base_url",
        displayName: "Maven Base URL",
        description: "The URL for a Maven-compatible repository, without the trailing repository name, e.g., if the Maven repository URL is 'https://atomist.jfrog.io/atomist/rugs-release', then you would provide 'https://atomist.jfrog.io/atomist' for this value",
        validInput: "A valid URL starting with http, https, or ftp, must be 7-100 characters long",
        minLength: 7,
        maxLength: 100,
        default: "https://atomist.jfrog.io/atomist",
        pattern: "@url",
        required: true
    },
    {
        name: "maven_user",
        displayName: "Maven User",
        description: "Maven user with write access to the rugs-dev and rugs-release repositories under the Maven Base URL",
        validInput: "A valid user name for the rugs-dev and rugs-release Maven repository under the Maven Base URL, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
        required: true
    },
    {
        name: "maven_token",
        displayName: "Maven Token",
        description: "API token or password for the Maven User",
        validInput: "A valid user authentication token, i.e., API token or password, for Maven User, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
    }
]

interface Parameters {
    repo_slug: string
    org: string
    github_token: string
    maven_base_url: string
    maven_user: string
    maven_token: string
}

let editor: ProjectEditor = {
    tags: ["travis-ci", "continuous-integration", "github", "rug"],
    name: "EnableTravisForRugArchiveTS",
    description: "Enable Travis CI for a Rug Archive project (Rug TypeScript version)",
    parameters: params,
    edit(project: Project, p: Parameters): Result {

        let eng: PathExpressionEngine = project.context().pathExpressionEngine()

        if (project.directoryExists(".atomist")) {
            project.merge("travis.yml-rug.vm", ".travis.yml", { "maven_base_url": p.maven_base_url });

            let travisBuild: string = "travis-build.bash";
            project.deleteFile(travisBuild);
            let buildDir: string = ".atomist/build";
            project.addDirectoryAndIntermediates(buildDir);
            project.merge(travisBuild + "-rug.vm", buildDir + "/" + travisBuild, {});
            for (let f of ["cli-build.yml", "cli-release.yml", "cli-dev.yml"]) {
                project.merge(f + ".vm", buildDir + "/" + f, {});
            }

            var pe = new PathExpression<Project, Travis>(`/Travis()`);
            let t: Travis = eng.scalar(project, pe);
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
