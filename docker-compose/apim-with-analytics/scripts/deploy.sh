#!/bin/bash

# ------------------------------------------------------------------------
# Copyright 2019 WSO2, Inc. (http://wso2.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License
# ------------------------------------------------------------------------

set -e

ECHO=`which echo`
GREP=`which grep`
DOCKER_CLIENT=`which docker`
DOCKER_COMPOSE_CLIENT=`which docker-compose`
SED=`which sed`
TEST=`which test`

# methods
function echoBold () {
    ${ECHO} -e $'\e[1m'"${1}"$'\e[0m'
}

read -p "Do you have a WSO2 Subscription? (Y/N)" -n 1 -r
${ECHO}

if [[ ${REPLY} =~ ^[Yy]$ ]]; then
    read -p "Enter Your WSO2 Username: " WSO2_SUBSCRIPTION_USERNAME
    ${ECHO}
    read -s -p "Enter Your WSO2 Password: " WSO2_SUBSCRIPTION_PASSWORD
    ${ECHO}

    echoBold "Logging into WSO2 Private Docker Registry (docker.wso2.com)"
    ${DOCKER_CLIENT} login --username ${WSO2_SUBSCRIPTION_USERNAME} --password ${WSO2_SUBSCRIPTION_PASSWORD} docker.wso2.com

    if ! ${SED} -i.bak -e 's|wso2/|docker.wso2.com/|' ../docker-compose.yml; then
        echoBold "Could not configure to use the Docker image available at WSO2 Private Docker Registry (docker.wso2.com)"
        exit 1
    fi
elif [[ ${REPLY} =~ ^[Nn]$ || -z "${REPLY}" ]]; then
    if ! ${SED} -i.bak -e 's|docker.wso2.com/|wso2/|' ../docker-compose.yml; then
        echoBold "Could not configure to use the WSO2 Docker image available at DockerHub"
        exit 1
    fi
else
    echoBold "You have entered an invalid option."
    exit 1
fi

# remove backed up files
${TEST} -f ../*.bak && rm ../*.bak

cd ..

${DOCKER_COMPOSE_CLIENT} up -d

echoBold "
To access the Management Console of WSO2 API Manager, use https://localhost:9443/carbon.
To access the Publisher of WSO2 API Manager, use https://localhost:9443/publisher.
To access the Store of WSO2 API Manager, use https://localhost:9443/store.

To list the created WSO2 product server containers, use \`docker ps\` Docker client command.
For instructions to delete the created WSO2 product server setup, please see the Docker Compose FAQ (https://wso2.com/products/install/faq/#iDocker)."
