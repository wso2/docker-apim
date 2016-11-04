## Important: This Pattern need to review

### This repository contains API Manager 2.0.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/master/docker-compose/patterns/design/am-2.0-pattern-5.png)

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
* APIM Store, Publisher, Gateway Manager, Gateway Worker/ Key manager, Traffic Manager distributed Containers
* APIM Analytics Container
* Nginx Load Balancer container and points the APIM components through the load balancer.


#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1 gateway-km.apim.wso2.com mgt.gateway.apim.wso2.com publisher.apim.wso2.com store.apim.wso2.com trafficm.apim.wso2.com analytics.apim.wso2.com
```
If you are using docker machine, please use the docker machine IP instead of the local machine IP.

#### How to access the environment

Publisher

```
https://publisher.apim.wso2.com/publisher
```

Store

```
https://store.apim.wso2.com/store
```

Gateway Manager

```
https://mgt.gateway.apim.wso2.com/carbon
```

Gateway Worker/ Keymanager

```
https://gateway-km.apim.wso2.com/carbon

https://gateway-km.apim.wso2.com:8243
http://gateway-km.apim.wso2.com:8280
```

Traffic Manager

```
https://trafficm.apim.wso2.com/carbon
```

AM Analytics

```
https://analytics.apim.wso2.com:9444/carbon
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
docker service update --publish-add 9448:9444 pattern3_analytics
docker service update --publish-add 9447:9443 pattern3_traffic-manager
docker service update --publish-add 9444:9443 pattern3_gateway-manager
docker service update --publish-add 8280:8280 pattern3_gateway-worker
docker service update --publish-add 8243:8243 pattern3_gateway-worker
docker service update --publish-add 9446:9443 pattern3_store
docker service update --publish-add 9445:9443 pattern3_publisher
```
#### How to access the environment
Update your DNS (or add host entries) by poining following domain name (gateway.apim.wso2.com mgt.gateway.apim.wso2.com publisher.apim.wso2.com store.apim.wso2.com keymanager.apim.wso2.com trafficm.apim.wso2.com analytics.apim.wso2.com) to AWS ELB IP.  



