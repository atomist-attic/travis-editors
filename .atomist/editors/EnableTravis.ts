import {ProjectEditor} from "@atomist/rug/operations/ProjectEditor"
import {Parameters, ParametersSupport} from "@atomist/rug/operations/Parameters"
import {Status, Result} from "@atomist/rug/operations/Result"
import {Project, Pair, File} from '@atomist/rug/model/Core'
import {PathExpression, PathExpressionEngine, TreeNode, Match} from '@atomist/rug/tree/PathExpression'

import {editor, inject, parameter, parameters} from '@atomist/rug/support/Metadata'

import {Travis} from '@atomist/travis/core/Core'

abstract class ContentInfo extends ParametersSupport {

  @parameter({description: "Repo Slug (owner/repo)", displayName: "repo_slug", pattern: ".*", maxLength: 100})
  repo_slug: string = null

  @parameter({description: ".org or .com", displayName: "org", pattern: ".*", maxLength: 100})
  org: string = null

  @parameter({description: "Travis Access Token", displayName: "travis_token", pattern: ".*", maxLength: 100})
  travis_token: string = null

  @parameter({description: "GitHub Token", displayName: "github_token", pattern: ".*", maxLength: 100})
  github_token: string = null

  @parameter({description: "JFrog User", displayName: "jfrog_user", pattern: ".*", maxLength: 100})
  jfrog_user: string = null

  @parameter({description: "JFrog Password", displayName: "jfrog_password", pattern: ".*", maxLength: 100})
  jfrog_password: string = null

}

@editor("Enable Travis CI for a Rug project (Rug TS)")
class EnableTravis implements ProjectEditor<Parameters>  {

    private eng: PathExpressionEngine;

    constructor(@inject("PathExpressionEngine") _eng: PathExpressionEngine) {
      this.eng = _eng;
    }

    edit(project: Project, @parameters("ContentInfo") p: ContentInfo): Result {
      console.log("  Copying .travis.yml");
      project.copyEditorBackingFileOrFail(".atomist/templates/.travis.yml", ".travis.yml");

      console.log("  Copying travis-build.bash");
      project.copyEditorBackingFileOrFail(".atomist/templates/travis-build.bash", "travis-build.bash");

      var pe = new PathExpression<Project, Travis>(`/*[name='.travis.yml']/->travis`);
      let t: Travis = this.eng.scalar(project, pe);

      console.log(`  Enabling Travis for ${project.name()}`);
      t.enable(p.repo_slug, p.travis_token, p.org);

      console.log("  Encrypting env variables");
      t.encrypt(p.repo_slug, p.travis_token, p.org, ("GITHUB_TOKEN=" + p.github_token).toString());
      t.encrypt(p.repo_slug, p.travis_token, p.org, ("JFROG_USER=" + p.jfrog_user).toString());
      t.encrypt(p.repo_slug, p.travis_token, p.org, ("JFROG_PASSWORD=" + p.jfrog_password).toString());

      return new Result(Status.Success, "Repository enabled on Travis")
    }
  }
