### This repository contains API Manager 2.0.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/master/docker-compose/patterns/design/am-2.0-pattern-9.png)

#### How to run

 ```docker login docker.wso2.com ```

 ```docker-compose up -d```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* APIM Store, Publisher, Gateway Manager, Gateway Worker, Keymanager, Traffic Manager distributed Containers
* APIM Analytics Container
* Nginx Load Balancer container and points the APIM components through the load balancer.


#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1	gateway-manager publisher store keymanager-tm-gw analytics
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
https://keymanager-tm-gw:8243
http://keymanager-tm-gw:8280
```

Key Manager/ Traffic Manager

```
https://keymanager-tm-gw:9443/carbon
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
docker.wso2.com/swarm-apim-pattern9-mysql:5.5				-> lakwarus/swarm-apim-pattern9-mysql:5.5
docker.wso2.com/svnrepo										-> lakwarus/svnrepo
docker.wso2.com/swarm-apim-pattern9-wso2am-analytics:2.0.0	-> lakwarus/swarm-apim-pattern9-wso2am-analytics:2.0.0
docker.wso2.com/swarm-apim-pattern9-keymanager-tm-gw:2.0.0	-> lakwarus/swarm-apim-pattern9-keymanager-tm-gw:2.0.0
docker.wso2.com/swarm-apim-pattern9-gateway-manager:2.0.0	-> lakwarus/swarm-apim-pattern9-gateway-manager:2.0.0
docker.wso2.com/swarm-apim-pattern9-store:2.0.0				-> lakwarus/swarm-apim-pattern9-store:2.0.0
docker.wso2.com/swarm-apim-pattern9-publisher:2.0.0			-> lakwarus/swarm-apim-pattern9-publisher:2.0.0

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

Copy pattern9.dab file to docker swarm manager node and run following

To deploy all docker services on swarm cluster
```
docker deploy pattern9
```
To update AWS ELB endpoits
```
docker service update --publish-add 9448:9444 pattern9_analytics
docker service update --publish-add 9443:9443 pattern9_keymanager-tm-gw
docker service update --publish-add 8280:8280 pattern9_keymanager-tm-gw
docker service update --publish-add 8243:8243 pattern9_keymanager-tm-gw
docker service update --publish-add 9444:9443 pattern9_gateway-manager
docker service update --publish-add 9446:9443 pattern9_store
docker service update --publish-add 9445:9443 pattern9_publisher


#### How to test

Update your DNS (or add host entries) by poining following domain names,
```
gateway-manager publisher store keymanager-tm-gw analytics
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
https://keymanager-tm-gw:8243
http://keymanager-tm-gw:8280
```

Key Manager/ Traffic Manager

```
https://keymanager-tm-gw:9443/carbon
```

AM Analytics

```
https://analytics:9448/carbon
```