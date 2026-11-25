# Docker and Docker Compose Resources for WSO2 API Management

This repository contains following Docker resources:

- Alpine, Rocky Linux and Ubuntu based Docker resources for WSO2 API Manager, Identity Server as Key Manager, and 
Micro Integrator profiles.

- Docker Compose resources for the most common WSO2 API Management deployment patterns

Docker resources for WSO2 API Manager, WSO2 Identity Server as Key Manager, and WSO2 Micro Integrator
help you build generic Docker images for deploying the corresponding product servers in containerized environments.

Each Docker image includes the Java Development Kit, the relevant product distribution and a collection of utility libraries.
Configurations and non-configuration resources (e.g. binaries such as, third-party libraries, Carbon extensions,
Carbon Applications and security related artifacts such as, Java Keystore files) are designed to be provided via
volume mounts to the containers spawned.

Docker Compose files have been created according to the most common API Management deployment patterns available for allowing users
to quickly evaluate product features along side their co-operate API Management requirements. The Compose files make use of per profile
Docker images of WSO2 API Manager, WSO2 Identity Server as Key Manager, and Micro Integrator as well as MySQL.

## Dockerfiles for each product version

Each WSO2 API Manager version has its own branch. Use the branch that matches your product version:

| API Manager version | Branch |
|---|---|
| 4.7.0 | [4.7.x](https://github.com/wso2/docker-apim/tree/4.7.x) |
| 4.6.0 | [4.6.x](https://github.com/wso2/docker-apim/tree/4.6.x) |
| 4.5.0 | [4.5.x](https://github.com/wso2/docker-apim/tree/4.5.x) |
| 4.4.0 | [4.4.x](https://github.com/wso2/docker-apim/tree/4.4.x) |
| 4.3.0 | [4.3.x](https://github.com/wso2/docker-apim/tree/4.3.x) |
| 4.2.0 | [4.2.x](https://github.com/wso2/docker-apim/tree/4.2.x) |
| 4.1.0 | [4.1.x](https://github.com/wso2/docker-apim/tree/4.1.x) |
| 4.0.0 | [4.0.x](https://github.com/wso2/docker-apim/tree/4.0.x) |
| 3.2.1 | [3.2.1.x](https://github.com/wso2/docker-apim/tree/3.2.1.x) |
| 3.2.0 | [3.2.x](https://github.com/wso2/docker-apim/tree/3.2.x) |
| 3.1.0 | [3.1.x](https://github.com/wso2/docker-apim/tree/3.1.x) |
| 3.0.0 | [3.0.x](https://github.com/wso2/docker-apim/tree/3.0.x) |
| 2.6.0 | [2.6.x](https://github.com/wso2/docker-apim/tree/2.6.x) |
| 2.5.0 | [2.5.x](https://github.com/wso2/docker-apim/tree/2.5.x) |
| 2.2.0 | [2.2.x](https://github.com/wso2/docker-apim/tree/2.2.x) |

Each branch is tagged per release update, for example `v4.7.0.4`. See the [tags](https://github.com/wso2/docker-apim/tags) for the full list.

**Change log** from previous v4.2.0.1 release: [View Here](https://github.com/wso2/docker-apim/blob/4.2.x/CHANGELOG.md)
