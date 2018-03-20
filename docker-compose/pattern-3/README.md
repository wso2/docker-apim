### This repository contains API Manager 2.2.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/2.1.x/docker-compose/patterns/design/am-2.2.0-pattern-3.jpeg)

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
127.0.0.1 gateway-worker gateway-manager publisher store keymanager traffic-manager analytics apim_rdbms
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
