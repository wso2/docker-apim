# Dockerfile for WSO2 API Manager #

The Dockerfile defines the resources and instructions to build the Docker image for WSO2 API Manager 2.1.0.

## How to build an image and run

 Follow below steps to build the WSO2 API Manager 2.1.0 Docker image and run in your local machine.
 
 The local copy of the `Dockerfile` directory will be referred as, `DOCKERFILE_HOME`.
 
 * Add the JDK and WSO2 API Manager distributions to `files` directory:
     - Download JDK 1.8 (http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and copy it to `<DOCKERFILE_HOME>/files`.
     - Download the WSO2 API Manager 2.1.0 distribution (http://wso2.com/api-management/try-it/) and copy it to `<DOCKERFILE_HOME>/files`.
     Please refer [WSO2 Update Manager documentation](https://docs.wso2.com/display/ADMIN44x/Updating+WSO2+Products) to obtained the WSO2 API Manager 2.1.0
   with latest bug fixes and updates.
 
 * Build the Docker image:
     - Navigate to `<DOCKERFILE_HOME>` directory.
     - Execute the `docker build` command as shown below;
         + `docker build -t wso2am:2.1.0 .`
 
 * Docker run:
     - Run the WSO2 API Manager 2.1.0 Docker container as follows:
         + `docker run -it -p 9443:9443 wso2am:2.1.0`
         
       **Note**: Here, only port 9443 (HTTPS servlet transport) has been mapped to a Docker host port.
       You may map other container service ports, which have been exposed to Docker host ports, as desired.
 
 * Access management console:
     -  To access the management console, use the Docker host IP and port 9443.
         + `https://<DOCKER_HOST>:9443/carbon`
     -  To access the store and publisher, use the Docker host IP, port 9443 and store/publisher contexts.
         + `https://<DOCKER_HOST>:9443/store`
         + `https://<DOCKER_HOST>:9443/publisher`

## How to update configurations

The configurations will be maintained on the Docker Host machine and volume mounted to the container.

As an example, the steps required to change the port offset in `carbon.xml` is detailed.

* Stop the API Manager container if it's already running.

* Create the required config changes in the host machine
    - Extract the `wso2am-2.1.0.zip` file located in `DOCKERFILE_HOME/files`.
        + Navigate to `<DOCKERFILE_HOME>/files` directory
        + `unzip -q wso2am-2.1.0.zip`
    - Change the port offset in `carbon.xml` file located in `DOCKERFILE_HOME/files/wso2am-2.1.0/repository/conf/` directory.
    - Grant write permission to the `DOCKERFILE_HOME/files/wso2am-2.1.0/repository/conf/` directory on the host machine to `other` users.
        + `sudo chmod o+w -R DOCKERFILE_HOME/files/wso2am-2.1.0/repository/conf`

* Run the Docker container by mounting the config directory (`DOCKERFILE_HOME/files/wso2am-2.1.0/repository/conf/`) of the host machine.
    - Navigate to `<DOCKERFILE_HOME>` directory.
    - `docker run -it --mount type=bind,source=${PWD}/files/wso2am-2.1.0/repository/conf,target=/home/wso2carbon/wso2am-2.1.0/repository/conf wso2am:2.1.0`

* If the `conf` directory on the host machine is located on a different directory than shown above, when executing the `docker run`
command the absolute path of the `conf` directory should be set as the `source`.

## Docker command usage references

* [Docker build command reference] (https://docs.docker.com/engine/reference/commandline/build/)

* [Dockerfile reference] (https://docs.docker.com/engine/reference/builder/)

* [Docker run command reference] (https://docs.docker.com/engine/reference/run/)
