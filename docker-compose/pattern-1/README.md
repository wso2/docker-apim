### WSO2 API Manager 2.1.0 Deployment Pattern 1

![alt tag](am-2.1.0-pattern-1.png)

## Prerequisites

 * [Docker](https://www.docker.com/get-docker) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose) are required for running this Docker Compose template.

## Quick Start Guide

1. Build the WSO2 API manager 2.1.0 and API Manager Analytics 2.1.0 Docker images:

  *  [WSO2 API Manager Dockerfile](../../dockerfiles/apim/README.md)
  *  [WSO2 API Manager Analytics Dockerfile](../../dockerfiles/apim-analytics/README.md)


2. Pull MySQL Docker image:
     ```
     docker pull mysql:5.7.19
     ```

3. Switch to the docker-compose/pattern-1 folder:
    ```
    cd [docker-apim]/docker-compose/pattern-1
    ```

4. Download [MySQL Connector/J](https://downloads.mysql.com/archives/c-j/) v5.1.35 and copy its JAR file to the following path:
    ```
    [docker-apim]/docker-compose/pattern-1/api-manager/carbon/repository/components/lib/mysql-connector-java-5.1.35-bin.jar
    [docker-apim]/docker-compose/pattern-1/am-analytics/carbon/repository/components/lib/mysql-connector-java-5.1.35-bin.jar
    ```

6. Execute the following Docker Compose command to start the deployment:
    ```
    docker-compose up
    ```

7. Add the following entrie to the /etc/hosts.
    ```
    127.0.0.1 api-manager
    ```
8. Access the API Publisher and Store via the URLs given below.

    * API Publisher
    ```
    https://api-manager/publisher
    ```

    * API Store
    ```
    https://api-manager/store/
    ```