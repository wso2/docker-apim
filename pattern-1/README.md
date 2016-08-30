### This repository contains API Manager 1.10.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2-support/deployment-patterns/blob/master/wso2am/2.0.0/patterns/design/am-2.0-pattern-1.png)

#### How to run

 ```docker login dockerhub.private.wso2.com ```

 ```docker-compose up -d```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* APIM Container
* APIM Analytics Container


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

AM Analytics

```
https://am-analytics:9444/carbon/
```
