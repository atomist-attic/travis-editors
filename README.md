# Atomist 'travis-editors'

This [Rug](http://docs.atomist.com/) archive has an editor that
configures and enables a [Travis CI](https://travis-ci.org/) build for
an Atomist Rug archive GitHub repository so it gets built, tested, and
published automatically.  It works with both public (travis-ci.org)
and private (travis-ci.com) builds.

## Requirements

Before running this Editor, you must have already authorized Travis CI
to access the repository containing your Rugs.  Typically, Travis CI
authorizations are done on an user/organization basis.  See the Travis
CI [Getting Started Guide][travis-start] for more information.

To run this editor, you need the following values at hand:

*   The Rug archive's GitHub repository slug, e.g.,
    `atomist-rugs/common-editors`.
*   A [GitHub token][gh-token] with `repo` access to the GitHub
    repository containing the Rug archive code.
*   A Travis CI user token, available on your Travis CI user profile
    page.  This Travis CI user must have access within Travis CI to
    the GitHub repository to be built.
*   A [Maven][maven] repository URL and user name & password/token.

[travis-start]: https://docs.travis-ci.com/user/getting-started/
[gh-token]: https://github.com/settings/tokens
[maven]: https://maven.apache.org/

## Apply the editor

Run it as follows:

```
$ rug edit -l --repo -X atomist-rugs:travis-editors:EnableTravis \
    repo_slug=$REPO_OWNER/$REPO_NAME \
    travis_token=$TRAVIS_TOKEN \
    github_token=$GITHUB_TOKEN \
    maven_base_url=$MAVEN_BASE_URL \
    maven_user=$MAVEN_USER \
    maven_token=$MAVEN_TOKEN \
    org=.org \
    -C $HOME/$REPO_NAME
```

This will add the necessary files to your rug archive and enable the
build in Travis CI.  Commit the changes made by the Editor and push
the commit to GitHub.  This will trigger the build of your Rug archive
and publish it to the `$MAVEN_BASE_URL/rugs-dev` repository.

To release your rug archive to `$MAVEN_BASE_URL/rugs-release`, push
a [semantic version][semver] tag, i.e., a tag of the form `1.2.3`, to
your Rug archive's GitHub repository.  Travis CI will then build the
tag and publish the archive to the rugs-release repository.

[cli]: https://github.com/atomist/rug-cli
[semver]: http://semver.org

---
Created by Atomist. Need Help? <a href="https://join.atomist.com/">Join our Slack team</a>
