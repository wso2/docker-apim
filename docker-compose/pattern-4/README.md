
## Important: This Pattern need to review

### This repository contains API Manager 2.0.0 distributed deployment with Docker compose

![alt tag](https://github.com/wso2/docker-apim/blob/master/docker-compose/patterns/design/am-2.0-pattern-4.png)

#### How to run

 ```docker login dockerhub.private.wso2.com ```

 ```docker-compose up -d```

This will deploy the following,

* Mysql server (container) with apimdb, userdb, regdb
* SVN containers in internal and dmz
* APIM Store, Publisher, Gateway Manager, Gateway Worker, Keymanager, Traffic Manager distributed Containers
* DMZ Gateway Manager and DMZ Gateway Worker
* APIM Analytics Container
* Nginx Load Balancer container and points the APIM components through the load balancer.


#### How to test

Add the following entries to the /etc/hosts
```
127.0.0.1 gateway.apim.wso2.com mgt.gateway.apim.wso2.com publisher.apim.wso2.com store.apim.wso2.com keymanager.apim.wso2.com trafficm.apim.wso2.com analytics.apim.wso2.com
127.0.0.1 gateway-dmz.apim.wso2.com mgt.gateway-dmz.apim.wso2.com
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

Gateway Worker

```
https://gateway.apim.wso2.com:8243
http://gateway.apim.wso2.com:8280
```

Gateway Manager DMZ

```
https://mgt.gateway-dmz.apim.wso2.com:9445/carbon
```

Gateway Worker DMZ

```
https://gateway-dmz.apim.wso2.com:8243
http://gateway-dmz.apim.wso2.com:8280
```

Key Manager

```
https://keymanager.apim.wso2.com/carbon
```

Traffic Manager

```
https://trafficm.apim.wso2.com/carbon
```

AM Analytics

```
https://analytics.apim.wso2.com:9444/carbon
```
