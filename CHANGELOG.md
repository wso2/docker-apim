# Changelog
All notable changes to this project 2.2.x per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v2.2.0.6] - 2020-11-10

### Added
- Add git release tag as a label
- Add ca-certificates for Ubuntu base images

### Changed
- Enable SSL verification when retrieving remote resources using wget
- Update GA product download source

## [v2.2.0.5] - 2020-07-13

### Removed
- Remove copying the JDK and product pack from file directory

### Added
- Add MYSQL JDBC connector,version 5.1.49

### Changed

- In the current docker image build process it is instructed to copy the relevant JDK, Product pack and the MySQL JDBC connector to the
  file directory and in the Dockerfile its copying the files from the file directory. In order to compatible with WSO2 Docker image create automation process, this has been changed to get the product pack from WUM, 
  JDK from the Jenkins and MySQL from the maven central repository. 

- Change the name of the `ENTRYPOINT` script as `docker-entrypoint.sh`


## [v2.2.0.4] - 2018-09-19

### Changed
- Changed the folders to which configuration files with new changes to be copied are mounted.
Originally this was `wso2-server-volume` in general and for Kubernetes, this was
`kubernetes-volumes`. But with this release, there will not be any platform specific
folders for mounting configuration files. Instead we are introducing a single folder
for this purpose by the name, `wso2-config-volume`.

- Changed the folder to which any other non-configuration type artifacts to be copied are mounted.
Originally this was `wso2-server-volume`. But with this release, this is changed to `wso2-artifact-volume`.

### Compatibility with kubernetes-is releases
- If you are to use images built using this release with the latest v2.2.0.1 Kubernetes release, please do change
your deployment mount paths appropriately to match above folder changes.

[v2.2.0.4]: https://github.com/wso2/docker-apim/compare/v2.2.0.3...v2.2.0.4
[v2.2.0.5]: https://github.com/wso2/docker-apim/compare/v2.2.0.4...v2.2.0.5
[v2.2.0.6]: https://github.com/wso2/docker-apim/compare/v2.2.0.5...v2.2.0.6
