# Changelog

All notable changes to this project 3.1.x per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v3.1.0.3] - 2020-11-10

### Added
- Add git release tag as a label (refer to [issue](https://github.com/wso2/docker-apim/issues/347))

### Changed
- Enable SSL verification when retrieving remote resources using wget (refer to [issue](https://github.com/wso2/docker-apim/issues/348))

## [v3.1.0.2] - 2020-04-09

### Fixed
- Revert to the use of port 9643 in WSO2 API Manager Analytics Dashboard Profile

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v3.1.0.3](https://github.com/wso2/docker-apim/milestone/15).

## [v3.1.0.2] - 2020-04-07

### Changed
- Add support for WSO2 API Manager
[Solr indexing](https://apim.docs.wso2.com/en/latest/administer/product-configurations/common-runtime-and-configuration-artifacts/#persistent-runtime-artifacts).
- Execute the profile optimization script explicitly to apply changes

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v3.1.0.2](https://github.com/wso2/docker-apim/milestone/14).

## [v3.1.0.1] - 2020-04-07

### Added
- Alpine, CentOS and Ubuntu based Docker resources for WSO2 API Manager, API Manager Analytics Dashboard and Worker version 3.1.x
and Identity Server as Key Manager version 5.10.x profiles
- Upgrade WSO2 API Management product profile Docker resources to use AdoptOpenJDK 11
- Docker Compose resources for the most common WSO2 API Management deployment patterns

For detailed information on the tasks carried out during this release, please see the GitHub milestone
[v3.1.0.1](https://github.com/wso2/docker-apim/milestone/13).

[v3.1.0.2]: https://github.com/wso2/docker-apim/compare/v3.1.0.1...v3.1.0.2
[v3.1.0.3]: https://github.com/wso2/docker-apim/compare/v3.1.0.2...v3.1.0.3
