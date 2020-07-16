# Changelog
All notable changes to this project 2.5.x per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v2.5.0.2] - 2020-07-16

### Changed
- In the current Docker image build process it is instructed to copy the relevant JDK, Product pack and the MySQL JDBC connector to the file directory and in the Dockerfile its copying the files from the file directory. In order to compatible with WSO2 Docker image create automation process, this has been changed to get the product pack from WUM, JDK from the Jenkins and MySQL from the Maven central repository.
  
- Change the name of the ENTRYPOINT script as docker-entrypoint.sh

### Removed
- Remove copying the JDK and product pack from file directory

[v2.5.0.1]: https://github.com/wso2/docker-apim/compare/v2.5.0.1...v2.5.0.2
