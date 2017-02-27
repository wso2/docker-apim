### This repository contains API Manager 2.1.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/master/docker-compose/patterns/design/am-2.1.0-pattern-05.png)

#### How to run

```docker login docker.wso2.com ```

```docker-compose up -d```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* APIM Store, Publisher, Gateway Manager, Gateway Worker/ Key manager, Traffic Manager distributed Containers
* APIM Analytics Container
* Nginx Load Balancer container and points the APIM components through the load balancer.


#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1	apim_rdbms gateway-worker-km gateway-manager publisher store traffic-manager analytics
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

Gateway Worker/ Keymanager
```
https://gateway-worker-km:9443/carbon

https://gateway-worker-km:8243
http://gateway-worker-km:8280
```

Traffic Manager
```
https://traffic-manager:9447/carbon
```

AM Analytics
```
https://analytics:9444/carbon
```
