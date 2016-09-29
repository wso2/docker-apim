# Dockerfile for WSO2 API Manager #
The Dockerfile defines the resources and instructions to build the Docker images with the WSO2 products and runtime configurations.

## Try it out

The cloned local copy of WSO2 Dockerfiles will be referred as `DOCKERFILES_HOME`.

* Add product packs and dependencies
    - Download and copy JDK 1.7 ([jdk-7u80-linux-x64.tar.gz](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)) pack to `<DOCKERFILES_HOME>/common/provision/default/files`.
    - Download the WSO2 API Manager zip file (http://wso2.com/api-management/try-it/) and copy it to `<DOCKERFILES_HOME>/common/provision/default/files`.

* Build the docker image
    - Navigate to `<DOCKERFILES_HOME>/wso2am`.
    - Execute `build.sh` script and provide the product version.
        + `./build.sh -v 1.10.0`

* Docker run
    - Navigate to `<DOCKERFILES_HOME>/wso2am`.
    - Execute `run.sh` script and provide the product version.
        + `./run.sh -v 1.10.0`

* Access management console
    -  To access the management console, use the docker host IP and port 9443.
        + `https://<DOCKER_HOST_IP>:9443/carbon`
    -  To access the Store and Publisher, use the docker host IP, port 9443 and store / publisher contexts.
        + `https://<DOCKER_HOST_IP>:9443/store`
        + `https://<DOCKER_HOST_IP>:9443/publisher`

## Detailed Configuration

* [Introduction] (https://docs.wso2.com/display/DF120/Introduction)

* [Building docker images] (https://docs.wso2.com/display/DF120/Building+Docker+Images)

* [Running docker images] (https://docs.wso2.com/display/DF120/Running+WSO2+Docker+Images)
