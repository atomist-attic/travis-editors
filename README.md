# Atomist 'travis-editors'

This [rug](http://docs.atomist.com/) archive comes with an editor that adds a 
[Travis](https://travis-ci.org/) build resource to an Atomist Rug archive so it 
gets build, tested and published automatically.

## Requirements

In order to run this editor, you need the following values at hand:

* a GitHub token
* a travis token for travis-ci.org
* a JFrog user/password for https://atomist.jfrog.io/
* the name of the target repository in the atomist-rugs org

## Apply the editor

Run it as follows:

```
$ rug edit -l --repo -X atomist-rugs:travis-editors:EnableTravis \
    repo_slug=atomist-rugs/$REPO_NAME \
    travis_token=$TRAVIS_TOKEN \
    github_token=$GH_TOKEN \
    jfrog_user=$JFROG_USER \
    jfrog_password=$JFROG_PWD \
    org=.org \
    -C $HOME/$REPO_NAME
```

This will add the necessary files to your rug archive. You can then simply
push it. This will trigger the build of your rug archive and publish it
to https://atomist.jfrog.io/atomist/rugs-dev. 

To release your rug archive to https://atomist.jfrog.io/atomist/rugs-release,
you will need to push a new tag, with a semver, of your rug archive.

---
Created by Atomist. Need Help? <a href="https://join.atomist.com/">Join our Slack team</a>
