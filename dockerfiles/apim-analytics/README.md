# Dockerfile for WSO2 API Manager Analytics #
The section defines the step-by-step instructions to build the Docker image for WSO2 API Manager Analytics 2.2.0.

## Prerequisites

* [Docker](https://www.docker.com/get-docker) v17.09.0 or above

## How to build an image and run
##### 1. Checkout this repository into your local machine using the following git command.
```
git clone https://github.com/wso2/docker-apim.git
```

>The local copy of the `dockerfile/apim-analytics` directory will be referred to as `ANALYTICS_DOCKERFILE_HOME` from this point onwards.

##### 2. Add JDK, WSO2 API Manager Analytics distributions and MySQL Connector to `<ANALYTICS_DOCKERFILE_HOME>/files`
- Download [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
and extract that to `<ANALYTICS_DOCKERFILE_HOME>/files`.
- Download the WSO2 API Manager Analytics 2.2.0 distribution (http://wso2.com/api-management/try-it/)
and extract that to `<ANALYTICS_DOCKERFILE_HOME>/files`. <br>
- Once both JDK and WSO2 API Manager distributions are extracted the folder structure should be as follows;

  ```bash
  <ANALYTICS_DOCKERFILE_HOME>/files/jdk<version>/
  <ANALYTICS_DOCKERFILE_HOME>/files/wso2am-analytics-2.2.0/
  ```
- Download [MySQL Connector/J](https://dev.mysql.com/downloads/connector/j/) v5.1.45 and then copy that to `<ANALYTICS_DOCKERFILE_HOME>/files` folder

>Please refer to [WSO2 Update Manager documentation](https://docs.wso2.com/display/ADMIN44x/Updating+WSO2+Products)
in order to obtain latest bug fixes and updates for the product.

##### 3. Build the Docker image.
- Navigate to `<ANALYTICS_DOCKERFILE_HOME>` directory. <br>
  Execute `docker build` command as shown below.
    + `docker build -t wso2am-analytics:2.2.0 .`
    
##### 4. Running the Docker image.
- `docker run -it -p 9444:9444 wso2am-analytics:2.2.0`
>Here, only port 9444 (HTTPS servlet transport) has been mapped to a Docker host port.
You may map other container service ports, which have been exposed to Docker host ports, as desired.

##### 6. Accessing management console.
- To access the management console, use the docker host IP and port 9444.
    + `https:<DOCKER_HOST>:9444/carbon`
    
>In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.


## How to update configurations
Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `carbon.xml` is as follows.

##### 1. Stop the API Manager container if it's already running.
In WSO2 API Manager Analytics 2.2.0 product distribution, `carbon.xml` configuration file <br>
can be found at `<DISTRIBUTION_HOME>/conf`. Copy the file to some suitable location of the host machine, <br>
referred to as `<SOURCE_CONFIGS>/carbon.xml` and change the offset value under ports to 1.

##### 2. Grant read permission to `other` users for `<SOURCE_CONFIGS>/carbon.xml`
```
chmod o+r <SOURCE_CONFIGS>/carbon.xml
```

##### 3. Run the image by mounting the file to container as follows.
```
docker run 
-p 9445:9445
--volume <SOURCE_CONFIGS>/carbon.xml:<TARGET_CONFIGS>/carbon.xml
wso2am-analytics:2.2.0
```

>In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2am-analytics-2.2.0/repository/conf folder of the container.


## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
