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
        _this.org = null;
        _this.travis_token = null;
        _this.github_token = null;
        _this.jfrog_user = null;
        _this.jfrog_password = null;
        return _this;
    }
    return ContentInfo;
}(Parameters_1.ParametersSupport));
__decorate([
    Metadata_1.parameter({ description: "Repo Slug (owner/repo)", displayName: "repo_slug", pattern: ".*", maxLength: 100 }),
    __metadata("design:type", String)
], ContentInfo.prototype, "repo_slug", void 0);
__decorate([
    Metadata_1.parameter({ description: ".org or .com", displayName: "org", pattern: ".*", maxLength: 100 }),
    __metadata("design:type", String)
], ContentInfo.prototype, "org", void 0);
__decorate([
    Metadata_1.parameter({ description: "Travis Access Token", displayName: "travis_token", pattern: ".*", maxLength: 100 }),
    __metadata("design:type", String)
], ContentInfo.prototype, "travis_token", void 0);
__decorate([
    Metadata_1.parameter({ description: "GitHub Token", displayName: "github_token", pattern: ".*", maxLength: 100 }),
    __metadata("design:type", String)
], ContentInfo.prototype, "github_token", void 0);
__decorate([
    Metadata_1.parameter({ description: "JFrog User", displayName: "jfrog_user", pattern: ".*", maxLength: 100 }),
    __metadata("design:type", String)
], ContentInfo.prototype, "jfrog_user", void 0);
__decorate([
    Metadata_1.parameter({ description: "JFrog Password", displayName: "jfrog_password", pattern: ".*", maxLength: 100 }),
    __metadata("design:type", String)
], ContentInfo.prototype, "jfrog_password", void 0);
var EnableTravis = (function () {
    function EnableTravis(_eng) {
        this.eng = _eng;
    }
    EnableTravis.prototype.edit = function (project, p) {
        console.log("  Copying .travis.yml");
        project.copyEditorBackingFileOrFail(".atomist/templates/.travis.yml", ".travis.yml");
        console.log("  Copying travis-build.bash");
        project.copyEditorBackingFileOrFail(".atomist/templates/travis-build.bash", "travis-build.bash");
        var pe = new PathExpression_1.PathExpression("/*[name='.travis.yml']/->travis");
        var t = this.eng.scalar(project, pe);
        console.log("  Enabling Travis for " + project.name());
        t.enable(p.repo_slug, p.travis_token, p.org);
        console.log("  Encrypting env variables");
        t.encrypt(p.repo_slug, p.travis_token, p.org, ("GITHUB_TOKEN=" + p.github_token).toString());
        t.encrypt(p.repo_slug, p.travis_token, p.org, ("JFROG_USER=" + p.jfrog_user).toString());
        t.encrypt(p.repo_slug, p.travis_token, p.org, ("JFROG_PASSWORD=" + p.jfrog_password).toString());
        return new Result_1.Result(Result_1.Status.Success, "Repository enabled on Travis");
    };
    return EnableTravis;
}());
__decorate([
    __param(1, Metadata_1.parameters("ContentInfo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ContentInfo]),
    __metadata("design:returntype", Result_1.Result)
], EnableTravis.prototype, "edit", null);
EnableTravis = __decorate([
    Metadata_1.editor("Enable Travis CI for a Rug project (Rug TS)"),
    __param(0, Metadata_1.inject("PathExpressionEngine")),
    __metadata("design:paramtypes", [Object])
], EnableTravis);
