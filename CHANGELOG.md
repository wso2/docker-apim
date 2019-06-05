# Changelog
All notable changes to this project 2.6.x per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

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

[v2.6.0.4]: https://github.com/wso2/docker-apim/compare/v2.6.0.3...v2.6.0.4
