import { Executor } from "@atomist/rug/operations/Executor"
import { Services, Service } from "@atomist/rug/model/Core"
import { Result, Status, Parameter } from "@atomist/rug/operations/RugOperation"

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
        required: false
    },
    {
        name: "token",
        displayName: "GitHub Token",
        description: "GitHub Personal Access Token of the repo owner with the following scopes: repo, write:repo_hook, user:email, and read:org, generated at https://github.com/settings/tokens; if the repo owner is an organization, the token must belong to a user in the Owner group of the organization",
        validInput: "A valid 40-character, lower-case hexadecimal GitHub Personal Access token",
        minLength: 0,
        pattern: "^.*$",
        maxLength: 100,
        required: false,
        displayable: false,
        tags: ["atomist/github/user_token=repo,write:repo_hook,user:email,read:org"]
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
        required: false
    },
    {
        name: "maven_user",
        displayName: "Maven User",
        description: "Maven user with write access to the rugs-dev and rugs-release repositories under the Maven Base URL",
        validInput: "A valid user name for the rugs-dev and rugs-release Maven repository under the Maven Base URL, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
        required: false,
        displayable: false,
        tags: ["atomist/secret=maven_user"]
    },
    {
        name: "maven_token",
        displayName: "Maven Token",
        description: "API token or password for the Maven User",
        validInput: "A valid user authentication token, i.e., API token or password, for Maven User, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
        required: false,
        displayable: false,
        tags: ["atomist/secret=maven_token"]
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
var enableTravisForRugArchive: Executor = {
    description: "Enable Travis CI for a Rug Archive",
    name: "EnableTravisForRugArchive",
    tags: ["atomist/intent=enable travis", "atomist/private=false"],
    parameters: params,
    execute(services: Services, p: Parameters): Result {
        for (let s of services.services()) {
          s.editWith("EnableTravisForRugArchiveTS", p)
        }
        return new Result(Status.Success, "OK")
    }
}
