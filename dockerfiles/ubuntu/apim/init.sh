#!/bin/sh
# ------------------------------------------------------------------------
# Copyright 2018 WSO2, Inc. (http://wso2.com)
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

# product profile variable
wso2_server_profile=am

# custom WSO2 non-root user and group variables
user=wso2carbon
group=wso2

# file path variables
volumes=${WORKING_DIRECTORY}/wso2-server-volume
k8s_volumes=${WORKING_DIRECTORY}/kubernetes-volumes
temp_shared_artifacts=${WORKING_DIRECTORY}/wso2-tmp/server
original_shared_artifacts=${WSO2_SERVER_HOME}/repository/deployment/server

# capture the Docker container IP from the container's /etc/hosts file
docker_container_ip=$(awk 'END{print $1}' /etc/hosts)

# check if the WSO2 non-root user home exists
test ! -d ${WORKING_DIRECTORY} && echo "WSO2 Docker non-root user home does not exist" && exit 1

# check if the WSO2 product home exists
test ! -d ${WSO2_SERVER_HOME} && echo "WSO2 Docker product home does not exist" && exit 1

# copy the backed up artifacts from ${HOME}/wso2-tmp/server
# copying the initial artifacts to ${HOME}/wso2-tmp/server was done in the Dockerfile
# this is to preserve the initial artifacts in a volume mount (the mounted directory can be empty initially)
# the artifacts will be copied to the <WSO2_SERVER_HOME>/repository/deployment/server location,
# before the server is started
if test -d ${temp_shared_artifacts}; then
    if [ -z "$(ls -A ${original_shared_artifacts}/)" ]; then
	    # if no artifacts under <WSO2_SERVER_HOME>/repository/deployment/server; copy them
        echo "Copying shared server artifacts from temporary location to the original server home location..."
        cp -R ${temp_shared_artifacts}/* ${original_shared_artifacts}
    fi
fi

# check if any changed configuration files have been mounted, using K8s ConfigMap volumes

# since, K8s does not support building ConfigMaps recursively from a directory, each folder has been separately
# mounted in the form of a K8s ConfigMap volume
# copy the mounted configuration files (through ConfigMaps) to the product pack
if test -d ${k8s_volumes}/${wso2_server_profile}/bin; then
    cp -RL ${k8s_volumes}/${wso2_server_profile}/bin/* ${WSO2_SERVER_HOME}/bin
fi

if test -d ${k8s_volumes}/${wso2_server_profile}/conf; then
    cp -RL ${k8s_volumes}/${wso2_server_profile}/conf/* ${WSO2_SERVER_HOME}/repository/conf
fi

if test -d ${k8s_volumes}/${wso2_server_profile}/conf-axis2; then
    cp -RL ${k8s_volumes}/${wso2_server_profile}/conf-axis2/* ${WSO2_SERVER_HOME}/repository/conf/axis2
fi

if test -d ${k8s_volumes}/${wso2_server_profile}/conf-datasources; then
    cp -RL ${k8s_volumes}/${wso2_server_profile}/conf-datasources/* ${WSO2_SERVER_HOME}/repository/conf/datasources
fi

if test -d ${k8s_volumes}/${wso2_server_profile}/conf-identity; then
    cp -RL ${k8s_volumes}/${wso2_server_profile}/conf-identity/* ${WSO2_SERVER_HOME}/repository/conf/identity
fi

# copy configuration changes and external libraries

# check if any changed configuration files have been mounted
# if any file changes have been mounted, copy the WSO2 configuration files recursively
test -d ${volumes}/ && cp -r ${volumes}/* ${WSO2_SERVER_HOME}/

# make any runtime or node specific configuration changes
# for example, setting container IP in relevant configuration files

# set the Docker container IP as the `localMemberHost` under axis2.xml clustering configurations (effective only when clustering is enabled)
sed -i "s#<parameter\ name=\"localMemberHost\".*<\/parameter>#<parameter\ name=\"localMemberHost\">${docker_container_ip}<\/parameter>#" ${WSO2_SERVER_HOME}/repository/conf/axis2/axis2.xml

# start the WSO2 Carbon server
sh ${WSO2_SERVER_HOME}/bin/wso2server.sh
