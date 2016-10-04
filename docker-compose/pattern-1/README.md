### This repository contains API Manager 2.0.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2-support/deployment-patterns/blob/master/wso2am/2.0.0/patterns/design/am-2.0-pattern-0.png)

## Pre-requisites

 * Docker 
 * Docker compose

#### Docker installation for linux
```
wget -qO- https://get.docker.com/ | sh
```

#### Docker installation for Mac

https://docs.docker.com/docker-for-mac/

#### Docker installation for Windows

https://docs.docker.com/docker-for-windows/

#### Docker Compose Installation

https://docs.docker.com/compose/install/


#### How to run

 ```docker login docker.wso2.com ```

 ```docker-compose pull```
 ```docker-compose up --build -d ```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* APIM Container
* Nginx Load Balancer container and points the APIM components through the load balancer.


#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1 api-manager
```
If you are using docker machine, please use the docker machine IP instead of the local machine IP.

#### How to access the environment

Publisher

```
https://api-manager/publisher
```

Store

```
https://api-manager/store/
```


Gateway Manager

```
https://api-manager/carbon/
```

## How to run in Docker Swarm Cluster

### Setup Docker Swarm Cluster in Amazon AWS

https://beta.docker.com/docs/aws/

### Deploy on Swarm

Change docker-compose image names according to your docker private registry or public registry.

eg. If you have a docker public registry account (say account name is "lakwarus"), you can change images as following

```
docker.wso2.com/apim-pattern1-wso2am:2.0.0	-> lakwarus/apim-pattern1-wso2am:2.0.0
docker.wso2.com/apim-pattern1-mysql:5.5		-> lakwarus/apim-pattern1-mysql:5.5
```
```
docker-compose -f docker-compose-swarm.yml build
```
This will build all docker images

```
docker-compose -f docker-compose-swarm.yml push
```

This will push newly built images to relevant docker registry

```
docker-compose -f docker-compose-swarm.yml bundle
```
This will create pattern1.dab json file

Copy dockercompose.dab file to docker swarm manager node and run following

```
docker deploy pattern1
```
This will deploy all docker services on swarm cluster

```
docker service update --publish-add 32080:80 dockercompose_admin-fe
docker service update --publish-add 32081:80 dockercompose_store-fe
docker service update --publish-add 39763:9763 dockercompose_das
```

Point your browser to AWS ELB domain with relevent ports to access deployed petstore in swarm cluster


