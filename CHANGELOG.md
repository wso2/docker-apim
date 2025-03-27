# Changelog

All notable changes to Docker and Docker Compose resources for WSO2 API Management version `4.5.x` in each resource release, will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v4.5.0.1] - 2025-03-06

### Changed
- Update all Docker resources to support WSO2 API Manager version `4.5.0`.
- Introduce new Docker images for each component. Now we have four Docker images: Gateway, API Control Plane, Traffic Manager, and All-in-One.
- Update all Docker Compose resources to support WSO2 API Manager version `4.5.0`.
- Update Docker Compose resources for the deployment of WSO2 APIM with MI to support Micro Integrator version `4.4.0.0`.
- Update IS extentions to the latest version and mount wso2carbon and client-truststore keystores with the latest wso2carbon certificate in Identity Server as Key Manager with Choreo Analytics deployment setup.
