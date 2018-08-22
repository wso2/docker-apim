# Docker Resources for WSO2 API Manager 

This repository contains following Docker artifacts, for trying out WSO2 API Manager on plain Docker:
- WSO2 API Manager Dockerfile
- WSO2 API Manager Analytics Dockerfile
- WSO2 API Manager Docker Compose Templates

The WSO2 API Manager and API Manager Analytics Dockerfiles build generic Docker images <br>
for deploying API Manager and API Manager Analytics in containerized environments. They<br>
include the JDK, product distributions and a collection of utility libraries. Configurations, JDBC<br>
driver, extensions and other deployable artifacts are designed to be provided via volume mounts.

The Docker Compose templates have been created according to standard API Manager deployment patterns
for allowing users to evaluate the product and understand the deployment architecture in depth.

## Note
For running a containerized WSO2 API Manager deployment in production, its recommended to use a<br>
container cluster manager such as Kubernetes/Openshift. Please refer [APIM Kubernetes Artifacts](https://github.com/wso2/kubernetes-apim/) repository.