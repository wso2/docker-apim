# Dockerfile for WSO2 API Manager - Traffice Manager #

This section defines the step-by-step instructions to build an [Alpine](https://hub.docker.com/_/alpine/) Linux based Docker image for WSO2 API Manager - Traffic Manager 4.5.0.

## Prerequisites

* [Docker](https://www.docker.com/get-docker) v20.10.x or above
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) client

## How to build an image and run

#### 1. Checkout this repository into your local machine using the following Git client command.

```
git clone https://github.com/wso2/docker-apim.git
```

> The local copy of the `dockerfiles/alpine/apim-tm` directory will be referred to as `AM_DOCKERFILE_HOME` from this point onwards.

#### 2. Build the Docker image.

- Download wso2am-tm-4.5.0.zip from [here](https://wso2.com/api-management/install/)
- Host the product pack using a webserver.
- Navigate to `<AM_DOCKERFILE_HOME>` directory. <br>
- Execute `docker build` command as shown below.

```
docker build -t wso2am-tm:4.5.0-alpine .
```

> By default, the Docker image will prepackage the General Availability (GA) release version of the relevant WSO2 product.

> Note:- wso2am-tm:4.5.0-alpine image can only be built on amd64(x86_64). It is not supported to be built or run natively on Apple silicon. But it is possible to build an amd64 image using [Docker buildx](https://docs.docker.com/desktop/multi-arch/) and then run via emulation on rosetta. Use following command.

```
docker buildx build --platform linux/amd64 -t wso2am-tm:4.5.0-alpine .
```

#### 3. Running the Docker image.

```
docker run -it -p 9443:9443 -p 9611:9611 -p 5672:5672 -p 9711:9711 wso2am-tm:4.5.0-alpine
```

> Here, only port 9443 (HTTPS servlet transport) and ports 9611, 5672, 9711 have been mapped to Docker host ports.
You may map other container service ports, which have been exposed to Docker host ports, as desired.

#### 4. Accessing management console.

- To access the management console, use the docker host IP and port 9443.
    + `https://<DOCKER_HOST>:9443/carbon`
    
> In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.

## How to update configurations

Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `deployment.toml` is as follows:

#### 1. Stop the API Manager container if it's already running.

In WSO2 API Manager version 4.5.0 product distribution, `deployment.toml` configuration file <br>
can be found at `<DISTRIBUTION_HOME>/repository/conf`. Copy the file to some suitable location of the host machine, <br>
referred to as `<SOURCE_CONFIGS>/deployment.toml` and change the offset value (`[server]->offset`) to 1.

#### 2. Grant read permission to `other` users for `<SOURCE_CONFIGS>/deployment.toml`.

```
chmod o+r <SOURCE_CONFIGS>/deployment.toml
```

#### 3. Run the image by mounting the file to container as follows:

```
docker run -it \
-p 9444:9444 \
-p 8244:8244 \
--volume <SOURCE_CONFIGS>/deployment.toml:<TARGET_CONFIGS>/deployment.toml \
wso2am-tm:4.5.0-alpine
```

> In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2am-tm-4.5.0/repository/conf folder of the container.

## WSO2 Private Docker images

If you have a valid WSO2 subscription you can have access to WSO2 private Docker images. These images will get updated frequently with bug fixes, security fixes and new improvements. To view available images visit [WSO2 Docker Repositories](https://docker.wso2.com/)

## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
* [Docker buildx reference](https://docs.docker.com/buildx/working-with-buildx/)
