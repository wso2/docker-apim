# WSO2 API Manager deployment with WSO2 API Manager Analytics

![alt tag](deployment-diagram.png)

## Prerequisites

 * Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   in order to run the steps provided in following Quick start guide. <br><br>
 * In order to run this Docker Compose setup, you will need an active [Free Trial Subscription](https://wso2.com/free-trial-subscription) 
   from WSO2 since the referring Docker images hosted at docker.wso2.com contains the latest updates and fixes for WSO2 API Manager and 
   API Manager Analytics 2.6.0 products. You can sign up for a Free Trial Subscription [here](https://wso2.com/free-trial-subscription). <br><br>
 * If you wish to run the Docker Compose setup using Docker images built locally, build Docker images using Docker resources available from [here](../../dockerfiles/) and remove the `docker.wso2.com/` prefix from the `image` name in the `docker-compose.yml`. <br><br>

## Quick Start Guide

1. Clone WSO2 API Manager Docker git repository.

   ```
   git clone https://github.com/wso2/docker-apim
   ```
   > If you are to try out an already released zip of this repo, please ignore this 1st step. 
   
2. Switch to `docker-compose/apim-with-analytics` folder.

   ```
   cd docker-apim/docker-compose/apim-with-analytics
   ```
   > If you are to try out an already released zip of this repo, please ignore this 2nd step also. 
    Instead, extract the zip file and directly browse to `docker-apim-<released-version-here>docker-compose/apim-with-analytics` folder. 
     
   > If you want to try out an already released tag, after executing 2nd step, checkout the relevant tag, 
    i.e. for example: git checkout tags/v2.6.0.1 and continue below steps.

3. Execute following Docker command to start the deployment.

   ```
   docker-compose up
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


## References

 * Docker Compose file version 3 does not support condition form of `depends_on` (refer official [documentation](https://docs.docker.com/compose/compose-file/#depends_on)).
   Hence, the current implementation of WSO2 product Docker Compose resources use sh-compatible [wait-for](https://github.com/eficode/wait-for/blob/master/wait-for) script
   to control the startup order of services, as suggested in Docker Compose official [documentation](https://docs.docker.com/compose/startup-order/).
