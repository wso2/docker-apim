# WSO2 API Manager & API Micro Gateway deployment with WSO2 API Manager Analytics


## Prerequisites

 * Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   in order to run the steps provided in following Quick start guide. <br><br>
 * In order to run this Docker Compose setup, you will need an active [Free Trial Subscription](https://wso2.com/free-trial-subscription) 
   from WSO2 since the referring Docker images hosted at docker.wso2.com contains the latest updates and fixes for WSO2 API Microgateway <br>and 
   API Manager Analytics 2.2.0 products. You can sign up for a Free Trial Subscription [here](https://wso2.com/free-trial-subscription). <br><br>
 * If you wish to run the Docker Compose setup using Docker images built locally, build Docker images using <br> [WSO2 API Microgateway Dockerfile](../../dockerfiles/microgateway/README.md) and [WSO2 API Manager Analytics Dockerfile](../../dockerfiles/apim-analytics/README.md) and remove `docker.wso2.com/` prefix from the `image` name in `docker-compose.yml`.
   For example, change the line `image: docker.wso2.com/wso2am:2.2.0` to `image: wso2am:2.2.0`. <br>
  
<br>

## Quick Start Guide

1. Clone WSO2 APIM Docker git repository.
   ```
   git clone https://github.com/wso2/docker-apim
   ```
   > If you are to try out an already released zip of this repo, please ignore this 1st step. 
   
2. Switch to `docker-compose/APIM-Microgateway-with-Analytics` folder.
   ```
   cd docker-apim/docker-compose/APIM-Microgateway-with-Analytics
   ```
   > If you are to try out an already released zip of this repo, please ignore this 2nd step also. 
    Instead, extract the zip file and directly browse to `docker-apim-<released-version-here>docker-compose/APIM-Microgateway-with-Analytics` folder. 
     
   > If you want to try out an already released tag, after executing 2nd step, checkout the relevant tag, 
    i.e. for example: git checkout tags/v2.2.0.4 and continue below steps.

3. Execute following Docker command to start the deployment.
   ```
   docker-compose up
   ```

4. If you make any changes to the APIs or throttling policies after starting, restart the Microgateway server to make sure the changes are synced 
   ```
   docker-compose restart api-manager-gateway
   ```
   
5. Once the deployment is started, try to access the web UIs via following URLs and default credentials <br> 
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
   https://localhost:8244
   https://localhost:8243
   https://localhost:8280
   ```
   
