### This repository contains API Manager 2.0.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/master/docker-compose/patterns/design/am-2.0-pattern-3.png)

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
127.0.0.1 gateway-worker gateway-manager publisher store keymanager traffic-manager analytics
```
If you are using docker machine, please use the docker machine IP instead of the local machine IP.

#### How to access the environment

Publisher

```
https://publisher:9445/publisher
```

Store

```
https://store:9446/store
```

Gateway Manager

```
https://gateway-manager:9444/carbon
```

Gateway Worker

```
https://gateway-worker:8243
http://gateway-worker:8280
```

Key Manager

```
https://keymanager:9443/carbon
```

Traffic Manager

```
https://traffic-manager:9447/carbon
```

AM Analytics

```
https://analytics:9448/carbon
```

## How to run in Docker Swarm Cluster

### Setup Docker Swarm Cluster in Amazon AWS

https://beta.docker.com/docs/aws/

### Deploy on Swarm

Change docker-compose-swarm.yml image names according to your docker private registry or public registry.

eg. If you have a docker public registry account (say account name is "lakwarus"), you can change images as following

```
docker.wso2.com/swarm-apim-pattern3-mysql:5.5			-> lakwarus/swarm-apim-pattern3-mysql:5.5
docker.wso2.com/swarm-apim-pattern3-am-analytics:2.0.0		-> lakwarus/swarm-apim-pattern3-am-analytics:2.0.0
docker.wso2.com/swarm-apim-pattern3-traffic-manager:2.0.0	-> lakwarus/swarm-apim-pattern3-traffic-manager:2.0.0
docker.wso2.com/swarm-apim-pattern3-keymanager:2.0.0		-> lakwarus/swarm-apim-pattern3-keymanager:2.0.0
docker.wso2.com/swarm-apim-pattern3-gateway-manager:2.0.0	-> lakwarus/swarm-apim-pattern3-gateway-manager:2.0.0
docker.wso2.com/swarm-apim-pattern3-gateway-worker:2.0.0	-> lakwarus/swarm-apim-pattern3-gateway-worker:2.0.0
docker.wso2.com/swarm-apim-pattern3-gateway-worker:2.0.0	-> lakwarus/swarm-apim-pattern3-gateway-worker:2.0.0
docker.wso2.com/swarm-apim-pattern3-store:2.0.0			-> lakwarus/swarm-apim-pattern3-store:2.0.0
docker.wso2.com/swarm-apim-pattern3-publisher:2.0.0		-> lakwarus/swarm-apim-pattern3-publisher:2.0.0

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

Copy pattern3.dab file to docker swarm manager node and run following

To deploy all docker services on swarm cluster
```
docker deploy pattern3
```
To update AWS ELB endpoits
```
docker service update --publish-add 9448:9444 pattern3_analytics
docker service update --publish-add 9447:9443 pattern3_traffic-manager
docker service update --publish-add 9444:9443 pattern3_gateway-manager
docker service update --publish-add 8280:8280 pattern3_gateway-worker
docker service update --publish-add 8243:8243 pattern3_gateway-worker
docker service update --publish-add 9446:9443 pattern3_store
docker service update --publish-add 9445:9443 pattern3_publisher
```
#### How to test

Update your DNS (or add host entries) by poining following domain names
```
gateway-worker gateway-manager publisher store keymanager traffic-manager analytics
```
to AWS ELB IP.  

#### How to access the environment

Publisher

```
https://publisher:9445/publisher
```

Store

```
https://store:9446/store
```

Gateway Manager

```
https://gateway-manager:9444/carbon
```

Gateway Worker

```
https://gateway-worker:8243
http://gateway-worker:8280
```

Key Manager

```
https://keymanager:9443/carbon
```

Traffic Manager

```
https://traffic-manager:9447/carbon
```

AM Analytics

```
https://analytics:9448/carbon
```