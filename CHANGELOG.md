# Changelog
All notable changes to this project 2.2.x per each release will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [v2.2.0.4] - 2018-09-18

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