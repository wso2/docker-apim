# Changelog

All notable changes to this project `3.2.x` per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v3.2.0.1] - TBD

### Added
- Alpine, CentOS and Ubuntu based Docker resources for WSO2 API Manager, API Manager Analytics Dashboard and Worker version `3.2.0`
- Docker Compose resources for the deployment of WSO2 API Manager with Analytics support version `3.2.0`
- Docker Compose resources for the deployment of WSO2 API Manager with Identity Server as Key Manager and Analytics support version `3.2.0`

### Changed
- Upgrade AdoptOpenJDK 11 version to the latest version - `11.0.8_10-jdk`
- Upgrade Docker Compose version from `2.3` to `2.4`
- Upgrade MySQL version used in Docker Compose resources - `5.7.31`

### Removed
- Avoid packaging MySQL JDBC Driver in API Manager Docker images
- Remove unnecessary patch volume mount option

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v3.2.0.1](https://github.com/wso2/docker-apim/milestone/17).

[v3.2.0.1]: https://github.com/wso2/docker-apim/compare/v3.1.0.3...v3.2.0.1
