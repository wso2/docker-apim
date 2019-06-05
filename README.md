# Docker and Docker Compose Resources for WSO2 API Management

This repository contains following Docker resources:

- WSO2 API Manager Dockerfile for Ubuntu
- WSO2 API Manager Analytics Dockerfile for Ubuntu
- WSO2 API Manager Identity Server as Key Manager Dockerfile for Ubuntu
- Docker Compose files to evaluate most common deployment profiles

Docker resources for WSO2 API Manager, WSO2 API Manager Analytics and WSO2 API Manager Identity Server as Key Manager
help you build generic Docker images for deploying the corresponding product servers in containerized environments.
Each Docker image includes the JDK, the relevant product distribution and a collection of utility libraries.Configurations, custom JDBC
drivers other than the default MySQL JDBC driver provided, extensions and other deployable artifacts are designed to be
provided via volume mounts to the containers spawned.

Docker Compose files have been created according to the most common API Manager deployment profiles available for allowing users to quickly evaluate
product features along side their co-operate API management requirements. The Compose files make use of
Docker images of WSO2 API Manager, WSO2 API Manager Analytics, WSO2 API Manager Identity Server as Key Manager and MySQL.

**Change log** from previous v2.6.0.2 release: [View Here](CHANGELOG.md)

## Reporting issues

We encourage you to report any issues and documentation faults regarding Docker and Docker Compose resources for WSO2 API Management.
Please report your issues [here](https://github.com/wso2/docker-apim/issues).

## Contact us

WSO2 developers can be contacted via the following mailing lists:

* WSO2 Developers Mailing List : [dev@wso2.org](mailto:dev@wso2.org)
* WSO2 Architecture Mailing List : [architecture@wso2.org](mailto:architecture@wso2.org)
