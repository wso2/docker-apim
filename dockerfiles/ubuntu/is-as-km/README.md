# Dockerfile for WSO2 Identity Server deployed as the API Key Manager #
This section defines the step-by-step instructions to build an [Ubuntu](https://hub.docker.com/_/ubuntu/) Linux based Docker image for WSO2 IS deployed as API Key Manager.

## Prerequisites

* [Docker](https://www.docker.com/get-docker) v17.09.0 or above


## How to build an image and run
##### 1. Checkout this repository into your local machine using the following git command.
```
git clone https://github.com/wso2/docker-apim.git
```

>The local copy of the `dockerfiles/ubuntu/is-as-km` directory will be referred to as `IS_KM_DOCKERFILE_HOME` from this point onwards.


##### 2. Add WSO2 Identity Server as Key Manager distribution and MySQL connector to `<IS_KM_DOCKERFILE_HOME>/files`.

- Download [WSO2 Identity Server as Key Manager v5.7.0](https://wso2.com/api-management/install/key-manager/)
distribution and extract it to `<IS_KM_DOCKERFILE_HOME>/files`.
- Download [MySQL Connector/J](https://downloads.mysql.com/archives/c-j)
and copy that to `<IS_KM_DOCKERFILE_HOME>/files`.
- Once all of these are in place, it should look as follows:

    ```bash
    <IS_KM_DOCKERFILE_HOME>/files/wso2is-km-5.7.0/
    <IS_KM_DOCKERFILE_HOME>/files/mysql-connector-java-<version>-bin.jar
    ```
    
>Please refer to [WSO2 Update Manager documentation]( https://docs.wso2.com/display/WUM300/WSO2+Update+Manager)
in order to obtain latest bug fixes and updates for the product.

##### 3. Build the Docker image.
- Navigate to `<IS_KM_DOCKERFILE_HOME>` directory. <br>
  Execute `docker build` command as shown below.
    + `docker build -t wso2is-km:5.7.0 .`
    
##### 4. Running the Docker image.
- `docker run -it -p 9443:9443 wso2is-km:5.7.0`

##### 5. Accessing management console.
- To access the management console, use the docker host IP and port 9443.
    + `https:<DOCKER_HOST>:9443/carbon`
    
>In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.


## How to update configurations
Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `carbon.xml` is as follows.

##### 1. Stop the Identity Server as Key Manager container if it's already running.
In WSO2 Identity Server as Key Manager 5.7.0 product distribution, `carbon.xml` configuration file <br>
can be found at `<DISTRIBUTION_HOME>/repository/conf`. Copy the file to some suitable location of the host machine, <br>
referred to as `<SOURCE_CONFIGS>/carbon.xml` and change the offset value under ports to 1.

##### 2. Grant read permission to `other` users for `<SOURCE_CONFIGS>/carbon.xml`
```
chmod o+r <SOURCE_CONFIGS>/carbon.xml
```

##### 3. Run the image by mounting the file to container as follows.
```
docker run \
-p 9444:9444 \
--volume <SOURCE_CONFIGS>/carbon.xml:<TARGET_CONFIGS>/carbon.xml \
wso2is-km:5.7.0
```

>In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2is-km-5.7.0/repository/conf folder of the container.


## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
