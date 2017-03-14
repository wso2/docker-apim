
## Important: This Pattern need to review

### This repository contains API Manager 2.1.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/2.1.x/docker-compose/patterns/design/am-2.1.0-pattern-4.jpeg)

#### How to run

 ```docker login docker.wso2.com ```

 ```docker-compose up -d```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* SVN containers in internal and dmz
* APIM Store, Publisher, Gateway Manager, Gateway Worker, Keymanager, Traffic Manager distributed Containers
* Multi Gateway Manager and Multi Gateway Worker
* APIM Analytics Container
* Nginx Load Balancer container and points the APIM components through the load balancer.


#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1 gateway-worker gateway-manager publisher.apim.wso2.com store.apim.wso2.com keymanager.apim.wso2.com trafficm.apim.wso2.com analytics.apim.wso2.com apim_rdbms
127.0.0.1 gateway-worker-2 gateway-manager-2
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

Gateway Manager One

```
https://gateway-manager/carbon
```

Gateway Worker One

```
https://gateway-worker:8243
http://gateway-worker:8280
```

Gateway Manager Two

```
https://gateway-manager-2:9445/carbon
```

Gateway Worker Two

```
https://gateway-worker-2:8243
http://gateway-worker-2:8280
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
https://analytics.apim.wso2.com:9444/carbon
```
