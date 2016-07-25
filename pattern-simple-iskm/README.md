### This repository contains API Manager 1.10.0 with Identity Server 5.1.0 pre packaged Key Manager deployment with Docker compose

![alt tag](https://github.com/wso2-support/deployment-patterns/blob/master/wso2am/1.10.0/patterns/design/is-askm.png)

#### How to run

 ```docker login dockerhub.private.wso2.com ```

 ```docker-compose up ```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* All in one container for APIM Publisher , Store, APIM Gateway Manager/Worker.
* API Manager feature installed Identity Server instance as Key Management node. 
* Nginx Load Balancer container and points the Publisher,Store,Gateway through the load balancer.



#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1 api-manager
127.0.0.1 key-manager
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


Gateway

```
https://api-manager:8243
```


KeyManager 
```
https://key-manager/carbon
```


