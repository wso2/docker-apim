# WSO2 API Manager with Micro Integrator

## Prerequisites

 * Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
   in order to run the steps provided in following Quick start guide. <br><br>
 * In order to use Docker images with WSO2 updates, you need an active WSO2 subscription.
   If you don't have a valid WSO2 Subscription, you need to build Docker images by source. Build Docker images using Docker resources available in [here](../../dockerfiles/) and replace the `docker.wso2.com/` prefix from the `image` name in the `docker-compose.yml`. <br><br>
* If you are trying this out on Apple Silicon (with M1), build images that supports arm64 architecture according to the instructions in [README](../../dockerfiles/ubuntu/apim/README.md). <br><br>

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

3. Switch to `docker-compose/apim-with-mi` folder.

   ```
   cd docker-apim/docker-compose/apim-with-mi
   ```
   > If you intend to try out an already released zip of this repository, extract the zip file and directly browse to
   `docker-apim-<released-version-here>/docker-compose/apim-with-mi` folder. 
     
   > If you intend to try out an already released tag, after executing 2nd step, checkout the relevant tag, 
    i.e. for example: `git checkout tags/v4.2.0.1`, switch to `docker-compose/apim-with-mi` folder and continue with below steps.

4. Add deployable `CAR` files
    
   You may add the relevant CAR files of your integration services to  `docker-compose/apim-with-mi/dockerfiles/mi/capps/`.

   Those will be added to the Service Catalog in APIM through Micro Integrator. For more information, refer the [documentation](https://apim.docs.wso2.com/en/4.2.0/tutorials/integration-tutorials/service-catalog-tutorial/#exposing-an-integration-service-as-a-managed-api).

   The backend service of the sample `CAR` provided can be found [here](https://github.com/wso2-docs/WSO2_EI/blob/master/Back-End-Service/Hospital-Service-JDK11-2.0.0.jar).

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

   Please note that API Gateway will be available on following ports.
   ```
   https://localhost:8243
   https://localhost:8280
   ```
