"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Parameters_1 = require("@atomist/rug/operations/Parameters");
var Result_1 = require("@atomist/rug/operations/Result");
var PathExpression_1 = require("@atomist/rug/tree/PathExpression");
var Metadata_1 = require("@atomist/rug/support/Metadata");
var ContentInfo = (function (_super) {
    __extends(ContentInfo, _super);
    function ContentInfo() {
        var _this = _super.apply(this, arguments) || this;
        _this.repo_slug = null;
        _this.org = ".org";
        _this.travis_token = null;
        _this.github_token = null;
        _this.maven_base_url = "https://atomist.jfrog.io/atomist";
        _this.maven_user = null;
        _this.maven_token = null;
        return _this;
    }
    return ContentInfo;
}(Parameters_1.ParametersSupport));
__decorate([
    Metadata_1.parameter({
        displayName: "Repo Slug",
        description: "GitHib repo slug of the form 'owner/repo'",
        validInput: "An existing Github repository slug of the form 'owner/repo', must be 3-100 characters long",
        minLength: 3,
        maxLength: 100,
        pattern: "^[-\\w.]+/[-\\w.]+$",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "repo_slug", void 0);
__decorate([
    Metadata_1.parameter({
        displayName: "Travis CI Endpoint",
        description: "Specify the Travis CI .org or .com endpoint",
        validInput: "Either '.org' or '.com'",
        minLength: 4,
        maxLength: 4,
        pattern: "^\\.(org|com)$",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "org", void 0);
__decorate([
    Metadata_1.parameter({
        displayName: "Travis CI Token",
        description: "Travis CI user token, available on the user profile page, e.g., https://travis-ci.org/profile/USERNAME",
        validInput: "A 21-character, valid Travis CI token consisting of upper- and lower-case letters and digits",
        minLength: 20,
        maxLength: 20,
        pattern: "^[A-Za-z0-9]{20}$",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "travis_token", void 0);
__decorate([
    Metadata_1.parameter({
        displayName: "GitHub Token",
        description: "GitHub Personal Access Token with repo access, generated at https://github.com/settings/tokens",
        validInput: "A valid 41-character, lower-case hexadecimal GitHub Personal Access token",
        minLength: 40,
        maxLength: 40,
        pattern: "^[a-f0-9]{40}$",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "github_token", void 0);
__decorate([
    Metadata_1.parameter({
        displayName: "Maven Base URL",
        description: "The URL for a Maven-compatible repository, without the trailing repository name, e.g., if the Maven repository URL is 'https://atomist.jfrog.io/atomist/rugs-release', then you would provide 'https://atomist.jfrog.io/atomist' for this value",
        validInput: "A valid URL starting with http, https, or ftp, must be 7-100 characters long",
        minLength: 7,
        maxLength: 100,
        pattern: "@url",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "maven_base_url", void 0);
__decorate([
    Metadata_1.parameter({
        displayName: "Maven User",
        description: "Maven user with write access to the rugs-dev and rugs-release repositories under the Maven Base URL",
        validInput: "A valid user name for the rugs-dev and rugs-release Maven repository under the Maven Base URL, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "maven_user", void 0);
__decorate([
    Metadata_1.parameter({
        displayName: "Maven Token",
        description: "API token or password for the Maven User",
        validInput: "A valid user authentication token, i.e., API token or password, for Maven User, must be 1-100 characters long",
        minLength: 1,
        maxLength: 100,
        pattern: "^.*$",
    }),
    __metadata("design:type", String)
], ContentInfo.prototype, "maven_token", void 0);
var EnableTravisForRugArchiveTS = (function () {
    function EnableTravisForRugArchiveTS(_eng) {
        this.eng = _eng;
    }
    EnableTravisForRugArchiveTS.prototype.edit = function (project, p) {
        if (project.directoryExists(".atomist")) {
            console.log("  Templating .travis.yml");
            project.merge(".atomist/templates/travis.yml.vm", ".travis.yml", { "maven_base_url": p.maven_base_url });
            var buildDir = "build";
            project.addDirectory(buildDir, ".");
            var travisBuild = "travis-build.bash";
            for (var _i = 0, _a = [travisBuild, "cli-release.yml", "cli-dev.yml"]; _i < _a.length; _i++) {
                var f = _a[_i];
                console.log("  Copying " + f);
                project.copyEditorBackingFileOrFail(".atomist/templates/" + f, buildDir + "/" + f);
            }
            project.deleteFile(travisBuild);
            var pe = new PathExpression_1.PathExpression("/*[name='.travis.yml']/->travis");
            var t = this.eng.scalar(project, pe);
            t.enable(p.repo_slug, p.travis_token, p.org);
            t.encrypt(p.repo_slug, p.travis_token, p.org, ("GITHUB_TOKEN=" + p.github_token).toString());
            t.encrypt(p.repo_slug, p.travis_token, p.org, ("MAVEN_USER=" + p.maven_user).toString());
            t.encrypt(p.repo_slug, p.travis_token, p.org, ("MAVEN_TOKEN=" + p.maven_token).toString());
            return new Result_1.Result(Result_1.Status.Success, "Repository enabled on Travis CI");
        }
        else {
            return new Result_1.Result(Result_1.Status.Success, "Repository does not contain a Rug Archive");
        }
    };
    return EnableTravisForRugArchiveTS;
}());
__decorate([
    __param(1, Metadata_1.parameters("ContentInfo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ContentInfo]),
    __metadata("design:returntype", Result_1.Result)
], EnableTravisForRugArchiveTS.prototype, "edit", null);
EnableTravisForRugArchiveTS = __decorate([
    Metadata_1.editor("Enable Travis CI for a Rug Archive project (Rug TypeScript version)"),
    Metadata_1.tag("travis-ci"),
    Metadata_1.tag("continous-integration"),
    Metadata_1.tag("rug"),
    __param(0, Metadata_1.inject("PathExpressionEngine")),
    __metadata("design:paramtypes", [Object])
], EnableTravisForRugArchiveTS);
