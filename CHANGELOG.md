# Changelog

All notable changes to Docker and Docker Compose resources for WSO2 API Management version `4.0.x` in each resource release, will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v4.0.0.4] - 2022-03-10

### Changed
- Use base OS images as opposed to AdoptOpenJDK images for each corresponding OS flavour (Alpine, CentOS, Ubuntu).
- Use Temurin OpenJDK binaries to build OpenJDK on top of the base OS image.
- Upgrade OpenJDK versions to the latest available versions of Temurin OpenJDK from Adoptium. 

## [v4.0.0.3] - 2022-02-07

### Changed
- Change folder structure of dockerfile locations and introduced separate images for jdk8 and jdk11 (refer to [issue](https://github.com/wso2/product-apim/issues/12223)

## [v4.0.0.2] - 2021-6-14

### Changed
- Upgrade AdoptOpenJDK 11 version to the latest version - `jdk-11.0.11_9`

## [v4.0.0.1] - 2021-04-28

### Added

- Alpine, CentOS, and Ubuntu based Docker resources for WSO2 API Manager version `4.0.0`.
- Docker Compose resources for the deployment of WSO2 API Manager `4.0.0` with Choreo Analytics support.
- Docker Compose resources for the deployment of WSO2 API Manager `4.0.0` with Identity Server `5.11.0` as Key Manager and Choreo Analytics support.
- Docker Compose resources for the deployment of WSO2 API Manager `4.0.0` with Micro Integrator `4.0.0`.

### Changed

- Upgrade MySQL version used in Docker Compose resources - `5.7.34`.

### Removed

- WSO2 API Manager Analytics Dashboard and Worker related Docker Compose resources.
