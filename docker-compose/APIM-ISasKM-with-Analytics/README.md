# WSO2 API Manager with Identity Server as Key Manager


## Prerequisites

 * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   are required for steps described in following Quick start guide.
 * In order to run the Docker Compose setup, you will need an active subscription from WSO2 since the Docker 
   images hosted at docker.wso2.com contains the latest updates and fixes to WSO2 API Manager 2.1.0, API Manager 
   Analytics 2.1.0 and WSO2 Identity Server as KM 5.3.0. You can sign up for a Free Trial Subscription [here](https://wso2.com/free-trial-subscription).
 * If you wish to run the Docker Compose setup using Docker images built locally, build Docker images using [WSO2 API Manager Dockerfile](../../dockerfiles/apim/README.md), [API Manager Analytics Dockerfile](../../dockerfiles/apim-analytics/README.md) and 
  [WSO2 Identity Server as KM Dockerfile](../../dockerfiles/is-as-km/README.md) and remove the `docker.wso2.com/` prefix 
  from the `image` name In the `docker-compose.yml`. For example, change the line `image: docker.wso2.com/wso2am:2.1.0` to `image: wso2am:2.1.0`  
## Quick Start Guide

1. Clone WSO2 API Manager Docker git repository.
    ```
    git clone https://github.com/wso2/docker-apim
    ```

2. Switch to the docker-compose/APIM-ISasKM-with-Analytics folder:
    ```
    cd docker-apim/docker-compose/APIM-ISasKM-with-Analytics
    ```

3. Execute the following Docker Compose command to start the deployment:
    ```
    docker-compose up
    ```

4. Add the following host entry to the /etc/hosts file.
    ```
    127.0.0.1 api-manager
    ```
5. Access the API Publisher and Store via the URLs given below.

    * API Publisher
    ```
    https://api-manager:9443/publisher
    ```

    * API Store
    ```
    https://api-manager:9443/store/
    ```
    
    * API Carbon Console
    ```
    https://api-manager:9443/carbon/
    ```
    
    * API Admin
    ```
    https://api-manager:9443/admin/
    ```
    
    Please note that WSO2 API Manager Gateway will be available on following ports.
    ```
     https://api-manager:8243
     https://api-manager:8280
    ```
WSO2 API Manager will use the WSO2 Identity Server to generate OAuth2 tokens and validate those token during API invocations.
