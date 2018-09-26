# Dockerfile for WSO2 API Manager Analytics #
This section defines the step-by-step instructions to build an [CentOS](https://hub.docker.com/_/centos/) Linux based Docker image for WSO2 API Manager Analytics 2.6.0.

## Prerequisites

* [Docker](https://www.docker.com/get-docker) v17.09.0 or above

## How to build an image and run
##### 1. Checkout this repository into your local machine using the following git command.
```
git clone https://github.com/wso2/docker-apim.git
```

>The local copy of the `dockerfile/centos/apim-analytics` directory will be referred to as `ANALYTICS_DOCKERFILE_HOME` from this point onwards.

##### 2. Add JDK, WSO2 API Manager Analytics distributions and MySQL Connector to `<ANALYTICS_DOCKERFILE_HOME>/files`
- Download [JDK v1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
and extract it to `<ANALYTICS_DOCKERFILE_HOME>/files`.
- Download the [WSO2 API Manager Analytics 2.6.0](https://wso2.com/api-management/install/analytics/)
and extract it to `<ANALYTICS_DOCKERFILE_HOME>/files`.
- Download [MySQL Connector/J](https://dev.mysql.com/downloads/connector/j/) v5.1.45 and then copy that to `<ANALYTICS_DOCKERFILE_HOME>/files` folder <br>
- Once all of these are in place, it should look as follows:

  ```bash
  <ANALYTICS_DOCKERFILE_HOME>/files/jdk<version>/
  <ANALYTICS_DOCKERFILE_HOME>/files/mysql-connector-java-5.1.45-bin.jar
  <ANALYTICS_DOCKERFILE_HOME>/files/wso2am-analytics-2.6.0/
  ```

>Please refer to [WSO2 Update Manager documentation](https://docs.wso2.com/display/WUM300/WSO2+Update+Manager)
in order to obtain latest bug fixes and updates for the product.

##### 3. Build the Docker image.
- Navigate to `<ANALYTICS_DOCKERFILE_HOME>` directory. <br>
  Execute `docker build` command as shown below.
    + `docker build -t wso2am-analytics:2.6.0-centos .`
    
##### 4. Running the Docker image.
- `docker run -it -p 9444:9444 wso2am-analytics:2.6.0-centos`
>Here, only port 9444 has been mapped to a Docker host port. You may map other container service ports, which have been exposed to Docker host ports, as desired.

## How to update configurations
Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `carbon.xml` is as follows.

##### 1. Stop the API Manager Analytics container if it's already running.
In WSO2 API Manager Analytics 2.6.0 product distribution, `deployment.yaml` configuration file <br>
can be found at `<DISTRIBUTION_HOME>/conf/worker`. Copy the file to some suitable location of the host machine, <br>
referred to as `<SOURCE_CONFIGS>/deployment.yaml` and change the offset value under ports to 2.

##### 2. Grant read permission to `other` users for `<SOURCE_CONFIGS>/deployment.yaml`
```
chmod o+r <SOURCE_CONFIGS>/deployment.yaml
```

##### 3. Run the image by mounting the file to container as follows.
```
docker run 
-p 7713:7713
--volume <SOURCE_CONFIGS>/deployment.yaml:<TARGET_CONFIGS>/deployment.yaml
wso2am-analytics:2.6.0-centos
```

>In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2am-analytics-2.6.0/repository/conf folder of the container.


## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
