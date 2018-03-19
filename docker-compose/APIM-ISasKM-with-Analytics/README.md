# WSO2 API Manager with Identity Server as Key Manager


## Prerequisites

 * [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose) are required for running this Docker Compose template.

## Quick Start Guide

1. Build the WSO2 API Manager 2.1.0 and API Manager Analytics 2.1.0 and WSO2 Identity Server as KM 5.3.0 docker images:

  *  [WSO2 API Manager Dockerfile](../../dockerfiles/apim/README.md)
  *  [WSO2 API Manager Analytics Dockerfile](../../dockerfiles/apim-analytics/README.md)
  *  [WSO2 IS as KM](../../dockerfiles/is-as-km/README.md)
 
  > In order to run the Docker Compose configuration, you will need a Subscription from WSO2 since the Docker images hosted at docker.wso2.com contains the latest updates and fixes to WSO2 API Manager 2.1.0, API Manager Analytics 2.1.0 and WSO2 Identity Server as KM 5.3.0. You can sign up for a Free Trial Subscription [here](https://wso2.com/free-trial-subscription)
 
  > If you wish to run the Docker Compose configuration using Docker images built locally, remove the `docker.wso2.com/` prefix from the `image` name In the `docker-compose.yml`, 
  
  > For example, change the line `image: docker.wso2.com/wso2am:2.1.0` to `image: wso2am:2.1.0`
  
2. Pull MySQL Docker image:
     ```
     docker pull mysql:5.7.19
     ```

3. Switch to the docker-compose/apim-is-as-km folder:
    ```
    cd [docker-apim]/docker-compose/apim-is-as-km
    ```

4. Execute the following Docker Compose command to start the deployment:
    ```
    docker-compose up
    ```

5. Add the following host entry to the /etc/hosts file.
    ```
    127.0.0.1 api-manager
    ```
6. Access the API Publisher and Store via the URLs given below.

    * API Publisher
    ```
    https://api-manager:9443/publisher
    ```

    * API Store
    ```
    https://api-manager:9443/store/
    ```

WSO2 API Manager will use the WSO2 Identity Server to generate OAuth2 tokens and validate those token during API invocations.
