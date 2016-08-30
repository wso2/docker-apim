### This repository contains API Manager 1.10.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2-support/deployment-patterns/blob/master/wso2am/1.10.0/patterns/design/pattern-4.png)

#### How to run

 ```docker login dockerhub.private.wso2.com ```

 ```docker-compose up --build```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* Separate containers for APIM Publisher , Store, Keymanager
* Separate containers for APIM Gateway Manager/Worker
* SVN server on a separate container and create svn repo
* Nginx Load Balancer container and points the Publisher,Store,Gateway through the load balancer.



#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1 apim-front-publisher
127.0.0.1 apim-front-store
127.0.0.1 apim-gateway-worker
127.0.0.1 apim-external-gateway-worker
127.0.0.1 mgt.gw.apim.wso2.org
127.0.0.1 mgt.external.gw.apim.wso2.org
127.0.0.1 apim-external-store
```
If you are using docker machine, please use the docker machine IP instead of the local machine IP.

#### How to access the environment

Publisher

```
https://apim-front-publisher/publisher
```

Store

```
https://apim-front-store/store/
```


Sandbox Gateway

```
https://mgt.gw.apim.wso2.org/carbon
```

Production Gateway

```
https://mgt.external.gw.apim.wso2.org/carbon
```


External store
```
https://apim-external-store/carbon
```




