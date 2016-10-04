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

