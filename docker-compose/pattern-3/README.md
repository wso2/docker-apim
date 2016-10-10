### This repository contains API Manager 2.0.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2-support/deployment-patterns/blob/master/wso2am/2.0.0/patterns/design/am-2.0-pattern-2.png)

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
127.0.0.1 gateway.apim.wso2.com mgt.gateway.apim.wso2.com publisher.apim.wso2.com store.apim.wso2.com keymanager.apim.wso2.com trafficm.apim.wso2.com analytics.apim.wso2.com
```
If you are using docker machine, please use the docker machine IP instead of the local machine IP.

#### How to access the environment

Publisher

```
https://publisher.apim.wso2.com:9445/publisher
```

Store

```
https://store.apim.wso2.com:9446/store
```

Gateway Manager

```
https://mgt.gateway.apim.wso2.com:9444/carbon
```

Gateway Worker

```
https://gateway.apim.wso2.com:8243
http://gateway.apim.wso2.com:8280
```

Key Manager

```
https://keymanager.apim.wso2.com:9443/carbon
```

Traffic Manager

```
https://trafficm.apim.wso2.com:9447/carbon
```

AM Analytics

```
https://analytics.apim.wso2.com:9448/carbon
```

## How to run in Docker Swarm Cluster

### Setup Docker Swarm Cluster in Amazon AWS

https://beta.docker.com/docs/aws/

### Deploy on Swarm

Change docker-compose-swarm.yml image names according to your docker private registry or public registry.

eg. If you have a docker public registry account (say account name is "lakwarus"), you can change images as following

```
docker.wso2.com/swarm-apim-pattern1-wso2am:2.0.0	-> lakwarus/swarm-apim-pattern1-wso2am:2.0.0
docker.wso2.com/swarm-apim-pattern1-mysql:5.5		-> lakwarus/swarm-apim-pattern1-mysql:5.5
```
To build all docker images
```
docker-compose -f docker-compose-swarm.yml build
```

To push newly built images to relevant docker registry
```
docker-compose -f docker-compose-swarm.yml push
```

To create bundle file

```
docker-compose -f docker-compose-swarm.yml bundle
```

Copy pattern1.dab file to docker swarm manager node and run following

To deploy all docker services on swarm cluster
```
docker deploy pattern1
```
To update AWS ELB endpoits
```
docker service update --publish-add 443:9443 pattern1_api-manager
docker service update --publish-add 80:9763 pattern1_api-manager
docker service update --publish-add 8280:8280 pattern1_api-manager
docker service update --publish-add 8243:8243 pattern1_api-manager
```
#### How to access the environment
Update your DNS (or add host entries) by poining "api-manager" domain name to AWS ELB IP.  

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

