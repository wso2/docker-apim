# WSO2 API Manager deployment with WSO2 API Manager Analytics

![alt tag](deployment-diagram.png)

## Prerequisites

 * Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   in order to run the steps provided in following Quick start guide. <br><br>
 * In order to run this Docker Compose setup, you will need an active [Free Trial Subscription](https://wso2.com/free-trial-subscription) 
   from WSO2 since the referring Docker images hosted at docker.wso2.com contains the latest updates and fixes for WSO2 API Manager <br>and 
   API Manager Analytics 2.1.0 products. You can sign up for a Free Trial Subscription [here](https://wso2.com/free-trial-subscription). <br><br>
 * If you wish to run the Docker Compose setup using Docker images built locally, build Docker images using [WSO2 API Manager Dockerfile](../../dockerfiles/apim/README.md) and [WSO2 API Manager Analytics Dockerfile](../../dockerfiles/apim-analytics/README.md) and remove `docker.wso2.com/` prefix from the `image` name In `docker-compose.yml`.
   For example, change the line `image: docker.wso2.com/wso2am:2.1.0` <br>to `image: wso2am:2.1.0`. <br>
  
<br>

## Quick Start Guide

1. Clone WSO2 API Manager Docker git repository.
   ```
   git clone https://github.com/wso2/docker-apim
   ```
   
2. Switch to `docker-compose/APIM-with-Analytics` folder.
   ```
   cd docker-apim/docker-compose/APIM-with-Analytics
   ```

3. Execute following Docker command to start the deployment.
   ```
   docker-compose up
   ```

4. Once the deployment is started, try to access the web UIs via following URLs and default credentials <br> 
   on your favorite web browser.

   ```
   https://localhost:9443/publisher
   https://localhost:9443/store
   https://localhost:9443/admin
   https://localhost:9443/carbon
   ```
   Access the servers using following credentials.
   
   * Username: admin <br>
   * Password: admin

   Please note that API Gateway will be available on following ports.
   ```
   https://localhost:8243
   https://localhost:8280
   ```
   