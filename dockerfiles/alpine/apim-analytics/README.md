# Dockerfile for WSO2 API Manager #
The section defines the step-by-step instructions to build an Alpine OpenJDK Docker image for WSO2 API Manager Analytics 2.5.0.

## Prerequisites


* [Docker](https://www.docker.com/get-docker) v17.09.0 or above
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) client

## How to build an image and run
##### 1. Checkout this repository into your local machine using the following Git command.
```
git clone https://github.com/wso2/docker-apim.git
```

>The local copy of the `dockerfile/apim-analytics` directory will be referred to as `ANALYTICS_DOCKERFILE_HOME` from this point onwards.

>Please refer to [WSO2 Update Manager documentation](https://docs.wso2.com/display/WUM300/WSO2+Update+Manager)
in order to obtain latest bug fixes and updates for the product.

##### 2. Build the Docker image.
- Navigate to `<ANALYTICS_DOCKERFILE_HOME>` directory. <br>
  Execute `docker build` command as shown below.

  + `docker build -t wso2am-analytics:2.5.0-alpine .`

##### 3. Running the Docker image.
- docker run -it -p 9444:9444 wso2am-analytics:2.5.0-alpine

##### 4. Accessing management console.
- To access the management console, use the docker host IP and port 9444.
    + `https:<DOCKER_HOST>:9444/carbon`
    
>In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.

## How to update configurations
Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `carbon.xml` is as follows.

##### 1. Stop the API Manager container if it's already running.
In WSO2 API Manager Analytics 2.5.0 product distribution, `carbon.xml` configuration file <br>
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
wso2am-analytics:2.5.0-alpine
```

>In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2am-analytics-2.5.0/repository/conf folder of the container.


## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
