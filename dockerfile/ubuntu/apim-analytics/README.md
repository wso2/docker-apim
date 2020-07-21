# Dockerfile for WSO2 API Manager Analytics #
The section defines the step-by-step instructions to build the Docker image for WSO2 API Manager Analytics 2.1.0.

## Prerequisites
* [Docker](https://www.docker.com/get-docker) v17.09.0 or above
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) client
* WSO2 API Manager Analytics pack downloaded through [WUM](https://wso2.com/wum/download)
* Download JDK 8 through [Oracle](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)
  - Host the downloaded pack and JDK locally or on a remote location.
>The hosted product pack location and JDK location will be passed as the build arguments WSO2_SERVER_DIST_URL and JDK_URL when building the Docker image.

## How to build an image and run
##### 1. Checkout this repository into your local machine using the following git command.
```
git clone https://github.com/wso2/docker-apim.git
```

>The local copy of the `dockerfile/apim` directory will be referred to as `ANALYTICS_DOCKERFILE_HOME` from this point onwards.

>Please refer to [WSO2 Update Manager documentation](https://docs.wso2.com/display/updates/Getting+Started)
in order to obtain latest bug fixes and updates for the product.

##### 2. Build the Docker image.
- Navigate to `<ANALYTICS_DOCKERFILE_HOME>` directory. <br>
  Execute `docker build` command as shown below.
  
  + `docker build --build-arg WSO2_SERVER_DIST_URL=<URL_OF_THE_HOSTED_LOCATION/FILENAME> JDK_URL=<URL_OF_THE_HOSTED_JDK_LOCATION/FILENAME> -t wso2am-analytics:2.1.0 .`
    - eg:- Hosted locally: docker build --build-arg WSO2_SERVER_DIST_URL=http://172.17.0.1:8000/wso2am-analytics-2.1.0.zip JDK_URL=http://172.17.0.1:8000/jdk-8u261-linux-x64.tar.gz -t wso2am-analytics:2.1.0 . 
    - eg:- Hosted remotely: docker build --build-arg WSO2_SERVER_DIST_URL=http://<public_ip:port>/wso2am-analytics-2.1.0.zip JDK_URL=http://172.17.0.1:8000/jdk-8u261-linux-x64.tar.gz -t wso2am-analytics:2.1.0 .
   
##### 3. Running the Docker image.
- `docker run -it -p 9444:9444 wso2am-analytics:2.1.0`
>Here, only port 9444 (HTTPS servlet transport) has been mapped to a Docker host port.
You may map other container service ports, which have been exposed to Docker host ports, as desired.

##### 4. Accessing management console.
- To access the management console, use the docker host IP and port 9444.
    + `https:<DOCKER_HOST>:9444/carbon`
    
>In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.


## How to update configurations
Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `carbon.xml` is as follows.

##### 1. Stop the API Manager container if it's already running.
In WSO2 API Manager Analytics 2.1.0 product distribution, `carbon.xml` configuration file <br>
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
wso2am-analytics:2.1.0
```

>In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2am-analytics-2.1.0/repository/conf folder of the container.

## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
