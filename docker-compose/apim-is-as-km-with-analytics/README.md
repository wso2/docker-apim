# WSO2 API Manager with Identity Server as Key Manager and API Manager Analytics Support

## Prerequisites

 * Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   in order to run the steps provided in following Quick start guide. <br><br>
 * In order to use Docker images with WSO2 updates, you need an active WSO2 subscription.
   Otherwise, you can proceed with Docker images available at [DockerHub](https://hub.docker.com/u/wso2/), which are created using GA releases.<br><br>
 * If you wish to run the Docker Compose setup using Docker images built locally, build Docker images using Docker resources available from [here](../../dockerfiles/) and remove the `docker.wso2.com/` prefix from the `image` name in the `docker-compose.yml`. <br><br>

## Quick Start Guide

1. Login to WSO2's Private Docker Registry via Docker client. When prompted, enter the username and password of your WSO2 Subscription.

   ```
   docker login docker.wso2.com
   ```

2. Clone WSO2 API Management Docker and Docker Compose resource Git repository.

   ```
   git clone https://github.com/wso2/docker-apim
   ```
   
   > If you are to try out an already released zip of this repo, please ignore this 2nd step. 

3. Switch to `docker-compose/apim-is-as-km-with-analytics` folder.

   ```
   cd docker-apim/docker-compose/apim-is-as-km-with-analytics
   ```
   > If you intend to try out an already released zip of this repository, extract the zip file and directly browse to
   `docker-apim-<released-version-here>/docker-compose/apim-is-as-km-with-analytics` folder. 
     
   > If you intend to try out an already released tag, after executing 2nd step, checkout the relevant tag, 
    i.e. for example: `git checkout tags/v3.2.0.1`, switch to `docker-compose/apim-is-as-km-with-analytics` folder and continue with below steps.

4. [Optional] Replace the existing IS extensions with the latest.

   For this, refer to steps `3`, `4` and `5` of the [`Configure WSO2 IS` section](https://apim.docs.wso2.com/en/next/administer/key-managers/configure-wso2is-connector/#step-1-configure-wso2-is).
   
   You may replace the JARs in `docker-compose/apim-is-as-km-with-analytics/dockerfiles/is-as-km/dropins` as defined in step 4.
   
   You may replace the web app in `docker-compose/apim-is-as-km-with-analytics/dockerfiles/is-as-km/webapps` as defined in step 5.

5. Execute following Docker Compose command to start the deployment.

   ```
   docker-compose up --build
   ```

6. Access the WSO2 API Manager web UIs using the below URLs via a web browser.

   ```
   https://localhost:9443/publisher
   https://localhost:9443/devportal
   https://localhost:9443/admin
   https://localhost:9443/carbon
   ```
   Login to the web UIs using following credentials.
   
   * Username: admin <br>
   * Password: admin

   Please note that API Gateway will be available on following ports.
   ```
   https://localhost:8243
   https://localhost:8280
   ```
   Access the WSO2 API Manager Analytics web UIs using the below URL via a web browser.
   
   ```
   https://localhost:9643/analytics-dashboard
   ```
   Login to the web UIs using following credentials.
    
   * Username: admin <br>
   * Password: admin
