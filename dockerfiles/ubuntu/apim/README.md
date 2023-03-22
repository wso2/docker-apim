# Dockerfile for WSO2 API Manager #

This section defines the step-by-step instructions to build an [Ubuntu](https://hub.docker.com/_/ubuntu/) Linux based Docker image for WSO2 API Manager 4.2.0.

## Prerequisites

* [Docker](https://www.docker.com/get-docker) v17.09.0 or above
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) client

## How to build an image and run

#### 1. Checkout this repository into your local machine using the following Git client command.

```
git clone https://github.com/wso2/docker-apim.git
```

> The local copy of the `dockerfiles/ubuntu/apim` directory will be referred to as `AM_DOCKERFILE_HOME` from this point onwards.

#### 2. Build the Docker image.

- Download wso2am-4.2.0.zip from [here](https://wso2.com/api-management/install/)
- Host the product pack using a webserver.
- Navigate to `<AM_DOCKERFILE_HOME>` directory. <br>
- Change <APIM_DIST_URL> in Dockerfile to the URL of the product pack.
  Execute `docker build` command as shown below.
```
docker build -t wso2am:4.2.0 .
```
    
> By default, the Docker image will prepackage the General Availability (GA) release version of the relevant WSO2 product.
    
#### 3. Running the Docker image.

```
docker run -it -p 9443:9443 -p 8243:8243 wso2am:4.2.0
```

> Here, only port 9443 (HTTPS servlet transport) and port 8243 (Passthrough or NIO HTTPS transport) have been mapped to Docker host ports.
You may map other container service ports, which have been exposed to Docker host ports, as desired.

#### 4. Accessing management console.

- To access the management console, use the docker host IP and port 9443.
    + `https://<DOCKER_HOST>:9443/carbon`
    
> In here, <DOCKER_HOST> refers to hostname or IP of the host machine on top of which containers are spawned.

## How to update configurations

Configurations would lie on the Docker host machine and they can be volume mounted to the container. <br>
As an example, steps required to change the port offset using `deployment.toml` is as follows:

#### 1. Stop the API Manager container if it's already running.

In WSO2 API Manager version 4.2.0 product distribution, `deployment.toml` configuration file <br>
can be found at `<DISTRIBUTION_HOME>/repository/conf`. Copy the file to some suitable location of the host machine, <br>
referred to as `<SOURCE_CONFIGS>/deployment.toml` and change the offset value (`[server]->offset`) to 1.

#### 2. Grant read permission to `other` users for `<SOURCE_CONFIGS>/deployment.toml`.

```
chmod o+r <SOURCE_CONFIGS>/deployment.toml
```

#### 3. Run the image by mounting the file to container as follows:

```
docker run \
-p 9444:9444 \
-p 8244:8244 \
--volume <SOURCE_CONFIGS>/deployment.toml:<TARGET_CONFIGS>/deployment.toml \
wso2am:4.2.0
```

> In here, <TARGET_CONFIGS> refers to /home/wso2carbon/wso2am-4.2.0/repository/conf folder of the container.

## How to build a Docker image with multi architecture support

The above wso2am:4.2.0 image will only be supported for the CPU architecture of your current machine. Docker buildx plugin can be used to build wso2am:4.2.0 image to support any CPU architecture.

#### 1. Install [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)

#### 2. Install [QEMU Emulators](https://github.com/tonistiigi/binfmt)
```
docker run -it --rm --privileged tonistiigi/binfmt --install all
```

#### 3. Create, switch and inspect a new builder
```
docker buildx create --name wso2ambuilder
```
```
docker buildx use wso2ambuilder
```
```
docker buildx inspect --bootstrap
```
#### 4. Build and push 

```
docker buildx build --platform linux/amd64,linux/arm64 -t <DOCKER_USERNAME>/wso2am:4.2.0-multiarch --push .
```

> - Here <DOCKER_USERNAME> is a valid Docker or Dockerhub username.
> - Use command "docker login" to authenticate first if it fails to push.
> - You can specify any number of platforms to support --platform flag
> - Use command "docker buildx ls" to see list of existing builders and supported platforms.
> - Please note we have only tested this for linux/amd64 and linux/arm64 platforms only

#### 5. Run
```
docker run -it -p 9443:9443 -p 8243:8243 <DOCKER_USERNAME>/wso2am:4.2.0-multiarch
```
> Docker will pull the suitable image for the architecture and run

> **Note**
> If you are using Rancher to run the Docker image, you will not be able to use port 9443, which is already allocated by Rancher. As a workaround, you can follow the instructions given in [How to update configurations](#how-to-update-configurations) to run the APIM image in a different port.

## Running official wso2am images
It is possible to use official wso2am images without building them from the scratch.

- To run on amd64
```
docker run -it -p 9443:9443 -p 8243:8243 wso2/wso2am:4.2.0
```

- To run on native Apple Silicon ( arm64 )
```
docker run -it -p 9443:9443 -p 8243:8243 wso2/wso2am:4.2.0-multiarch
```


## WSO2 Private Docker images

If you have a valid WSO2 subscription you can have access to WSO2 private Docker images. These images will get updated frequently with bug fixes, security fixes and new improvements. To view available images visit [WSO2 Docker Repositories](https://docker.wso2.com/)

## Docker command usage references

* [Docker build command reference](https://docs.docker.com/engine/reference/commandline/build/)
* [Docker run command reference](https://docs.docker.com/engine/reference/run/)
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
* [Docker multi architecture build reference](https://docs.docker.com/desktop/multi-arch/)
* [Docker buildx reference](https://docs.docker.com/buildx/working-with-buildx/)
