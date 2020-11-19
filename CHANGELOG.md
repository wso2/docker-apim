# Changelog

All notable changes to Docker and Docker Compose resources for WSO2 API Management version `3.2.x` in each resource release, will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v3.2.0.2] - 2020-11-20

### Added
- Add git release tag as a label (refer to [issue](https://github.com/wso2/docker-apim/issues/338))

### Changed
- Upgrade AdoptOpenJDK 11 version to the latest version - `11.0.9_11-jdk` (refer to [issue](https://github.com/wso2/docker-apim/issues/377))
- Enable SSL verification when retrieving remote resources using wget (refer to [issue](https://github.com/wso2/docker-apim/issues/345))
- Update source label key

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v3.2.0.2](https://github.com/wso2/docker-apim/milestone/21).

## [v3.2.0.1] - 2020-08-26

### Environments

- Successful evaluation using Docker Engine Community version `19.03.5` (both client and server)
- Successful evaluation using Docker Compose version `1.23.1, build b02f1306`

### Added

- Alpine, CentOS and Ubuntu based Docker resources for WSO2 API Manager, API Manager Analytics Dashboard and Worker version `3.2.0` (refer to [issue](https://github.com/wso2/docker-apim/issues/313))
- Docker Compose resources for the deployment of WSO2 API Manager with Analytics support version `3.2.0` (refer to [issue](https://github.com/wso2/docker-apim/issues/314))
- Docker Compose resources for the deployment of WSO2 API Manager with Identity Server as Key Manager and Analytics support version `3.2.0` (refer to [issue](https://github.com/wso2/docker-apim/issues/314))

### Changed

- Upgrade AdoptOpenJDK 11 version to the latest version - `11.0.8_10-jdk` (refer to [issue](https://github.com/wso2/docker-apim/issues/336))
- Upgrade Docker Compose version from `2.3` to `2.4` (refer to [issue](https://github.com/wso2/docker-apim/issues/323))
- Upgrade MySQL version used in Docker Compose resources - `5.7.31` (refer to [issue](https://github.com/wso2/docker-apim/issues/322))

### Removed

- Avoid packaging MySQL JDBC Driver in API Manager Docker images (refer to [issue](https://github.com/wso2/docker-apim/issues/321))
- Remove unnecessary patch volume mount option (refer to [issue](https://github.com/wso2/docker-apim/issues/317))

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v3.2.0.1](https://github.com/wso2/docker-apim/milestone/17).

[v3.2.0.1]: https://github.com/wso2/docker-apim/compare/v3.1.0.3...v3.2.0.1
[v3.2.0.2]: https://github.com/wso2/docker-apim/compare/v3.2.0.1...v3.2.0.2
