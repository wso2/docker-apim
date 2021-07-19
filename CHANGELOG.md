# Changelog
All notable changes to this project 2.6.x per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v2.6.0.15] - 2021-07-19

### Added
- Create Java prefs directory to avoid warning logs printed by FileSystemPreferences class in centos apim and is-as-km images
- Set JAVA_OPTS as an environment variable with values for java.util.prefs.systemRoot and java.util.prefs.userRoot

## [v2.6.0.12] - 2021-01-13

### Changed
- Upgrade MySql version to 5.1.49

## [v2.6.0.11] - 2020-12-01

### Changed
- Use AdoptOpenJDK version `jdk8u272-b10` in Alpine, CentOS, Ubuntu based Docker resources (refer to [issue](https://github.com/wso2/docker-apim/issues/386))

## [v2.6.0.10] - 2020-11-25

### Added
- Add git release tag as a label (refer to [issue](https://github.com/wso2/docker-apim/issues/353))

### Changed
- Enable SSL verification when retrieving remote resources using wget (refer to [issue](https://github.com/wso2/docker-apim/issues/354))

## [v2.6.0.8] - 2019-11-05

### Fixed
- Failure to accept product startup options

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v2.6.0.8](https://github.com/wso2/docker-apim/milestone/6).

## [v2.6.0.7] - 2019-08-28

### Changed
- Use AdoptOpenJDK version `jdk8u222-b10` in Alpine, CentOS, Ubuntu based Docker resources

## [v2.6.0.6] - 2018-08-28

### Added
- Introduce support for artifact synchronization between API Manager nodes
- Add `libxml2-utils` Debian package for executing the `<PRODUCT_HOME>/bin/profileSetup.sh` script in
  Alpine and Ubuntu based WSO2 API Manager Docker resources.
- Package the Kubernetes Membership Scheme in WSO2 Identity Server as KM Docker images.

### Changed
- Use WSO2 product pack downloadable links to binaries available at JFrog Bintray.

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v2.6.0.6](https://github.com/wso2/docker-apim/milestone/5).

## [v2.6.0.5] - 2019-06-07

### Changed
- Remove WSO2 API Manager Analytics base image

## [v2.6.0.4] - 2019-06-06

### Added
- Add downloadable links for obtaining dependencies required to be available in Docker image build context
- Use Dockerfile LABEL construct for defining the maintainer

### Changed
- Fix incorrect MOTDs
- Remove temporarily persisted, default content of persistent runtime artifact folders
- Prevent prepackaging additional artifacts required for Kubernetes Membership Scheme
- Avoid creating Java Prefs directories in WSO2 API Manager Analytics v2.6.x Docker resources
- Fix issue with container startup failure when Docker image indirect mount points are empty

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v2.6.0.4](https://github.com/wso2/docker-apim/milestone/4).

## [v2.6.0.3] - 2019-05-25

### Added
- Integrate support in Docker Compose resources for users with and without WSO2 subscriptions

### Changed
- Use AdoptOpenJDK version `jdk8u212-b03` in Alpine, CentOS, Ubuntu based Docker resources

## [v2.6.0.2] - 2018-01-11

### Added
- Integrate support for passing arguments during WSO2 server startup

### Changed
- Use AdoptOpenJDK version `jdk8u192-b12` in Alpine, CentOS, Ubuntu based Docker resources

## [v2.6.0.1] - 2018-10-09

### Added
- WSO2 API Manager v2.6.x Docker resources for Alpine, CentOS and Ubuntu
- WSO2 API Manager Analytics v2.6.x Docker resources for Alpine, CentOS and Ubuntu
- WSO2 API Manager Identity Server as Key Manager v5.7.x Docker resources for Alpine, CentOS and Ubuntu
- Docker Compose resources for WSO2 API Management

[v2.6.0.7]: https://github.com/wso2/docker-apim/compare/v2.6.0.6...v2.6.0.7
[v2.6.0.9]: https://github.com/wso2/docker-apim/compare/v2.6.0.8...v2.6.0.9
