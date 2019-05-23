# WSO2 API Manager with Identity Server as Key Manager


## Prerequisites

 * Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   in order to run the steps provided in following Quick start guide. <br><br>
 * In order to use Docker images with WSO2 updates, you need an active WSO2 subscription. If you do not possess an active WSO2
   subscription, you can sign up for a WSO2 Free Trial Subscription from [here](https://wso2.com/free-trial-subscription).
   Otherwise, you can proceed with Docker images which are created using GA releases.<br><br>
 * If you wish to run the Docker Compose setup using Docker images built locally, build Docker images using Docker resources available from [here](../../dockerfiles/) and remove the `docker.wso2.com/` prefix from the `image` name in the `docker-compose.yml`. <br><br>
    
## Quick Start Guide

1. Clone WSO2 API Manager Docker git repository.

    ```
    git clone https://github.com/wso2/docker-apim
    ```
    > If you are to try out an already released zip of this repo, please ignore this 1st step. 

2. Switch to the `docker-compose/apim-is-as-km-with-analytics` folder.

    ```
    cd docker-apim/docker-compose/apim-is-as-km-with-analytics
    ```
    > If you are to try out an already released zip of this repo, please ignore this 2nd step also. 
     Instead, extract the zip file and directly browse to `docker-apim-<released-version-here>docker-compose/apim-is-as-km-with-analytics` folder. 
     
    > If you want to try out an already released tag, after executing 2nd step, checkout the relevant tag, 
     i.e. for example: git checkout tags/v2.6.0.3 and continue below steps.

3. Execute the `deploy.sh` script to start the deployment.
     ```
     ./deploy.sh
     ```

4. Access the WSO2 API Manager web UIs using the below URLs via a web browser.

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

 WSO2 API Manager will use WSO2 Identity Server to generate OAuth2 tokens and validate those tokens <br> during API invocations.
 