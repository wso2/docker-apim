# Dockerfile for WSO2 API Manager #
The Dockerfile defines the resources and instructions to build the Docker images with the WSO2 products and runtime configurations.

## Try it out

The cloned local copy of WSO2 Dockerfiles will be referred as `DOCKERFILES_HOME`.

* Add product packs and dependencies
    - Download and copy JDK 1.8 ([jdk-8u112-linux-x64.tar.gz](http://www.oracle.com/technetwork/java/javase/8u112-relnotes-3124973.html)) pack to `<DOCKERFILES_HOME>/common/provision/default/files`.
    - Download the WSO2 API Manager 2.1.0 zip file (http://wso2.com/api-management/try-it/) and copy it to `<DOCKERFILES_HOME>/common/provision/default/files`.

* Build the docker image
    - Navigate to `<DOCKERFILES_HOME>/wso2am`.
    - Execute `build.sh` script and provide the product version.
        +  `./build.sh `
        ```bash
        Usage: ./build.sh 
          Options:
          
            -l	[OPTIONAL] '|' separated WSO2AM profiles to build. All the profiles are selected if no value is specified.
            -i	[OPTIONAL] Docker image version.
            -e	[OPTIONAL] Product environment. If not specified this is defaulted to "dev".
            -o	[OPTIONAL] Preferred organization name. If not specified, will be kept empty.
            -q	[OPTIONAL] Quiet flag. If used, the docker build run output will be suppressed.
            -r	[OPTIONAL] Provisioning method. If not specified this is defaulted to "default". Available provisioning methods are default, puppet.
            -t	[OPTIONAL] Image name. If this is specified, it will be used as the image name instead of "wso2{product}" format.
            -y	[OPTIONAL] Automatic yes to prompts; assume "y" (yes) as answer to all prompts and run non-interactively.
            -s	[OPTIONAL] Platform to be used to run the Dockerfile (ex.: kubernetes). If not specified will assume the value as 'default'.
            -p	[OPTIONAL] Deployment pattern number. If the pattern is not specified pattern "1" will be used.
          
          Ex: ./build.sh 
          Ex: ./build.sh -r puppet
          Ex: ./build.sh -l worker|manager -o myorganization -i 2.1.0
          Ex: ./build.sh -t wso2am-customized 
        ```

* Docker run
    - Navigate to `<DOCKERFILES_HOME>/wso2am`.
    - Execute `run.sh` script and provide the product version.
        + `./run.sh `
        ```bash 
        Options:
         
           -i	[OPTIONAL] Docker image version.
           -l	[OPTIONAL] '|' separated WSO2AM profiles to run. 'default' is selected if no value is specified.
           -o	[OPTIONAL] Organization name. 'wso2' is selected if no value is specified.
           -p	[OPTIONAL] [MULTIPLE] Port mappings for the exposed ports 10397 8280 8243 9763 9443 of the container
           -k	[OPTIONAL] The keystore password if SecureVault was enabled in the product.
           -m	[OPTIONAL] Full path of the host location to share with containers.
           
           Ex: ./run.sh 
           Ex: ./run.sh -v 2.1.0 -l 'manager' -k 'wso2carbon'
           ```

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
