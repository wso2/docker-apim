# Dockerfile for WSO2 API Manager #

The Dockerfile defines the resources and instructions to build the Docker images with the WSO2 products and runtime configurations.

## Quickstart guide

 Assume the cloned local copy of project as, `PROJECT_ROOT`.

* [Optional]Copy the basic WSO2 API Manager 2.1.0 Dockerfile to any file system location (with required file permissions), of your choice.

  ```cp <PROJECT_ROOT>/dockerfile/Dockerfile <preferred file system location>```
  
 Assume the directory in which the Dockerfile (to be built) resides as, `DOCKERFILES_HOME`.
 
* Make a directory `<DOCKERFILES_HOME>/files`

  ```mkdir <DOCKERFILES_HOME>/files```

* Add product packs and dependencies to `<DOCKERFILES_HOME>/files`
    - Download and copy [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) pack to `<DOCKERFILES_HOME>/files`.
    - Download the [WSO2 API Manager 2.1.0](http://wso2.com/api-management/try-it/) zip file and copy it to `<DOCKERFILES_HOME>/files`.

* Build the Docker image
    - Navigate to `<DOCKERFILES_HOME>/Dockerfile`.
    - Execute `docker build` command. Optionally, you may use any of `docker build` command options, when building the Docker image.
      Here, for clarity an image tag has been provided.
    
        ```docker build -t wso2:2.1.0 files/```

* Run a container from the generated Docker image (based on the name:tag created, earlier) in the background (detached mode)
        ```docker run -d wso2am:2.1.0```
        
* [Optional]Check Docker container logs to see server startup logs

   ```docker logs <CONTAINER_ID>```
   
   ![WSO2 API Manager 2.1.0 Docker container logs](quickstart/output.png)

* Access management console
    -  To access the management console, use the Docker host IP and port 9443.
        + `https://<DOCKER_HOST_IP>:9443/carbon`
    -  To access the store and publisher, use the Docker host IP, port 9443 and store / publisher contexts.
        + `https://<DOCKER_HOST_IP>:9443/store`
        + `https://<DOCKER_HOST_IP>:9443/publisher`

## Detailed configuration

* [Docker build command reference] (https://docs.docker.com/engine/reference/commandline/build/)

* [Dockerfile reference] (https://docs.docker.com/engine/reference/builder/)

* [Docker run command reference] (https://docs.docker.com/engine/reference/run/)
