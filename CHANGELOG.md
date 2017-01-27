# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

[Unreleased]: https://github.com/atomist-rugs/travis-editors/compare/0.11.0...HEAD

## [0.11.0] - 2016-01-27

## Changed

-   Fixed up parameters between `EnableTravisForRugArchiveTS` editor and executor

## [0.10.0] - 2016-01-26

## Added

-   Added executor to run `EnableTravisForRugArchiveTS`

## [0.9.1] - 2016-01-26

## Changed

-   Fixed parameter in `EnableTravisForRugArchiveTS` to not declare `required: true`
    and a non-empty default

## [0.9.0] - 2016-01-26

Bot release

## Changed

-   `EnableTravisForRugArchiveTS` can now be run from the bot

## [0.8.0] - 2016-01-25

Export vars release

## Changed

-   Now export editor vars explicitly as per Rug changes

[0.8.0]: https://github.com/atomist-rugs/travis-editors/compare/0.7.0...0.8.0

## [0.7.0] - 2016-01-05

[0.7.0]: https://github.com/atomist-rugs/travis-editors/compare/0.6.0...0.7.0

Brand new rug and type release

### Changed

-   Upgrade rug to 0.8.0

-   Upgrade to travis-rug-type 0.5.1

### Fixed

-   Re-implement authenticating with GitHub token

## [0.6.0] - 2016-12-16

[0.6.0]: https://github.com/atomist-rugs/travis-editors/compare/0.5.0...0.6.0

New Typescript API release

### Changed

-   Upgrade rug to 0.7.0 which changes the Typescript programming model significantly

## [0.5.0] - 2016-12-14

[0.5.0]: https://github.com/atomist-rugs/travis-editors/compare/0.4.0...0.5.0

New rug release

### Changed

-   Upgrade rug and travis type

## [0.4.0] - 2016-12-14

[0.4.0]: https://github.com/atomist-rugs/travis-editors/compare/0.3.0...0.4.0

Wrapping paper release

### Added

-   Tags on UpdateTravisMavenBuild Executor

### Changed

-   New packaging available in rug-cli allows Rugs to be run from anywhere

### Fixed

-   Documentation fixes and improvements

## [0.3.0] - 2016-12-09

[0.3.0]: https://github.com/atomist-rugs/travis-editors/compare/0.2.0...0.3.0

Iron maven release

### Added

-   Add UpdateTravisMaven Editor and UpdateTravisMavenBuild Executor

### Changed

-   Switch from .atomistignore to .atomist/ignore

### Fixed

-   Fixed Travis build script for Rug archives

## [0.2.0] - 2016-12-08

[0.2.0]: https://github.com/atomist-rugs/travis-editors/compare/0.1.2...0.2.0

Mutually assured success release

### Changed

-   Update Rug DSL and TypeScript versions to latest version of Rug
    and latest standards

### Added

-   Documentation

-   Automate build on Travis CI

## [0.1.2] - 2016-12-02

Initial release

[0.1.2]: https://github.com/atomist-rugs/travis-editors/tree/dd83671b2c364c132e69bcca2d67fc3ea63a4144

### Added

-   Rug DSL and TypeScript versions of a Rug Editor that enables
    Travis CI on Rug Archive repositories
